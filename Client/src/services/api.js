const API_BASE_URL = 'http://localhost:3000/api';

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
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
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
      throw new Error('Failed to fetch property managers');
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

  suspendPropertyManager: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/property-managers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
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

  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return response.json();
  },

  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    
    const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  },

  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  },

  updateUser: async (userId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }
    
    return response.json();
  },

  suspendUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/suspend`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to suspend user');
    }
    
    return response.json();
  },

  activateUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/activate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to activate user');
    }
    
    return response.json();
  },

  getAllProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.ownerId) queryParams.append('ownerId', filters.ownerId);
    
    const response = await fetch(`${API_BASE_URL}/admin/properties?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    return response.json();
  },

  getPropertyById: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }
    
    return response.json();
  },

  updateProperty: async (propertyId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}`, {
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

  deleteProperty: async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete property');
    }
    
    return response.json();
  },

  getAllApplications: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.propertyId) queryParams.append('propertyId', filters.propertyId);
    if (filters.tenantId) queryParams.append('tenantId', filters.tenantId);
    
    const response = await fetch(`${API_BASE_URL}/admin/applications?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    return response.json();
  },

  getApplicationById: async (applicationId) => {
    const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }
    
    return response.json();
  },

  updateApplication: async (applicationId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
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

  getFinancialData: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.propertyId) queryParams.append('propertyId', filters.propertyId);
    
    const response = await fetch(`${API_BASE_URL}/admin/financial?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch financial data');
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
  }
};
