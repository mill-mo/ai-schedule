import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TimetableGrid } from './components/TimetableGrid';
import { EventModal } from './components/EventModal';
import { AiScheduler } from './components/AiScheduler';
import { FilterControls } from './components/FilterControls';
import { useTimetable } from './hooks/useTimetable';
import { useNotifications } from './hooks/useNotifications';
import type { Event } from './types';

const App: React.FC = () => {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    addMultipleEvents,
    clearEvents,
  } = useTimetable();
  const { notificationPermission, requestNotificationPermission } = useNotifications(events);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('All');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const dayMatch = dayFilter === 'All' || event.day === dayFilter;
      const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      return dayMatch && searchMatch;
    });
  }, [events, searchQuery, dayFilter]);


  const handleOpenModal = (event: Event | null = null) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const handleSaveEvent = (event: Event) => {
    if (event.id) {
      updateEvent(event);
    } else {
      addEvent(event);
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header
        notificationPermission={notificationPermission}
        onNotificationClick={requestNotificationPermission}
      />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Weekly Schedule</h2>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <PlusIcon />
                  Add Event
                </button>
              </div>
              <FilterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                dayFilter={dayFilter}
                onDayFilterChange={setDayFilter}
              />
              <TimetableGrid
                events={filteredEvents}
                onEditEvent={handleOpenModal}
                onDeleteEvent={deleteEvent}
              />
            </div>
          </div>
          <div>
            <AiScheduler addEvents={addMultipleEvents} clearEvents={clearEvents} existingEvents={events} />
          </div>
        </div>
      </main>
      {isModalOpen && (
        <EventModal
          event={editingEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

const PlusIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

export default App;