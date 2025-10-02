import React, { useState, memo, useMemo, useCallback } from 'react';
import DateFilter from './DateFilter';
import ExpenseCard from './ExpenseCard';
import { useExpenses } from '../hooks/useExpenses';
import { 
  useSelectedMonth, 
  useDateRange, 
  useSetSelectedMonth, 
  useSetDateRange 
} from '../store';
import { 
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import type { Expense } from '../types';

const ExpensesList: React.FC = memo(() => {
  // Get state from Zustand store
  const selectedMonth = useSelectedMonth();
  const dateRange = useDateRange();
  const setSelectedMonth = useSetSelectedMonth();
  const setDateRange = useSetDateRange();
  
  // Local state for filters (not shared between components)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  // Get expenses data from the hook
  const { expenses, loading, error } = useExpenses();

  // Filter expenses based on selected month or date range
  const getFilteredExpenses = (): Expense[] => {
    return expenses.filter((expense: Expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();
      
      if (dateRange) {
        return expenseDate >= dateRange.startDate && expenseDate <= dateRange.endDate;
      } else {
        return expenseMonth === selectedMonth.getMonth() && expenseYear === selectedMonth.getFullYear();
      }
    });
  };

  const handleCustomDateRange = useCallback((range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  }, [setDateRange]);

  const handleMonthChange = useCallback((newMonth: Date) => {
    setSelectedMonth(newMonth);
  }, [setSelectedMonth]);

  // Get filtered expenses for the selected period (memoized for performance)
  const periodExpenses = useMemo(() => getFilteredExpenses(), [expenses, selectedMonth, dateRange]);

  // Get unique categories and sources for filter dropdowns (memoized)
  const categories = useMemo(() => ['all', ...new Set(periodExpenses.map(e => e.category))], [periodExpenses]);
  const sources = useMemo(() => ['all', ...new Set(periodExpenses.map(e => e.source))], [periodExpenses]);

  // Apply search and filter criteria (memoized)
  const filteredExpenses = useMemo(() => periodExpenses.filter(expense => {
    const matchesSearch = expense.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesSource = filterSource === 'all' || expense.source === filterSource;
    
    return matchesSearch && matchesCategory && matchesSource;
  }), [periodExpenses, searchTerm, filterCategory, filterSource]);

  const totalAmount = useMemo(() => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0), [filteredExpenses]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold">Error loading expenses</div>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Expenses</h2>
          <p className="text-gray-600">Manage and edit your expense records</p>
        </div>
        <DateFilter 
          selectedMonth={selectedMonth} 
          setSelectedMonth={handleMonthChange}
          onCustomDateRange={handleCustomDateRange}
        />
      </div>

      {/* Summary Card */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredExpenses.length} expenses found
            </h3>
            <p className="text-gray-600">Total: ₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="min-w-32">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="min-w-32">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="input-field"
            >
              <option value="all">All Sources</option>
              {sources.slice(1).map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <div className="card text-center py-12">
            <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))
        )}
      </div>
    </div>
  );
});

ExpensesList.displayName = 'ExpensesList';

export default ExpensesList;
