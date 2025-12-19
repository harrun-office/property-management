import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [paymentsData, summaryData] = await Promise.all([
        ownerAPI.getPayments(),
        ownerAPI.getPaymentSummary()
      ]);
      setPayments(paymentsData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Payments</h1>
          <p className="text-architectural">Track rent payments and income</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-stone-100 rounded-xl shadow-md p-6">
              <p className="text-architectural text-sm mb-1">Total Collected</p>
              <p className="text-3xl font-bold text-charcoal">${(summary.totalCollected || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="bg-stone-100 rounded-xl shadow-md p-6">
              <p className="text-architectural text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-charcoal">{summary.pendingPayments || 0}</p>
            </div>
            <div className="bg-stone-100 rounded-xl shadow-md p-6">
              <p className="text-architectural text-sm mb-1">Overdue</p>
              <p className="text-3xl font-bold text-error">{summary.overduePayments || 0}</p>
            </div>
            <div className="bg-stone-100 rounded-xl shadow-md p-6">
              <p className="text-architectural text-sm mb-1">Expected</p>
              <p className="text-3xl font-bold text-charcoal">${(summary.totalExpected || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Monthly</p>
            </div>
          </div>
        )}

        {payments.length === 0 ? (
          <div className="bg-stone-100 rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No payments yet</p>
          </div>
        ) : (
          <div className="bg-stone-100 rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-porcelain">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      {payment.tenant?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-architectural">
                      {payment.property?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal">
                      ${(payment.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-architectural">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid' ? 'bg-eucalyptus/20 text-eucalyptus' :
                        payment.status === 'overdue' ? 'bg-error/20 text-error' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payments;

