import { useState, useEffect } from 'react';
import { tenantAPI } from '../../services/api';

function TenantDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tenantAPI.getDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = typeFilter === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === typeFilter);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lease':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'receipt':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      lease: 'bg-obsidian/20 text-obsidian',
      receipt: 'bg-eucalyptus/20 text-eucalyptus',
      notice: 'bg-warning/20 text-warning'
    };
    return styles[type] || 'bg-stone-200 text-charcoal';
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Documents</h1>
          <p className="text-architectural">Access your important documents and receipts</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          >
            <option value="all">All Documents</option>
            <option value="lease">Lease Agreements</option>
            <option value="receipt">Receipts</option>
            <option value="notice">Notices</option>
          </select>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="bg-stone-100 rounded-xl shadow-md p-8 text-center border border-stone-200">
            <p className="text-architectural">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-stone-100 rounded-xl shadow-md p-12 text-center border border-stone-200">
            <svg className="w-16 h-16 mx-auto text-architectural mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No documents found</h3>
            <p className="text-architectural">Documents will appear here once available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-obsidian/10 rounded-lg flex items-center justify-center text-obsidian">
                    {getTypeIcon(doc.type)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadge(doc.type)}`}>
                    {doc.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">{doc.name}</h3>
                <p className="text-sm text-architectural mb-4">
                  Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => alert('Document download feature coming soon')}
                  className="w-full px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantDocuments;

