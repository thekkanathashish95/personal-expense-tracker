/**
 * Expense Categories Configuration
 * 
 * This file contains all available expense categories for the application.
 * Categories can be easily modified, added, or removed here.
 * 
 * @author Personal Expense Tracker
 * @version 1.0.0
 */

export interface Category {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
}

/**
 * Default expense categories
 * You can easily add, remove, or modify categories here
 */
export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'shopping',
    label: 'Shopping',
    description: 'General shopping and retail purchases',
    icon: '🛍️',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'food-dining',
    label: 'Food & Dining',
    description: 'Restaurants, groceries, and food expenses',
    icon: '🍽️',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'transportation',
    label: 'Transportation',
    description: 'Fuel, public transport, ride-sharing',
    icon: '🚗',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'upi-payment',
    label: 'UPI Payment',
    description: 'Digital payments via UPI',
    icon: '💳',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    description: 'Movies, games, subscriptions, leisure',
    icon: '🎬',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'utilities',
    label: 'Utilities',
    description: 'Electricity, water, internet, phone bills',
    icon: '⚡',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    description: 'Medical expenses, medicines, health services',
    icon: '🏥',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Courses, books, educational materials',
    icon: '📚',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Miscellaneous expenses',
    icon: '📦',
    color: 'bg-gray-100 text-gray-800'
  }
];

/**
 * Get category by ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return EXPENSE_CATEGORIES.find(category => category.id === id);
};

/**
 * Get category by label (for backward compatibility)
 */
export const getCategoryByLabel = (label: string): Category | undefined => {
  return EXPENSE_CATEGORIES.find(category => category.label === label);
};

/**
 * Get all category labels as array (for backward compatibility)
 */
export const getCategoryLabels = (): string[] => {
  return EXPENSE_CATEGORIES.map(category => category.label);
};

/**
 * Validate if a category exists
 */
export const isValidCategory = (categoryId: string): boolean => {
  return EXPENSE_CATEGORIES.some(category => category.id === categoryId);
};

/**
 * Default category for new expenses
 */
export const DEFAULT_CATEGORY = EXPENSE_CATEGORIES[0]; // Shopping
