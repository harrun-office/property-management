import { useState, useEffect, useRef, useMemo } from 'react';
import { adminAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import MetricCard from '../../components/ui/MetricCard';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function PropertyActivity() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds
  const [newActivityIds, setNewActivityIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  const intervalRef = useRef(null);
  const previousLogIdsRef = useRef(new Set());

  const [filters, setFilters] = useState({
    action: '',
    propertyId: '',
    userId: '',
    startDate: '',
    endDate: '',
    limit: 50,
    offset: 0
  });

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Load property activity data
  const loadActivityData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getPropertyActivity(filters);
      const previousIds = previousLogIdsRef.current;
      const currentIds = new Set(data.logs.map(log => log.id));
      
      // Find new activities
      const newIds = new Set();
      data.logs.forEach(log => {
        if (!previousIds.has(log.id)) {
          newIds.add(log.id);
        }
      });

      // Update new activity IDs
      if (newIds.size > 0) {
        setNewActivityIds(prev => {
          const combined = new Set(prev);
          newIds.forEach(id => combined.add(id));
          return combined;
        });

        // Remove "new" badge after 30 seconds
        setTimeout(() => {
          setNewActivityIds(prev => {
            const updated = new Set(prev);
            newIds.forEach(id => updated.delete(id));
            return updated;
          });
        }, 30000);
      }

      previousLogIdsRef.current = currentIds;
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setLastRefreshTime(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load property activity');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const data = await adminAPI.getPropertyActivityStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadActivityData();
    loadStats();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      loadActivityData(false); // Don't show loading spinner on auto-refresh
    }, refreshInterval * 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, refreshInterval, filters]);

  // Reload when filters change
  useEffect(() => {
    loadActivityData();
  }, [filters.action, filters.propertyId, filters.userId, filters.startDate, filters.endDate, filters.limit]);

  // Handle page visibility (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (isAutoRefreshEnabled) {
        loadActivityData(false);
        intervalRef.current = setInterval(() => {
          loadActivityData(false);
        }, refreshInterval * 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAutoRefreshEnabled, refreshInterval]);

  // Filter logs by search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;

    const query = searchQuery.toLowerCase();
    return logs.filter(log => {
      const matchesAction = log.action?.toLowerCase().includes(query);
      const matchesUser = log.userName?.toLowerCase().includes(query) || 
                         log.userEmail?.toLowerCase().includes(query);
      const matchesProperty = log.property?.title?.toLowerCase().includes(query) ||
                             log.property?.address?.toLowerCase().includes(query) ||
                             String(log.resourceId || '').includes(query);
      const matchesDetails = JSON.stringify(log.details || {}).toLowerCase().includes(query);

      return matchesAction || matchesUser || matchesProperty || matchesDetails;
    });
  }, [logs, searchQuery]);

  // Property-related action types
  const propertyActions = [
    { value: '', label: 'All Actions' },
    { value: 'create_property', label: 'Create Property' },
    { value: 'update_property', label: 'Update Property' },
    { value: 'delete_property', label: 'Delete Property' },
    { value: 'update_property_status', label: 'Update Status' },
    { value: 'assign_properties', label: 'Assign Properties' },
    { value: 'assign_vendor_to_property', label: 'Assign Vendor' },
    { value: 'create_task', label: 'Create Task' }
  ];

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">Property Activity Monitor</h1>
            <p className="text-architectural">Real-time monitoring of all property-related activities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-architectural">Auto-refresh:</label>
              <Button
                variant={isAutoRefreshEnabled ? "success" : "secondary"}
                size="sm"
                onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
              >
                {isAutoRefreshEnabled ? 'ON' : 'OFF'}
              </Button>
            </div>
            {isAutoRefreshEnabled && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-3 py-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 text-sm transition-colors"
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
              </select>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => loadActivityData()}
              disabled={loading}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Last Refresh Indicator */}
        {lastRefreshTime && (
          <div className="text-sm text-architectural">
            Last updated: {lastRefreshTime.toLocaleTimeString()}
            {isAutoRefreshEnabled && (
              <span className="ml-2 text-eucalyptus">● Auto-refresh enabled ({refreshInterval}s)</span>
            )}
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Properties"
              value={stats.totalProperties.toString()}
              variant="primary"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <MetricCard
              title="Created Today"
              value={stats.propertiesCreatedToday.toString()}
              variant="default"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Activity (24h)"
              value={stats.recentActivity.last24Hours.toString()}
              variant="default"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <MetricCard
              title="Activity (7d)"
              value={stats.recentActivity.last7Days.toString()}
              variant="default"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>
        )}

        {/* Error Message */}
        {error && <ErrorDisplay message={error} onRetry={() => loadActivityData()} className="mb-6" />}

        {/* Filters and Search */}
        <Card variant="elevated" padding="lg">
          <Card.Title className="mb-4">Filters</Card.Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value, offset: 0 })}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
              >
                {propertyActions.map(action => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
            </div>
            <Input
              type="number"
              placeholder="Property ID"
              value={filters.propertyId}
              onChange={(e) => setFilters({ ...filters, propertyId: e.target.value, offset: 0 })}
            />
            <Input
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value, offset: 0 })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value, offset: 0 })}
            />
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => setFilters({
                  action: '',
                  propertyId: '',
                  userId: '',
                  startDate: '',
                  endDate: '',
                  limit: 50,
                  offset: 0
                })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <Card.Title className="text-2xl">Activity Feed</Card.Title>
            <span className="text-sm text-architectural">
              Showing {filteredLogs.length} of {total} activities
            </span>
          </div>

          {loading && logs.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton.Card key={i} />
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <EmptyState
              title="No property activity found"
              description="No activities match your current filters."
              icon={
                <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {filteredLogs.map((log) => {
                const isNew = newActivityIds.has(log.id);
                return (
                  <Card
                    key={log.id}
                    variant={isNew ? "filled" : "default"}
                    padding="md"
                    hover
                    className={isNew ? 'border-eucalyptus-500 border-2' : ''}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {isNew && (
                            <span className="px-2 py-1 bg-eucalyptus-500 text-porcelain rounded text-xs font-semibold animate-bounce">
                              NEW
                            </span>
                          )}
                          <span className="px-2 py-1 bg-obsidian-100 text-obsidian-700 rounded text-xs font-semibold">
                            {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="px-2 py-1 bg-stone-200 text-charcoal rounded text-xs">
                            {log.resourceType}
                          </span>
                          {log.property && (
                            <span className="px-2 py-1 bg-stone-200 text-charcoal rounded text-xs">
                              Property: {log.property.title || `ID ${log.property.id}`}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-charcoal mb-1">
                          <span className="font-semibold">{log.userName}</span> ({log.userRole})
                          {log.property && (
                            <span className="text-architectural ml-2">
                              • {log.property.address}
                            </span>
                          )}
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-xs text-architectural mt-1">
                            {Object.entries(log.details).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                <span className="font-medium">{key}:</span>{' '}
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs text-architectural mt-2">
                          <span>{formatRelativeTime(log.timestamp)}</span>
                          <span>•</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          {log.ipAddress && (
                            <>
                              <span>•</span>
                              <span>IP: {log.ipAddress}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {total > filteredLogs.length && (
            <div className="mt-4 text-center">
              <Button
                variant="primary"
                onClick={() => setFilters({ ...filters, limit: filters.limit + 50 })}
              >
                Load More ({total - filteredLogs.length} remaining)
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default PropertyActivity;

