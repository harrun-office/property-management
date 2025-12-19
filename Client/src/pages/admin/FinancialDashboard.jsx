import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../../services/api';

function FinancialDashboard() {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadFinancialData();
  }, [filters]);

  const loadFinancialData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getFinancialData(filters);
      setFinancialData(data);
    } catch (err) {
      // Mock data for development
      setFinancialData({
        totalRevenue: 125000,
        monthlyRevenue: 25000,
        totalPayments: 450,
        pendingPayments: 12,
        revenueByMonth: [
          { month: 'Jan', revenue: 18000, payments: 35 },
          { month: 'Feb', revenue: 22000, payments: 42 },
          { month: 'Mar', revenue: 25000, payments: 48 },
          { month: 'Apr', revenue: 24000, payments: 46 },
          { month: 'May', revenue: 26000, payments: 50 },
          { month: 'Jun', revenue: 25000, payments: 48 }
        ],
        revenueByProperty: [
          { property: '123 Main St', revenue: 12000 },
          { property: '456 Oak Ave', revenue: 15000 },
          { property: '789 Pine St', revenue: 10000 },
          { property: '321 Elm Dr', revenue: 8000 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading financial data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Financial Dashboard</h1>
          <p className="text-architectural">Revenue, payments, and financial analytics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Financial Stats */}
        {financialData && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-sm font-medium text-architectural mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-eucalyptus">${financialData.totalRevenue?.toLocaleString() || 0}</p>
              <p className="text-xs text-architectural mt-2">All time</p>
            </div>
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-sm font-medium text-architectural mb-2">Monthly Revenue</h3>
              <p className="text-3xl font-bold text-obsidian">${financialData.monthlyRevenue?.toLocaleString() || 0}</p>
              <p className="text-xs text-architectural mt-2">This month</p>
            </div>
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-sm font-medium text-architectural mb-2">Total Payments</h3>
              <p className="text-3xl font-bold text-brass">{financialData.totalPayments || 0}</p>
              <p className="text-xs text-architectural mt-2">Completed</p>
            </div>
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-sm font-medium text-architectural mb-2">Pending Payments</h3>
              <p className="text-3xl font-bold text-warning">{financialData.pendingPayments || 0}</p>
              <p className="text-xs text-architectural mt-2">Awaiting</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {financialData && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-xl font-bold text-charcoal mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={financialData.revenueByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6CFC4" />
                  <XAxis dataKey="month" stroke="#6B7875" />
                  <YAxis stroke="#6B7875" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2D5F5F" fill="#2D5F5F" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Payments Trend */}
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-xl font-bold text-charcoal mb-4">Payments Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData.revenueByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6CFC4" />
                  <XAxis dataKey="month" stroke="#6B7875" />
                  <YAxis stroke="#6B7875" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="payments" stroke="#E8B86D" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Property */}
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200 md:col-span-2">
              <h3 className="text-xl font-bold text-charcoal mb-4">Revenue by Property</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData.revenueByProperty || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6CFC4" />
                  <XAxis dataKey="property" stroke="#6B7875" />
                  <YAxis stroke="#6B7875" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                  <Bar dataKey="revenue" fill="#5FB896" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancialDashboard;

