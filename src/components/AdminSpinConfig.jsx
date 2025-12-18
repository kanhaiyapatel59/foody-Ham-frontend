import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const defaultConfig = {
  isEnabled: false,
  rewards: {
    freeDelivery: { enabled: false, weight: 0 },
    discount10: { enabled: false, weight: 0 },
    discount20: { enabled: false, weight: 0 },
    discount30: { enabled: false, weight: 0 },
    freeItem: {
      enabled: false,
      weight: 0,
      itemName: '',
      itemValue: 0
    }
  }
};

const AdminSpinConfig = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/api/spin/admin/config`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setConfig({ ...defaultConfig, ...data });
    } catch (error) {
      console.error('Error fetching config:', error);
      setConfig(defaultConfig); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/api/spin/admin/config`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(config)
        }
      );

      if (!response.ok) throw new Error('Save failed');

      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateReward = (rewardType, field, value) => {
    setConfig(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        [rewardType]: {
          ...prev.rewards[rewardType],
          [field]: value
        }
      }
    }));
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

      {/* Enable / Disable */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={config.isEnabled}
            onChange={e =>
              setConfig({ ...config, isEnabled: e.target.checked })
            }
            className="w-5 h-5 text-orange-500"
          />
          <span className="text-lg font-semibold dark:text-white">
            Enable Spin & Win
          </span>
        </label>
      </div>

      {/* Rewards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Reward Configuration
        </h3>

        {Object.entries(config.rewards).map(([key, reward]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border rounded-lg mb-3 dark:border-gray-600"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={reward.enabled}
                onChange={e =>
                  updateReward(key, 'enabled', e.target.checked)
                }
              />
              <span className="capitalize dark:text-white">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
            </div>

            <input
              type="number"
              value={reward.weight}
              onChange={e =>
                updateReward(key, 'weight', Number(e.target.value))
              }
              className="w-20 p-1 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSpinConfig;
