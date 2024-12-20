import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  Shield, 
  Mail, 
  Database,
  Save,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Example settings state
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      securityAlerts: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordExpiry: "90"
    },
    system: {
      language: "en",
      timezone: "UTC",
      dateFormat: "DD/MM/YYYY"
    },
    maintenance: {
      backupFrequency: "daily",
      retentionPeriod: "30",
      autoCleanup: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: '#F5EFE7', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#213555' }}>Settings</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={e => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emailAlerts: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 focus:ring-2"
                  />
                  Email Alerts
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.securityAlerts}
                    onChange={e => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        securityAlerts: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 focus:ring-2"
                  />
                  Security Alerts
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={e => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        twoFactorAuth: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 focus:ring-2"
                  />
                  Two-Factor Authentication
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={e => setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      sessionTimeout: e.target.value
                    }
                  })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#D8C4B6' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={settings.system.language}
                  onChange={e => setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      language: e.target.value
                    }
                  })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#D8C4B6' }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <select
                  value={settings.system.timezone}
                  onChange={e => setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      timezone: e.target.value
                    }
                  })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#D8C4B6' }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Maintenance Settings
              </CardTitle>
              <CardDescription>Configure system maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Backup Frequency</label>
                <select
                  value={settings.maintenance.backupFrequency}
                  onChange={e => setSettings({
                    ...settings,
                    maintenance: {
                      ...settings.maintenance,
                      backupFrequency: e.target.value
                    }
                  })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#D8C4B6' }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.maintenance.autoCleanup}
                    onChange={e => setSettings({
                      ...settings,
                      maintenance: {
                        ...settings.maintenance,
                        autoCleanup: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 focus:ring-2"
                  />
                  Auto Cleanup Old Data
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200"
              style={{ backgroundColor: '#213555' }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;