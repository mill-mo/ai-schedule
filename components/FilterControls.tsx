import React from 'react';
import { DAYS_OF_WEEK } from '../types';

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dayFilter: string;
  onDayFilterChange: (day: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  onSearchChange,
  dayFilter,
  onDayFilterChange,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          aria-label="Search events by title"
        />
        <SearchIcon />
      </div>
      <select
        value={dayFilter}
        onChange={(e) => onDayFilterChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        aria-label="Filter events by day"
      >
        <option value="All">All Days</option>
        {DAYS_OF_WEEK.map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
    </div>
  );
};

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
