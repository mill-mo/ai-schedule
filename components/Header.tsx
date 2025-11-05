import React from 'react';

interface HeaderProps {
    notificationPermission: NotificationPermission;
    onNotificationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ notificationPermission, onNotificationClick }) => {
  const getBellColor = () => {
    switch(notificationPermission) {
        case 'granted':
            return 'text-green-500';
        case 'denied':
            return 'text-red-500';
        default:
            return 'text-gray-500 dark:text-gray-400';
    }
  }

  const getBellTitle = () => {
     switch(notificationPermission) {
        case 'granted':
            return 'Notifications are enabled';
        case 'denied':
            return 'Notifications are blocked';
        default:
            return 'Click to enable notifications';
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CalendarIcon />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            AI Timetable Scheduler
          </h1>
        </div>
        <button 
            onClick={onNotificationClick}
            title={getBellTitle()}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle notifications"
        >
            <BellIcon className={getBellColor()} />
        </button>
      </div>
    </header>
  );
};

const CalendarIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const BellIcon: React.FC<{className?: string}> = ({className}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 ${className}`}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
