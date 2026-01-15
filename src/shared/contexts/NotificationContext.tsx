import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/Toast';

interface NotificationContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'error' | 'success' }>>([]);

  const showError = (message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type: 'error' }]);
    setTimeout(() => removeNotification(id), 5000);
  };
  
  const showSuccess = (message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type: 'success' }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showError, showSuccess }}>
      {children}
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};