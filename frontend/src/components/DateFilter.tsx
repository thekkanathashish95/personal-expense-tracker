import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { 
  useGoToPreviousMonth, 
  useGoToNextMonth, 
  useGoToCurrentMonth 
} from '../store';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateFilterProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  onCustomDateRange?: (range: DateRange) => void;
  onResetCustomRange?: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ 
  selectedMonth, 
  setSelectedMonth, 
  onCustomDateRange, 
  onResetCustomRange 
}) => {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Get Zustand actions for navigation
  const goToPreviousMonth = useGoToPreviousMonth();
  const goToNextMonth = useGoToNextMonth();
  const goToCurrentMonth = useGoToCurrentMonth();

  const monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedMonth.getFullYear() === now.getFullYear() && 
           selectedMonth.getMonth() === now.getMonth();
  };

  const handleCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      onCustomDateRange?.({
        startDate: new Date(customStartDate),
        endDate: new Date(customEndDate)
      });
      setShowCustomRange(false);
    }
  };

  const resetToMonthView = () => {
    setShowCustomRange(false);
    setCustomStartDate('');
    setCustomEndDate('');
    // Reset to current month
    setSelectedMonth(new Date());
    // Notify parent to reset custom range
    if (onResetCustomRange) {
      onResetCustomRange();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {!showCustomRange ? (
        <>
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            title="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </div>
          </div>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            title="Next month"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          {!isCurrentMonth() && (
            <button
              onClick={goToCurrentMonth}
              className="ml-4 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors duration-200"
            >
              Current Month
            </button>
          )}
          
          <button
            onClick={() => setShowCustomRange(true)}
            className="ml-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-1"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Custom Range</span>
          </button>
        </>
      ) : (
        <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <button
            onClick={handleCustomDateRange}
            disabled={!customStartDate || !customEndDate}
            className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Apply
          </button>
          
          <button
            onClick={resetToMonthView}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
