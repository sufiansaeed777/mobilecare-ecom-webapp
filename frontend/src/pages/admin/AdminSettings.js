import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { TrashIcon } from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    logo: '',
    currencySymbol: '£',
    defaultWarrantyPeriod: 30,
    logoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...settings,
          ...data
        });
        if (data.logo) {
          setLogoPreview(data.logo);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setSettings(prev => ({
      ...prev,
      logo: '',
      logoUrl: ''
    }));
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;

    const formData = new FormData();
    formData.append('image', logoFile);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoUrl = settings.logo;
      
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...settings,
          logo: logoUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...settings,
          ...data
        });
        alert('Settings updated successfully!');
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  id="currencySymbol"
                  name="currencySymbol"
                  value={settings.currencySymbol}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="defaultWarrantyPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Warranty Period (days)
                </label>
                <input
                  type="number"
                  id="defaultWarrantyPeriod"
                  name="defaultWarrantyPeriod"
                  value={settings.defaultWarrantyPeriod}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Logo
                </label>
                
                {logoPreview && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-24 w-auto object-contain border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload a logo image (PNG, JPG, or SVG recommended)
                </p>
              </div>

              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Or use Logo URL
                </label>
                <input
                  type="url"
                  id="logoUrl"
                  name="logoUrl"
                  value={settings.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;