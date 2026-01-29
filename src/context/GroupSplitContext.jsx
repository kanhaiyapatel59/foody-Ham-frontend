import React, { createContext, useContext, useState } from 'react';

const GroupSplitContext = createContext();

export const GroupSplitProvider = ({ children }) => {
  const [splitData, setSplitData] = useState(null);
  const [isGroupSplitMode, setIsGroupSplitMode] = useState(false);

  const initializeGroupSplit = (orderData, participants) => {
    const splitInfo = {
      orderId: Date.now(),
      totalAmount: orderData.totalAmount,
      items: orderData.items,
      participants: participants.map(p => ({
        ...p,
        amount: 0,
        items: []
      })),
      splitMethod: 'equal', // equal, custom, by-item
      createdAt: new Date()
    };
    
    setSplitData(splitInfo);
    setIsGroupSplitMode(true);
    return splitInfo;
  };

  const updateParticipantAmount = (participantId, amount) => {
    setSplitData(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId ? { ...p, amount } : p
      )
    }));
  };

  const assignItemToParticipant = (itemId, participantId) => {
    setSplitData(prev => {
      const item = prev.items.find(i => i.id === itemId);
      return {
        ...prev,
        participants: prev.participants.map(p => {
          if (p.id === participantId) {
            return {
              ...p,
              items: [...p.items, item],
              amount: p.amount + item.price * item.quantity
            };
          }
          return {
            ...p,
            items: p.items.filter(i => i.id !== itemId)
          };
        })
      };
    });
  };

  const splitEqually = () => {
    const amountPerPerson = splitData.totalAmount / splitData.participants.length;
    setSplitData(prev => ({
      ...prev,
      splitMethod: 'equal',
      participants: prev.participants.map(p => ({
        ...p,
        amount: amountPerPerson,
        items: []
      }))
    }));
  };

  const clearGroupSplit = () => {
    setSplitData(null);
    setIsGroupSplitMode(false);
  };

  return (
    <GroupSplitContext.Provider value={{
      splitData,
      isGroupSplitMode,
      initializeGroupSplit,
      updateParticipantAmount,
      assignItemToParticipant,
      splitEqually,
      clearGroupSplit
    }}>
      {children}
    </GroupSplitContext.Provider>
  );
};

export const useGroupSplit = () => {
  const context = useContext(GroupSplitContext);
  if (!context) {
    throw new Error('useGroupSplit must be used within a GroupSplitProvider');
  }
  return context;
};