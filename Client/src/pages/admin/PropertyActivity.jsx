import { useState, useEffect, useRef, useMemo } from 'react';
import { adminAPI } from '../../services/api';

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
              <button
                onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isAutoRefreshEnabled
                    ? 'bg-eucalyptus text-porcelain hover:opacity-90'
                    : 'bg-stone-300 text-charcoal hover:bg-stone-400'
                }`}
              >
                {isAutoRefreshEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            {isAutoRefreshEnabled && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian text-sm"
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
              </select>
            )}
            <button
              onClick={() => loadActivityData()}
              disabled={loading}
              className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light font-semibold disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
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
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-architectural">Total Properties</h3>
                <svg className="w-5 h-5 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-charcoal">{stats.totalProperties}</p>
            </div>

            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-architectural">Created Today</h3>
                <svg className="w-5 h-5 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-charcoal">{stats.propertiesCreatedToday}</p>
            </div>

            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-architectural">Activity (24h)</h3>
                <svg className="w-5 h-5 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-charcoal">{stats.recentActivity.last24Hours}</p>
            </div>

            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-architectural">Activity (7d)</h3>
                <svg className="w-5 h-5 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-charcoal">{stats.recentActivity.last7Days}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
            <button
              onClick={() => loadActivityData()}
              className="ml-4 px-3 py-1 bg-error text-porcelain rounded hover:opacity-90 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            />
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value, offset: 0 })}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            >
              {propertyActions.map(action => (
                <option key={action.value} value={action.value}>{action.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Property ID"
              value={filters.propertyId}
              onChange={(e) => setFilters({ ...filters, propertyId: e.target.value, offset: 0 })}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value, offset: 0 })}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value, offset: 0 })}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({
                  action: '',
                  propertyId: '',
                  userId: '',
                  startDate: '',
                  endDate: '',
                  limit: 50,
                  offset: 0
                })}
                className="px-4 py-2 bg-stone-300 text-charcoal rounded-lg hover:bg-stone-400 font-semibold text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-charcoal">Activity Feed</h2>
            <span className="text-sm text-architectural">
              Showing {filteredLogs.length} of {total} activities
            </span>
          </div>

          {loading && logs.length === 0 ? (
            <div className="py-12 text-center text-architectural">Loading activity...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-architectural">No property activity found</div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {filteredLogs.map((log) => {
                const isNew = newActivityIds.has(log.id);
                return (
                  <div
                    key={log.id}
                    className={`bg-porcelain rounded-lg p-4 border border-stone-200 hover:bg-stone-50 transition-all ${
                      isNew ? 'animate-pulse border-eucalyptus border-2' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isNew && (
                            <span className="px-2 py-1 bg-eucalyptus text-porcelain rounded text-xs font-semibold animate-bounce">
                              NEW
                            </span>
                          )}
                          <span className="px-2 py-1 bg-obsidian/10 text-obsidian rounded text-xs font-semibold">
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
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {total > filteredLogs.length && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setFilters({ ...filters, limit: filters.limit + 50 })}
                className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light font-semibold"
              >
                Load More ({total - filteredLogs.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyActivity;

