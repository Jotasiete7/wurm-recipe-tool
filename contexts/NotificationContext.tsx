import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationOptions {
  message: string;
  type?: NotificationType;
  title?: string;
}

interface NotificationContextProps {
  showNotification: (options: string | NotificationOptions, type?: NotificationType) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [activeNotification, setActiveNotification] = useState<NotificationOptions | null>(null);

  const showNotification = (options: string | NotificationOptions, defaultType: NotificationType = 'info') => {
    if (typeof options === 'string') {
      setActiveNotification({
        message: options,
        type: defaultType,
      });
    } else {
      setActiveNotification({
        message: options.message,
        type: options.type || defaultType,
        title: options.title,
      });
    }
  };

  const hideNotification = () => {
    setActiveNotification(null);
  };

  const getIcon = (type?: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-12 h-12 text-wurm-success animate-[pulse_2s_infinite]" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500 animate-[bounce_1.5s_infinite]" />;
      case 'info':
      default:
        return <Info className="w-12 h-12 text-wurm-accent animate-[pulse_2s_infinite]" />;
    }
  };

  const getDefaultTitle = (type?: NotificationType) => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'info':
      default:
        return 'Notice';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {activeNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={hideNotification} 
          />
          
          <div className="relative w-full max-w-sm bg-wurm-panel border border-wurm-border rounded shadow-2xl p-6 text-center z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
            
            {/* Close button in top-right */}
            <button 
              onClick={hideNotification}
              className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-wurm-accent/20 rounded-full text-wurm-muted hover:text-wurm-accent transition-colors"
            >
              <X size={14} />
            </button>

            {/* Icon */}
            <div className="mb-4 bg-black/40 p-3 rounded-full border border-wurm-border/60 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {getIcon(activeNotification.type)}
            </div>

            {/* Title */}
            <h3 className="text-lg font-serif font-bold text-wurm-accent mb-2 uppercase tracking-wide">
              {activeNotification.title || getDefaultTitle(activeNotification.type)}
            </h3>

            {/* Message */}
            <p className="text-sm font-mono text-wurm-text leading-relaxed mb-6 max-w-xs break-words">
              {activeNotification.message}
            </p>

            {/* Action Button */}
            <button
              onClick={hideNotification}
              className="w-full sm:w-auto px-8 py-2 bg-wurm-accent text-black font-bold font-mono text-xs uppercase tracking-widest rounded hover:bg-wurm-accent/90 hover:shadow-[0_0_10px_#d4b483] transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
