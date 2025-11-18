// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  // Helper method for making authenticated requests
  async authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Dashboard Stats
  async getDashboardStats(token) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/dashboard-stats`);
  }

  // Devices
  async getDevices() {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/devices`);
  }

  async getDevice(id) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/devices/${id}`);
  }

  async createDevice(deviceData) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/devices`, {
      method: 'POST',
      body: JSON.stringify(deviceData)
    });
  }

  async updateDevice(id, deviceData) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData)
    });
  }

  async deleteDevice(id) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/devices/${id}`, {
      method: 'DELETE'
    });
  }

  // Repairs
  async getDeviceRepairs(deviceId) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/devices/${deviceId}/repairs`);
  }

  async createRepair(repairData) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/repairs`, {
      method: 'POST',
      body: JSON.stringify(repairData)
    });
  }

  async updateRepair(id, repairData) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/repairs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(repairData)
    });
  }

  async deleteRepair(id) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/repairs/${id}`, {
      method: 'DELETE'
    });
  }

  // Phone-specific endpoints
  async reseedPhones() {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/reseed-phones`, {
      method: 'POST'
    });
  }

  // Settings
  async getSettings() {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/settings`);
  }

  async updateSettings(settings) {
    return this.authenticatedFetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // Image Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }
}

export default new ApiService();