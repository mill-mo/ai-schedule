
import { useState, useEffect, useCallback } from 'react';
import type { Event, DayOfWeek } from '../types';

const COLORS = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-purple-200', 'bg-indigo-200', 'bg-red-200'];
const BORDER_COLORS = ['border-blue-500', 'border-green-500', 'border-yellow-500', 'border-pink-500', 'border-purple-500', 'border-indigo-500', 'border-red-500'];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const useTimetable = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('timetableEvents');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error("Failed to load events from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('timetableEvents', JSON.stringify(events));
    } catch (error) {
      console.error("Failed to save events to localStorage", error);
    }
  }, [events]);

  const checkConflict = useCallback((newEvent: Omit<Event, 'id'>, existingEvents: Event[]): boolean => {
    const newStart = timeToMinutes(newEvent.startTime);
    const newEnd = timeToMinutes(newEvent.endTime);

    for (const existingEvent of existingEvents) {
      if (existingEvent.day === newEvent.day && existingEvent.id !== (newEvent as Event).id) {
        const existingStart = timeToMinutes(existingEvent.startTime);
        const existingEnd = timeToMinutes(existingEvent.endTime);
        if (Math.max(newStart, existingStart) < Math.min(newEnd, existingEnd)) {
          return true;
        }
      }
    }
    return false;
  }, []);

  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'color'>) => {
    if (checkConflict(eventData, events)) {
      alert('Error: This event conflicts with an existing event.');
      return;
    }
    if (timeToMinutes(eventData.startTime) >= timeToMinutes(eventData.endTime)) {
      alert('Error: Start time must be before end time.');
      return;
    }
    setEvents(prevEvents => {
      const colorIndex = prevEvents.length % COLORS.length;
      const newEvent: Event = {
        ...eventData,
        id: new Date().toISOString() + Math.random(),
        color: `${COLORS[colorIndex]} ${BORDER_COLORS[colorIndex]}`,
      };
      return [...prevEvents, newEvent];
    });
  }, [events, checkConflict]);

  const addMultipleEvents = useCallback((newEventsData: Omit<Event, 'id' | 'color'>[]): { success: boolean, message: string } => {
    const currentEvents = [...events];
    const eventsToAdd: Event[] = [];
    
    for (const eventData of newEventsData) {
       if (timeToMinutes(eventData.startTime) >= timeToMinutes(eventData.endTime)) {
        return { success: false, message: `Error in event "${eventData.title}": Start time must be before end time.` };
      }
      if (checkConflict(eventData, [...currentEvents, ...eventsToAdd])) {
        return { success: false, message: `Error: Event "${eventData.title}" conflicts with an existing or another new event.` };
      }
      const colorIndex = (currentEvents.length + eventsToAdd.length) % COLORS.length;
      eventsToAdd.push({
        ...eventData,
        id: new Date().toISOString() + Math.random(),
        color: `${COLORS[colorIndex]} ${BORDER_COLORS[colorIndex]}`,
      });
    }

    setEvents(prev => [...prev, ...eventsToAdd]);
    return { success: true, message: 'Schedule added successfully!' };
  }, [events, checkConflict]);

  const updateEvent = useCallback((updatedEvent: Event) => {
    const otherEvents = events.filter(e => e.id !== updatedEvent.id);
    if (checkConflict(updatedEvent, otherEvents)) {
      alert('Error: This event conflicts with an existing event.');
      return;
    }
     if (timeToMinutes(updatedEvent.startTime) >= timeToMinutes(updatedEvent.endTime)) {
      alert('Error: Start time must be before end time.');
      return;
    }
    setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  }, [events, checkConflict]);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, addEvent, updateEvent, deleteEvent, addMultipleEvents, clearEvents };
};
