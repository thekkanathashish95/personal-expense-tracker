/**
 * Constants Configuration Index
 * 
 * This file exports all constants and configuration for the application.
 * It provides a centralized way to access all configuration values.
 * 
 * @author Personal Expense Tracker
 * @version 1.0.0
 */

// Export all constants
export * from './categories';
export * from './sources';
export * from './expenseTypes';

// Re-export commonly used items for convenience
export {
  EXPENSE_CATEGORIES,
  getCategoryLabels,
  getCategoryByLabel,
  DEFAULT_CATEGORY
} from './categories';

export {
  PAYMENT_SOURCES,
  getSourceLabels,
  getSourceByLabel,
  DEFAULT_SOURCE
} from './sources';

export {
  EXPENSE_TYPES,
  getExpenseTypeInfo,
  getExpenseTypeByValue,
  DEFAULT_EXPENSE_TYPE
} from './expenseTypes';

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  // Default values
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_TIME_FORMAT: 'HH:mm',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Validation
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999.99,
  MAX_NOTE_LENGTH: 500,
  
  // UI Settings
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  
  // Firebase
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
} as const;

/**
 * Theme Configuration
 */
export const THEME_CONFIG = {
  PRIMARY_COLOR: 'blue',
  SUCCESS_COLOR: 'green',
  WARNING_COLOR: 'yellow',
  ERROR_COLOR: 'red',
  INFO_COLOR: 'blue'
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  ENABLE_EXPENSE_CREATION: true,
  ENABLE_EXPENSE_DELETION: false,
  ENABLE_DATA_EXPORT: false,
  ENABLE_CATEGORY_MANAGEMENT: false,
  ENABLE_SOURCE_MANAGEMENT: false,
  ENABLE_EXPENSE_TYPE_MANAGEMENT: false,
  ENABLE_ADVANCED_FILTERS: false,
  ENABLE_BUDGET_TRACKING: false
} as const;
