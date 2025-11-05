
import React from 'react';
import type { Event } from '../types';
import { DAYS_OF_WEEK } from '../types';

interface TimetableGridProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export const TimetableGrid: React.FC<TimetableGridProps> = ({ events, onEditEvent, onDeleteEvent }) => {
  const renderEvent = (event: Event) => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    const durationMinutes = endMinutes - startMinutes;

    const top = ((startMinutes - 6 * 60) / 60) * 4; // 4rem per hour, starting from 6 AM
    const height = (durationMinutes / 60) * 4;

    return (
      <div
        key={event.id}
        className={`absolute w-full p-2 rounded-lg border-l-4 ${event.color || 'bg-gray-200 border-gray-500'} text-gray-800 text-opacity-80 overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-200`}
        style={{ top: `${top}rem`, height: `${height}rem` }}
        onClick={() => onEditEvent(event)}
      >
        <p className="font-semibold text-sm">{event.title}</p>
        <p className="text-xs">{event.startTime} - {event.endTime}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
              onDeleteEvent(event.id);
            }
          }}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
         &times;
        </button>
      </div>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-8 min-w-[1000px] text-center font-semibold">
        <div className="sticky left-0 bg-white dark:bg-gray-800 z-10 py-2 border-b border-r border-gray-200 dark:border-gray-700">Time</div>
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="py-2 border-b border-r border-gray-200 dark:border-gray-700">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-8 min-w-[1000px] relative">
        <div className="sticky left-0 bg-white dark:bg-gray-800 z-10 grid grid-rows-18">
          {hours.map(hour => (
            <div key={hour} className="h-16 border-r border-b border-gray-200 dark:border-gray-700 text-center text-sm pt-1 text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
          ))}
        </div>
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="relative border-r border-gray-200 dark:border-gray-700">
            <div className="grid grid-rows-18">
              {hours.map(hour => (
                <div key={`${day}-${hour}`} className="h-16 border-b border-gray-200 dark:border-gray-700"></div>
              ))}
            </div>
            {events.filter(e => e.day === day).map(renderEvent)}
          </div>
        ))}
      </div>
    </div>
  );
};
