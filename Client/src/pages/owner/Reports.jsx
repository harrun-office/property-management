import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';

function Reports() {
  const [incomeReport, setIncomeReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getIncomeReport();
      setIncomeReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Financial Reports</h1>
          <p className="text-architectural">View your income and financial reports</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-stone-100 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">Monthly Income</h2>
          {incomeReport && incomeReport.monthlyIncome && Object.keys(incomeReport.monthlyIncome).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(incomeReport.monthlyIncome)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([month, income]) => (
                  <div key={month} className="flex items-center justify-between p-3 bg-porcelain rounded-lg">
                    <span className="font-medium text-charcoal">{month}</span>
                    <span className="text-lg font-bold text-charcoal">${income.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No income data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;

