import { useState, useEffect, useRef, useCallback } from 'react';
import type { Event } from '../types';
import { DAYS_OF_WEEK } from '../types';

const NOTIFICATION_LEAD_TIME_MINUTES = 5;

export const useNotifications = (events: Event[]) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const notifiedEventIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Set initial permission state from the browser API
    setPermission(Notification.permission);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      alert('Notifications are already enabled!');
      return;
    }

    if (Notification.permission === 'denied') {
      alert('Notifications are blocked. Please enable them in your browser settings.');
      return;
    }

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);

    if (newPermission === 'denied') {
        alert('Notifications have been blocked. You can enable them in your browser settings.');
    } else if (newPermission === 'granted') {
        alert('Notifications enabled successfully!');
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') {
      return;
    }

    const checkUpcomingEvents = () => {
      const now = new Date();
      const currentDayIndex = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
      const currentDay = DAYS_OF_WEEK[currentDayIndex];
      const upcomingEvents = events.filter(e => e.day === currentDay);

      for (const event of upcomingEvents) {
        if (notifiedEventIds.current.has(event.id)) {
          continue;
        }

        const [hours, minutes] = event.startTime.split(':').map(Number);
        const eventStartTime = new Date();
        eventStartTime.setHours(hours, minutes, 0, 0);

        const timeDifference = eventStartTime.getTime() - now.getTime();
        const minutesUntilEvent = Math.round(timeDifference / 1000 / 60);

        if (minutesUntilEvent === NOTIFICATION_LEAD_TIME_MINUTES) {
          new Notification('Upcoming Event Reminder', {
            body: `"${event.title}" is starting in 5 minutes at ${event.startTime}.`,
            icon: '/favicon.ico', // Optional: Add an icon URL
          });
          notifiedEventIds.current.add(event.id);
        }
      }
    };

    // Check every minute
    const intervalId = setInterval(checkUpcomingEvents, 60000);

    // Initial check
    checkUpcomingEvents();

    return () => clearInterval(intervalId);
  }, [events, permission]);

  return { notificationPermission: permission, requestNotificationPermission };
};
