function TaskCard({ task, onUpdate, showActions = true }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow border border-stone-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-charcoal mb-2">{task.title}</h3>
          <p className="text-architectural mb-3">{task.description}</p>
          <div className="flex items-center space-x-4 text-sm text-stone-600">
            <span>Property ID: {task.propertyId}</span>
            {task.dueDate && (
              <span>Due: {formatDate(task.dueDate)}</span>
            )}
            {task.completedDate && (
              <span className="text-eucalyptus-500">Completed: {formatDate(task.completedDate)}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            task.priority === 'high' ? 'bg-error/20 text-error' :
            task.priority === 'medium' ? 'bg-warning/20 text-warning' :
            'bg-stone-200 text-stone-700'
          }`}>
            {task.priority}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            task.status === 'completed' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
            task.status === 'in_progress' ? 'bg-obsidian-100 text-obsidian-500' :
            'bg-warning/20 text-warning'
          }`}>
            {task.status}
          </span>
        </div>
      </div>

      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4 pt-4 border-t border-stone-300">
          <p className="text-sm font-medium text-charcoal mb-2">Attachments:</p>
          <div className="flex flex-wrap gap-2">
            {task.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-porcelain text-charcoal rounded-lg text-sm hover:bg-stone-200 transition-colors"
              >
                {att.fileName || att.type}
              </a>
            ))}
          </div>
        </div>
      )}

      {showActions && onUpdate && (
        <div className="pt-4 border-t border-stone-300">
          <button
            onClick={() => onUpdate(task)}
            className="px-4 py-2 bg-obsidian-500 text-porcelain rounded-lg hover:bg-obsidian-600 transition-colors text-sm"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;

