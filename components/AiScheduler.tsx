
import React, { useState } from 'react';
import { generateSchedule } from '../services/geminiService';
import type { Event } from '../types';

interface AiSchedulerProps {
  addEvents: (events: Omit<Event, 'id' | 'color'>[]) => { success: boolean, message: string };
  clearEvents: () => void;
  existingEvents: Event[];
}

export const AiScheduler: React.FC<AiSchedulerProps> = ({ addEvents, clearEvents, existingEvents }) => {
  const [prompt, setPrompt] = useState('Study Math for 2 hours\nGo to the gym for 1 hour every weekday morning\nWork on project for 3 hours on Tuesday and Thursday');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a list of tasks.');
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const schedule = await generateSchedule(prompt, existingEvents);
      if (schedule.length > 0) {
        const result = addEvents(schedule);
        if (result.success) {
          setMessage(result.message);
          setPrompt('');
        } else {
          setError(result.message);
        }
      } else {
         setMessage('AI could not generate a schedule. Please try a different prompt.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire schedule? This cannot be undone.')) {
        clearEvents();
        setMessage('Schedule cleared.');
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">AI Scheduler Assistant</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        List your tasks and their durations below. The AI will attempt to create an optimal schedule for you.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Team meeting for 1 hour on Monday"
        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        disabled={isLoading}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Spinner />
              Generating...
            </>
          ) : 'Generate Schedule'}
        </button>
        <button
          onClick={handleClear}
          disabled={isLoading || existingEvents.length === 0}
          className="w-full sm:w-auto bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-12a9 9 0 0115.546 5.546A9 9 0 0111.546 21M21 11.546A9 9 0 015.546 6.454" />
    </svg>
  );

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
