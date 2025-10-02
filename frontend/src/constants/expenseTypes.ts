/**
 * Expense Types Configuration
 * 
 * This file contains all available expense types for the application.
 * Expense types help categorize expenses by purpose or nature.
 * 
 * @author Personal Expense Tracker
 * @version 1.0.0
 */

export interface ExpenseType {
  value: string;
  label: string;
  description?: string;
  color: string;
  icon?: string;
}

/**
 * Default expense types
 * You can easily add, remove, or modify expense types here
 */
export const EXPENSE_TYPES: ExpenseType[] = [
  {
    value: 'personal',
    label: 'Personal',
    description: 'Personal expenses and individual purchases',
    color: 'bg-blue-100 text-blue-800',
    icon: '👤'
  },
  {
    value: 'family',
    label: 'Family',
    description: 'Family-related expenses and household items',
    color: 'bg-green-100 text-green-800',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    value: 'shared',
    label: 'Shared',
    description: 'Shared expenses between multiple people',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🤝'
  },
  {
    value: 'money_lend',
    label: 'Money Lend',
    description: 'Money lent to others (not expenses)',
    color: 'bg-red-100 text-red-800',
    icon: '💸'
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Business-related expenses',
    color: 'bg-purple-100 text-purple-800',
    icon: '💼'
  },
  {
    value: 'investment',
    label: 'Investment',
    description: 'Investment-related expenses',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '📈'
  }
];

/**
 * Get expense type by value
 */
export const getExpenseTypeByValue = (value: string): ExpenseType | undefined => {
  return EXPENSE_TYPES.find(type => type.value === value);
};

/**
 * Get expense type by label
 */
export const getExpenseTypeByLabel = (label: string): ExpenseType | undefined => {
  return EXPENSE_TYPES.find(type => type.label === label);
};

/**
 * Get all expense type values as array
 */
export const getExpenseTypeValues = (): string[] => {
  return EXPENSE_TYPES.map(type => type.value);
};

/**
 * Get all expense type labels as array
 */
export const getExpenseTypeLabels = (): string[] => {
  return EXPENSE_TYPES.map(type => type.label);
};

/**
 * Validate if an expense type exists
 */
export const isValidExpenseType = (value: string): boolean => {
  return EXPENSE_TYPES.some(type => type.value === value);
};

/**
 * Default expense type for new expenses
 */
export const DEFAULT_EXPENSE_TYPE = EXPENSE_TYPES[0]; // Personal

/**
 * Get expense type info with fallback (for backward compatibility)
 */
export const getExpenseTypeInfo = (value?: string): ExpenseType => {
  if (!value) return DEFAULT_EXPENSE_TYPE;
  
  const expenseType = getExpenseTypeByValue(value);
  return expenseType || DEFAULT_EXPENSE_TYPE;
};

/**
 * Expense type categories for grouping
 */
export const EXPENSE_TYPE_CATEGORIES = {
  PERSONAL: 'personal' as const,
  FAMILY: 'family' as const,
  SHARED: 'shared' as const,
  BUSINESS: 'business' as const,
  INVESTMENT: 'investment' as const,
  MONEY_LEND: 'money_lend' as const
} as const;
