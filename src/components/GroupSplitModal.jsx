import React, { useState } from 'react';
import { useGroupSplit } from '../context/GroupSplitContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, DollarSign, Calculator, Share2, X } from 'lucide-react';

const GroupSplitModal = ({ isOpen, onClose, orderData }) => {
  const { initializeGroupSplit, splitData, splitEqually, assignItemToParticipant, clearGroupSplit } = useGroupSplit();
  const { formatCurrency } = useLanguage();
  const [participants, setParticipants] = useState([
    { id: 1, name: '', email: '', phone: '' }
  ]);
  const [splitMethod, setSplitMethod] = useState('equal');
  const [step, setStep] = useState(1); // 1: Add participants, 2: Split bills

  const addParticipant = () => {
    setParticipants([...participants, { 
      id: Date.now(), 
      name: '', 
      email: '', 
      phone: '' 
    }]);
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const startSplitting = () => {
    const validParticipants = participants.filter(p => p.name.trim());
    if (validParticipants.length < 2) {
      alert('Please add at least 2 participants');
      return;
    }
    initializeGroupSplit(orderData, validParticipants);
    setStep(2);
  };

  const handleSplitEqually = () => {
    splitEqually();
  };

  const sendSplitRequests = () => {
    // Simulate sending payment requests
    alert('Payment requests sent to all participants!');
    clearGroupSplit();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold dark:text-white">
              {step === 1 ? 'Add Participants' : 'Split Bill'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 1 ? (
          /* Step 1: Add Participants */
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium dark:text-white mb-2">
                Who's splitting this bill?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add friends who will share this {formatCurrency(orderData.totalAmount)} order
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {participants.map((participant, index) => (
                <div key={participant.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium dark:text-white">
                      Person {index + 1}
                    </span>
                    {participants.length > 1 && (
                      <button
                        onClick={() => removeParticipant(participant.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Name *"
                      value={participant.name}
                      onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                      className="px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={participant.email}
                      onChange={(e) => updateParticipant(participant.id, 'email', e.target.value)}
                      className="px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={participant.phone}
                      onChange={(e) => updateParticipant(participant.id, 'phone', e.target.value)}
                      className="px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addParticipant}
              className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              + Add Another Person
            </button>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={startSplitting}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Continue to Split
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Split Bills */
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium dark:text-white">
                  Split Method
                </h3>
                <div className="text-2xl font-bold text-orange-500">
                  {formatCurrency(orderData.totalAmount)}
                </div>
              </div>

              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSplitMethod('equal')}
                  className={`px-4 py-2 rounded-lg ${
                    splitMethod === 'equal' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                  }`}
                >
                  Split Equally
                </button>
                <button
                  onClick={() => setSplitMethod('custom')}
                  className={`px-4 py-2 rounded-lg ${
                    splitMethod === 'custom' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                  }`}
                >
                  Custom Split
                </button>
              </div>

              {splitMethod === 'equal' && (
                <button
                  onClick={handleSplitEqually}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Split Equally</span>
                </button>
              )}
            </div>

            {splitData && (
              <div className="space-y-3 mb-6">
                {splitData.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium dark:text-white">{participant.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {participant.email || participant.phone}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-500">
                        {formatCurrency(participant.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {participant.items.length} items
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Back
              </button>
              <button
                onClick={sendSplitRequests}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Send Payment Requests</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSplitModal;