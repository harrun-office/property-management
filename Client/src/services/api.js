export const BASE_URL = 'http://localhost:5005';
// export const BASE_URL = 'https://property-management-8b1d.onrender.com/api';
const API_BASE_URL = `${BASE_URL}/api`;

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token })
  };
}

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  register: async (email, password, name, role, mobileNumber) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name, role, mobileNumber })
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
};

// Invitation API
export const invitationAPI = {
  validate: async (token) => {
    const response = await fetch(`${API_BASE_URL}/invitations/validate/${token}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Invalid invitation token');
    }

    return response.json();
  },

  accept: async (token, password) => {
    const response = await fetch(`${API_BASE_URL}/invitations/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to accept invitation');
    }

    return response.json();
  }
};

// Super Admin API
export const adminAPI = {
  createPropertyManager: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/property-managers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create property manager');
    }

    return response.json();
  },

  getPropertyManagers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/property-managers`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to fetch property managers');
    }

    return response.json();
  },

  updatePropertyManager: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/property-managers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update property manager');
    }

    return response.json();
  },

  suspendPropertyManager: async (id, data = {}) => {
    const response = await fetch(`${API_BASE_URL}/admin/property-managers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to suspend property manager');
    }

    return response.json();
  },

  assignProperties: async (managerId, propertyIds) => {
    const response = await fetch(`${API_BASE_URL}/admin/property-managers/${managerId}/assign-properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ propertyIds })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to assign properties');
    }

    return response.json();
  },

  createVendor: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create vendor');
    }

    return response.json();
  },

  getVendors: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }

    return response.json();
  },

  getVendorById: async (vendorId) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendor');
    }

    return response.json();
  },

  updateVendor: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update vendor');
    }

    return response.json();
  },

  suspendVendor: async (id, data = {}) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to suspend vendor');
    }

    return response.json();
  },

  activateVendor: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}/activate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to activate vendor');
    }

    return response.json();
  },

  activatePropertyManager: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/property-managers/${id}/activate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to activate property manager');
    }

    return response.json();
  },

  resetPassword: async (userId, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset password');
    }

    return response.json();
  },

  getManagersPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/performance/managers`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch managers performance');
    }

    return response.json();
  },

  getVendorsPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/performance/vendors`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendors performance');
    }

    return response.json();
  },

  getAuditLogs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.action) queryParams.append('action', params.action);
    if (params.resourceType) queryParams.append('resourceType', params.resourceType);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/admin/audit-logs?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch audit logs');
    }

    return response.json();
  },

  getSystemOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/system-overview`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch system overview');
    }

    return response.json();
  },

  getPropertyActivity: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.action) queryParams.append('action', params.action);
    if (params.propertyId) queryParams.append('propertyId', params.propertyId);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/admin/property-activity?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch property activity');
    }

    return response.json();
  },

  getPropertyActivityStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/property-activity/stats`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch property activity stats');
    }

    return response.json();
  }
};

// Property Manager API
export const propertyManagerAPI = {
  getProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/property-manager/properties`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
  },

  createVendor: async (data) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/vendors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create vendor');
    }

    return response.json();
  },

  getVendors: async () => {
    const response = await fetch(`${API_BASE_URL}/property-manager/vendors`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }

    return response.json();
  },

  updateVendor: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/vendors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update vendor');
    }

    return response.json();
  },

  assignVendorToProperty: async (vendorId, propertyId, permissionScope) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/vendors/${vendorId}/assign-property`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ propertyId, permissionScope })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to assign vendor to property');
    }

    return response.json();
  },

  createTask: async (data) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create task');
    }

    return response.json();
  },

  getTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/property-manager/tasks`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return response.json();
  },

  updateTask: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update task');
    }

    return response.json();
  },

  getReports: async () => {
    const response = await fetch(`${API_BASE_URL}/property-manager/reports`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }

    return response.json();
  },

  // Manager Subscription Methods
  getMySubscriptions: async () => {
    const response = await fetch(`${API_BASE_URL}/property-manager/subscriptions`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch subscriptions');
    }

    return response.json();
  },

  getSubscriptionDetails: async (id) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/subscriptions/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch subscription details');
    }

    return response.json();
  },

  initiateContact: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/subscriptions/${id}/contact`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate contact');
    }

    return response.json();
  },

  uploadPropertyDetails: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/property-manager/subscriptions/${id}/upload-property`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload property details');
    }

    return response.json();
  },

  getSubscriptionRevenue: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/property-manager/subscriptions/revenue?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch revenue');
    }

    return response.json();
  },

  getOwnerReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/property-manager/subscriptions/reviews`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch reviews');
    }

    return response.json();
  }
};

// Vendor API
export const vendorAPI = {
  getProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/vendor/properties`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
  },

  getTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/vendor/tasks`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return response.json();
  },

  updateTaskStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/vendor/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update task status');
    }

    return response.json();
  },

  uploadFile: async (taskId, fileType, fileUrl, fileName) => {
    const response = await fetch(`${API_BASE_URL}/vendor/tasks/${taskId}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ fileType, fileUrl, fileName })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/vendor/profile`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendor profile');
    }

    return response.json();
  }
};

// Legacy Properties API (for public property browsing)
export const propertiesAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);

    const url = `${API_BASE_URL}/properties${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Property not found');
      }
      throw new Error('Failed to fetch property');
    }

    return response.json();
  },

  getSavedProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/saved-properties`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch saved properties');
    return response.json();
  },

  saveProperty: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/tenant/saved-properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ propertyId })
    });

    if (!response.ok) throw new Error('Failed to save property');
    return response.json();
  },

  unsaveProperty: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/tenant/saved-properties/${propertyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to remove saved property');
    return response.json();
  },

  getMyApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/applications`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  }
};

