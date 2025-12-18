function AuditLogTable({ logs, onFilter }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-architectural">No audit logs found</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-100 rounded-2xl shadow-md overflow-hidden border border-stone-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-porcelain">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-stone-200 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-architectural">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                  {log.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-obsidian-100 text-obsidian-500 rounded">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-architectural">
                  {log.resourceType} #{log.resourceId}
                </td>
                <td className="px-6 py-4 text-sm text-architectural">
                  <pre className="text-xs bg-porcelain p-2 rounded overflow-x-auto max-w-md">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-architectural">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogTable;

