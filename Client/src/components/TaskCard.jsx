import Card from './ui/Card';
import Button from './ui/Button';

function TaskCard({ task, onUpdate, showActions = true }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card variant="elevated" padding="lg" hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Card.Title className="mb-2">{task.title}</Card.Title>
          <Card.Description className="mb-3">{task.description}</Card.Description>
          <div className="flex items-center flex-wrap gap-3 text-sm text-architectural">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Property ID: {task.propertyId}
            </span>
            {task.dueDate && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Due: {formatDate(task.dueDate)}
              </span>
            )}
            {task.completedDate && (
              <span className="flex items-center text-eucalyptus-600">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed: {formatDate(task.completedDate)}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            task.priority === 'high' ? 'bg-error-100 text-error-700' :
            task.priority === 'medium' ? 'bg-warning-100 text-warning-700' :
            'bg-stone-200 text-stone-700'
          }`}>
            {task.priority}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            task.status === 'completed' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
            task.status === 'in_progress' ? 'bg-obsidian-100 text-obsidian-700' :
            'bg-warning-100 text-warning-700'
          }`}>
            {task.status}
          </span>
        </div>
      </div>

      {task.attachments && task.attachments.length > 0 && (
        <Card.Footer className="mb-4">
          <p className="text-sm font-medium text-charcoal mb-2">Attachments:</p>
          <div className="flex flex-wrap gap-2">
            {task.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-stone-100 text-charcoal rounded-lg text-sm hover:bg-stone-200 transition-colors border border-stone-200"
              >
                {att.fileName || att.type}
              </a>
            ))}
          </div>
        </Card.Footer>
      )}

      {showActions && onUpdate && (
        <Card.Footer>
          <Button variant="primary" size="sm" onClick={() => onUpdate(task)}>
            View Details
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
}

export default TaskCard;

