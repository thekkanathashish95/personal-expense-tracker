import React, { memo, useMemo, useCallback } from 'react';
import DateFilter from './DateFilter';
import DailySpendingChart from './DailySpendingChart';
import { useExpenses } from '../hooks/useExpenses';
import { 
  useSelectedMonth, 
  useDateRange, 
  useSetSelectedMonth, 
  useSetDateRange, 
  useResetDateFilter 
} from '../store';
import { 
  CurrencyRupeeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import type { Expense } from '../types';

const Dashboard: React.FC = memo(() => {
  // Get state from Zustand store
  const selectedMonth = useSelectedMonth();
  const dateRange = useDateRange();
  const setSelectedMonth = useSetSelectedMonth();
  const setDateRange = useSetDateRange();
  const resetDateFilter = useResetDateFilter();
  
  // Get expenses data from the hook
  const { expenses, loading, error } = useExpenses();

  const handleCustomDateRange = useCallback((range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
    console.log('Custom date range selected:', range);
  }, [setDateRange]);

  const handleMonthChange = useCallback((newMonth: Date) => {
    setSelectedMonth(newMonth);
  }, [setSelectedMonth]);

  const handleResetCustomRange = useCallback(() => {
    resetDateFilter();
  }, [resetDateFilter]);

  // Transform individual expenses into dashboard metrics
  const transformExpensesToDashboardData = (expenses: Expense[], month: number, year: number, customRange: { startDate: Date; endDate: Date } | null = null) => {
    // Filter expenses based on date range
    let filteredExpenses = expenses.filter((expense: Expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();
      
      if (customRange) {
        return expenseDate >= customRange.startDate && expenseDate <= customRange.endDate;
      } else {
        return expenseMonth === month && expenseYear === year;
      }
    });

    // Calculate total expenses
    const totalExpenses = filteredExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

    // Generate daily spending data
    const daysInMonth = customRange ? 
      Math.ceil((customRange.endDate.getTime() - customRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 :
      new Date(year, month + 1, 0).getDate();
    
    const dailySpending = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = customRange ? 
        new Date(customRange.startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000) :
        new Date(year, month, day);
      
      const dayAmount = filteredExpenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getDate() === dayDate.getDate() &&
                 expenseDate.getMonth() === dayDate.getMonth() &&
                 expenseDate.getFullYear() === dayDate.getFullYear();
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      dailySpending.push({
        date: day.toString().padStart(2, '0'),
        amount: dayAmount
      });
    }

    // Calculate category breakdown
    const categoryMap: Record<string, { amount: number; count: number }> = {};
    filteredExpenses.forEach((expense: Expense) => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = { amount: 0, count: 0 };
      }
      categoryMap[expense.category].amount += expense.amount;
      categoryMap[expense.category].count += 1;
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, data]: [string, { amount: number; count: number }]) => ({
        category,
        amount: data.amount,
        percentage: totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate source breakdown
    const sourceMap: Record<string, { amount: number; count: number }> = {};
    filteredExpenses.forEach((expense: Expense) => {
      if (!sourceMap[expense.source]) {
        sourceMap[expense.source] = { amount: 0, count: 0 };
      }
      sourceMap[expense.source].amount += expense.amount;
      sourceMap[expense.source].count += 1;
    });

    const sourceBreakdown = Object.entries(sourceMap)
      .map(([source, data]: [string, { amount: number; count: number }]) => ({
        source,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalExpenses,
      categoryBreakdown,
      sourceBreakdown,
      dailySpending,
      transactionCount: filteredExpenses.length
    };
  };

  // Transform expenses data for dashboard display (memoized for performance)
  const dashboardData = useMemo(() => {
    return transformExpensesToDashboardData(
      expenses, 
      selectedMonth.getMonth(), 
      selectedMonth.getFullYear(), 
      dateRange
    );
  }, [expenses, selectedMonth, dateRange]);

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">₹{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
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
            <div className="text-red-600 text-lg font-semibold">Error loading data</div>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Month Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">
            Track your expenses and spending patterns
            {dateRange && (
              <span className="ml-2 text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-md">
                Custom Range: {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
        <DateFilter 
          selectedMonth={selectedMonth} 
          setSelectedMonth={handleMonthChange}
          onCustomDateRange={handleCustomDateRange}
          onResetCustomRange={handleResetCustomRange}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Expenses" 
          value={dashboardData.totalExpenses} 
          icon={CurrencyRupeeIcon}
          color="primary"
        />
        <StatCard 
          title="Transactions" 
          value={dashboardData.transactionCount} 
          icon={ChartBarIcon}
          color="success"
        />
        <StatCard 
          title="Average Daily Spend" 
          value={dashboardData.transactionCount > 0 ? Math.round(dashboardData.totalExpenses / dashboardData.transactionCount) : 0} 
          icon={CurrencyRupeeIcon}
          color="warning"
        />
      </div>

      {/* Daily Spending Chart */}
      <DailySpendingChart dailyData={dashboardData.dailySpending} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <div className="space-y-3">
            {dashboardData.categoryBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">₹{item.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Source</h3>
          <div className="space-y-3">
            {dashboardData.sourceBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">₹{item.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{item.count} transactions</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
