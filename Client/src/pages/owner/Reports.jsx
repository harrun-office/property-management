import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="40%" className="mb-2" />
            <Skeleton variant="text" width="60%" />
          </div>
          <Skeleton.Card />
        </div>
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

        {error && <ErrorDisplay message={error} onRetry={loadReport} className="mb-6" />}

        <Card variant="elevated" padding="lg">
          <Card.Title className="text-2xl mb-4">Monthly Income</Card.Title>
          {incomeReport && incomeReport.monthlyIncome && Object.keys(incomeReport.monthlyIncome).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(incomeReport.monthlyIncome)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([month, income]) => (
                  <Card key={month} variant="filled" padding="sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-charcoal">{month}</span>
                      <span className="text-lg font-bold text-charcoal">${income.toLocaleString()}</span>
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            <EmptyState
              title="No income data available"
              description="Income reports will appear here once you have payment data."
              icon={
                <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default Reports;

