import React, { useState, memo, useCallback } from 'react';
import { 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  TagIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { useExpenses } from '../hooks/useExpenses';
import { 
  getCategoryLabels, 
  getSourceLabels, 
  getExpenseTypeInfo,
  EXPENSE_TYPES 
} from '../constants';
import type { Expense } from '../types';

interface ExpenseCardProps {
  expense: Expense;
}

const ExpenseCard: React.FC<ExpenseCardProps> = memo(({ expense }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState({
    category: expense.category,
    note: expense.note,
    source: expense.source,
    expense_type: expense.expense_type
  });
  const { updateExpense } = useExpenses();

  // Use constants instead of hardcoded arrays
  const categories = getCategoryLabels();
  const sources = getSourceLabels();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = useCallback(async () => {
    try {
      const success = await updateExpense(expense.id, editedExpense);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  }, [updateExpense, expense.id, editedExpense]);

  const handleCancel = useCallback(() => {
    setEditedExpense({
      category: expense.category,
      note: expense.note,
      source: expense.source,
      expense_type: expense.expense_type
    });
    setIsEditing(false);
  }, [expense]);

  // getExpenseTypeInfo is now imported from constants

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* Left side - Amount and basic info */}
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-900">
              ₹{expense.amount.toLocaleString()}
            </div>
            {expense.expense_type && (
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getExpenseTypeInfo(expense.expense_type).color}`}>
                {getExpenseTypeInfo(expense.expense_type).label}
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-4 space-y-3">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editedExpense.category}
                  onChange={(e) => setEditedExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <input
                  type="text"
                  value={editedExpense.note}
                  onChange={(e) => setEditedExpense(prev => ({ ...prev, note: e.target.value }))}
                  className="input-field"
                  placeholder="Enter note..."
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={editedExpense.source}
                  onChange={(e) => setEditedExpense(prev => ({ ...prev, source: e.target.value }))}
                  className="input-field"
                >
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              {/* Expense Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editedExpense.expense_type || ''}
                  onChange={(e) => setEditedExpense(prev => ({ ...prev, expense_type: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select type...</option>
                  {EXPENSE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-1"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TagIcon className="h-4 w-4" />
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  {expense.category}
                </span>
              </div>
              <p className="text-gray-700">{expense.note}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CreditCardIcon className="h-4 w-4" />
                  <span>{expense.source}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(expense.date)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Edit button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
            title="Edit expense"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
});

ExpenseCard.displayName = 'ExpenseCard';

export default ExpenseCard;
