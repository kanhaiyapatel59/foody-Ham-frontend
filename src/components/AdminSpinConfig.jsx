import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminSpinConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/spin/admin/config`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }

      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
      // Optional: set a default config to prevent crashes
      setConfig({
        isEnabled: false,
        rewards: {
          freeDelivery: { enabled: false, weight: 0 },
          discount10: { enabled: false, weight: 0 },
          discount20: { enabled: false, weight: 0 },
          discount30: { enabled: false, weight: 0 },
          freeItem: { enabled: false, weight: 0, itemName: '', itemValue: 0 },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/spin/admin/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Save failed with status ${response.status}`);
      }

      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateReward = (rewardType, field, value) => {
    if (!config?.rewards) return;

    setConfig({
      ...config,
      rewards: {
        ...config.rewards,
        [rewardType]: {
          ...config.rewards[rewardType],
          [field]: value,
        },
      },
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Spin & Win Configuration
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>

      {config && (
        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.isEnabled}
                onChange={(e) =>
                  setConfig({ ...config, isEnabled: e.target.checked })
                }
                className="w-5 h-5 text-orange-500"
              />
              <span className="text-lg font-semibold dark:text-white">
                Enable Spin & Win
              </span>
            </label>
          </div>

          {/* Rewards Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Reward Configuration
            </h3>

            <div className="space-y-4">
              {Object.entries(config.rewards).map(([key, reward]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={reward.enabled}
                      onChange={(e) =>
                        updateReward(key, 'enabled', e.target.checked)
                      }
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="font-medium dark:text-white">
                      {key === 'freeItem'
                        ? 'Free Item'
                        : key.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </div>
                  {key !== 'freeItem' ? (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm dark:text-white">Weight:</label>
                      <input
                        type="number"
                        value={reward.weight}
                        onChange={(e) =>
                          updateReward(key, 'weight', parseInt(e.target.value))
                        }
                        className="w-16 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min="0"
                        max="100"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={reward.itemName}
                          onChange={(e) =>
                            updateReward(key, 'itemName', e.target.value)
                          }
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                          Item Value ($)
                        </label>
                        <input
                          type="number"
                          value={reward.itemValue}
                          onChange={(e) =>
                            updateReward(key, 'itemValue', parseFloat(e.target.value))
                          }
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpinConfig;