// Property Owner API
export const ownerAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/dashboard`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
  },

  getProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
    if (filters.search) queryParams.append('search', filters.search);

    const url = `${API_BASE_URL}/owner/properties${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
  },

  createProperty: async (data) => {
    const response = await fetch(`${API_BASE_URL}/owner/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create property');
    }

    return response.json();
  },

  updateProperty: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/owner/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update property');
    }

    return response.json();
  },

  deleteProperty: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete property');
    }

    return response.json();
  },

  updatePropertyStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/owner/properties/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update property status');
    }

    return response.json();
  },



  getApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/applications`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return response.json();
  },

  getApplication: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/applications/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }

    return response.json();
  },

  updateApplication: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/owner/applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update application');
    }

    return response.json();
  },

  addApplicationNote: async (id, note) => {
    const response = await fetch(`${API_BASE_URL}/owner/applications/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add note');
    }

    return response.json();
  },

  getTenants: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/tenants`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tenants');
    }

    return response.json();
  },

  getTenant: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/tenants/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tenant');
    }

    return response.json();
  },

  endTenancy: async (tenantId, reason, notes) => {
    const response = await fetch(`${API_BASE_URL}/owner/tenants/${tenantId}/end-tenancy`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason, notes })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to end tenancy');
    }

    return response.json();
  },

  getMessages: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/messages`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  getMessage: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/messages/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch message');
    }

    return response.json();
  },

  sendMessage: async (data) => {
    const response = await fetch(`${API_BASE_URL}/owner/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  },

  markMessageRead: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/messages/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }

    return response.json();
  },

  getViewings: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/viewings`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch viewing requests');
    }

    return response.json();
  },

  updateViewing: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/owner/viewings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update viewing request');
    }

    return response.json();
  },

  getPayments: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/payments`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    return response.json();
  },

  getPaymentSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/payments/summary`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment summary');
    }

    return response.json();
  },

  createPayment: async (data) => {
    const response = await fetch(`${API_BASE_URL}/owner/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment');
    }

    return response.json();
  },

  updatePayment: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/owner/payments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update payment');
    }

    return response.json();
  },

  getIncomeReport: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/reports/income`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch income report');
    }

    return response.json();
  },

  getMonthlyReport: async (month, year) => {
    const response = await fetch(`${API_BASE_URL}/owner/reports/monthly?month=${month}&year=${year}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly report');
    }

    return response.json();
  },

  getYearlyReport: async (year) => {
    const response = await fetch(`${API_BASE_URL}/owner/reports/yearly?year=${year}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch yearly report');
    }

    return response.json();
  },

  getPropertyPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/analytics/property-performance`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch property performance');
    }

    return response.json();
  },

  getFinancialAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/analytics/financial`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch financial analytics');
    }

    return response.json();
  },

  getTenantAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/analytics/tenant`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tenant analytics');
    }

    return response.json();
  },

  getMaintenance: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/maintenance`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance requests');
    }

    return response.json();
  },

  getMaintenanceRequest: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/maintenance/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch maintenance request');
    }

    return response.json();
  },

  updateMaintenance: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/owner/maintenance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update maintenance request');
    }

    return response.json();
  },

  addMaintenanceNote: async (id, note) => {
    const response = await fetch(`${API_BASE_URL}/owner/maintenance/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add note');
    }

    return response.json();
  },

  // Manager Subscription Methods
  getAvailableManagers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.rating) queryParams.append('rating', params.rating);
    if (params.priceRange) queryParams.append('priceRange', params.priceRange);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/owner/managers/available?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch available managers');
    }

    return response.json();
  },

  getManagerById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch manager details');
    }

    return response.json();
  },

  getMySubscriptions: async () => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscriptions`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch subscriptions');
    }

    return response.json();
  },

  subscribeToManager: async (data) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscribe`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create subscription');
    }

    return response.json();
  },

  updateSubscription: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscription/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update subscription');
    }

    return response.json();
  },

  cancelSubscription: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscription/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel subscription');
    }

    return response.json();
  },

  getSubscriptionPayments: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscription/${id}/payments`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch subscription payments');
    }

    return response.json();
  },

  paySubscription: async (id, paymentData) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscription/${id}/pay`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process payment');
    }

    return response.json();
  },

  getServiceAgreement: async (id) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscription/${id}/agreement`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch service agreement');
    }

    return response.json();
  },

  submitManagerReview: async (id, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/owner/managers/subscription/${id}/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit review');
    }

    return response.json();
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: token })
        // Content-Type is automatically set with boundary for FormData
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    return response.json();
  }
};

// Tenant API
export const tenantAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/dashboard`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch dashboard');
    }

    return response.json();
  },

  getPendingApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/applications/pending-payment`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch pending applications');
    }

    return response.json();
  },

  paySecurityDeposit: async (applicationId) => {
    const response = await fetch(`${API_BASE_URL}/tenant/applications/${applicationId}/pay-security-deposit`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process security deposit payment');
    }

    return response.json();
  },

  getPayments: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/tenant/payments?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch payments');
    }

    return response.json();
  },

  getUpcomingPayments: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/payments/upcoming`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch upcoming payments');
    }

    return response.json();
  },

  getPaymentById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenant/payments/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch payment');
    }

    return response.json();
  },

  processPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/tenant/payments/${paymentData.paymentId}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment processing failed');
    }

    return response.json();
  },

  getPaymentHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/payment-history`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch payment history');
    }

    return response.json();
  },

  getBill: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/tenant/payments/${paymentId}/bill`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bill');
    }

    return response.json();
  },

  getMessages: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/messages`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch messages');
    }

    return response.json();
  },

  getMessageById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenant/messages/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch message');
    }

    return response.json();
  },

  sendMessage: async (data) => {
    const response = await fetch(`${API_BASE_URL}/tenant/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  },

  markMessageRead: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenant/messages/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark message as read');
    }

    return response.json();
  },

  getMaintenance: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/tenant/maintenance?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch maintenance requests');
    }

    return response.json();
  },

  createMaintenance: async (data) => {
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create maintenance request');
    }

    return response.json();
  },

  getMaintenanceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch maintenance request');
    }

    return response.json();
  },

  updateMaintenance: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update maintenance request');
    }

    return response.json();
  },

  getCurrentProperty: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/current-property`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch current property');
    }

    return response.json();
  },

  getLease: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/lease`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch lease');
    }

    return response.json();
  },

  getDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/documents`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch documents');
    }

    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }

    return response.json();
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  },

  createApplication: async (data) => {
    const response = await fetch(`${API_BASE_URL}/tenant/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit application');
    }

    return response.json();
  }
};
