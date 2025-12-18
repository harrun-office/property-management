import { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">View and manage your assigned tasks</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-gray-600 text-lg">No tasks assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Property ID: {task.propertyId}</span>
                      {task.dueDate && (
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status}
                  </span>
                </div>

                {/* Status Update */}
                <div className="mb-4 pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <div className="flex space-x-2">
                    {task.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(task.id, 'pending')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Mark as Pending
                      </button>
                    )}
                    {task.status !== 'in_progress' && (
                      <button
                        onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Start Work
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusUpdate(task.id, 'completed')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFileInput(task.id, 'photo')}
                      disabled={uploadingFile === task.id}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                      Upload Photo
                    </button>
                    <button
                      onClick={() => handleFileInput(task.id, 'invoice')}
                      disabled={uploadingFile === task.id}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                      Upload Invoice
                    </button>
                    <button
                      onClick={() => handleFileInput(task.id, 'report')}
                      disabled={uploadingFile === task.id}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                      Upload Report
                    </button>
                  </div>
                </div>

                {/* Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {task.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                        >
                          {att.fileName || att.type}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;

