import { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingFile, setUploadingFile] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vendorAPI.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await vendorAPI.updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (taskId, fileType, fileUrl, fileName) => {
    setUploadingFile(taskId);
    try {
      await vendorAPI.uploadFile(taskId, fileType, fileUrl, fileName);
      loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingFile(null);
    }
  };

  const handleFileInput = (taskId, fileType) => {
    const fileUrl = prompt(`Enter ${fileType} URL:`);
    const fileName = prompt(`Enter file name:`);
    if (fileUrl && fileName) {
      handleFileUpload(taskId, fileType, fileUrl, fileName);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">My Tasks</h1>
          <p className="text-architectural">View and manage your assigned tasks</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadTasks} className="mb-6" />}

        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks assigned yet"
            description="You don't have any tasks assigned at the moment."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <Card key={task.id} variant="elevated" padding="lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Card.Title className="text-xl mb-2">{task.title}</Card.Title>
                    <Card.Description className="mb-4">{task.description}</Card.Description>
                    <div className="flex items-center gap-4 text-sm text-architectural flex-wrap">
                      <span>Property ID: {task.propertyId}</span>
                      {task.dueDate && (
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.priority === 'high' ? 'bg-error-100 text-error-700' :
                        task.priority === 'medium' ? 'bg-warning-100 text-warning-700' :
                        'bg-stone-200 text-charcoal'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'completed' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                    task.status === 'in_progress' ? 'bg-obsidian-100 text-obsidian-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>
                    {task.status}
                  </span>
                </div>

                {/* Status Update */}
                <Card.Footer className="mb-4 pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Update Status</label>
                    <div className="flex gap-2 flex-wrap">
                      {task.status !== 'pending' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusUpdate(task.id, 'pending')}
                        >
                          Mark as Pending
                        </Button>
                      )}
                      {task.status !== 'in_progress' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                        >
                          Start Work
                        </Button>
                      )}
                      {task.status !== 'completed' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusUpdate(task.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Footer>

                {/* File Upload */}
                <Card.Footer className="pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Upload Files</label>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleFileInput(task.id, 'photo')}
                        disabled={uploadingFile === task.id}
                        loading={uploadingFile === task.id}
                      >
                        Upload Photo
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleFileInput(task.id, 'invoice')}
                        disabled={uploadingFile === task.id}
                        loading={uploadingFile === task.id}
                      >
                        Upload Invoice
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleFileInput(task.id, 'report')}
                        disabled={uploadingFile === task.id}
                        loading={uploadingFile === task.id}
                      >
                        Upload Report
                      </Button>
                    </div>
                  </div>
                </Card.Footer>

                {/* Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <Card.Footer className="mt-4 pt-4 border-t border-stone-200">
                    <p className="text-sm font-medium text-charcoal mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {task.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-stone-100 text-charcoal rounded-lg text-sm hover:bg-stone-200 transition-colors"
                        >
                          {att.fileName || att.type}
                        </a>
                      ))}
                    </div>
                  </Card.Footer>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;

