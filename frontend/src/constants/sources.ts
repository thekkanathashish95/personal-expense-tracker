/**
 * Payment Sources Configuration
 * 
 * This file contains all available payment sources for the application.
 * Sources can be easily modified, added, or removed here.
 * 
 * @author Personal Expense Tracker
 * @version 1.0.0
 */

export interface PaymentSource {
  id: string;
  label: string;
  type: 'bank_account' | 'credit_card' | 'cash' | 'wallet' | 'upi' | 'other';
  description?: string;
  icon?: string;
  color?: string;
}

/**
 * Default payment sources
 * You can easily add, remove, or modify sources here
 */
export const PAYMENT_SOURCES: PaymentSource[] = [
  {
    id: 'hdfc-bank-account',
    label: 'HDFC Bank Account',
    type: 'bank_account',
    description: 'Primary savings account',
    icon: '🏦',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'hdfc-credit-card',
    label: 'HDFC Credit Card',
    type: 'credit_card',
    description: 'Primary credit card',
    icon: '💳',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'icici-bank-account',
    label: 'ICICI Bank Account',
    type: 'bank_account',
    description: 'Secondary savings account',
    icon: '🏦',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'icici-credit-card',
    label: 'ICICI Credit Card',
    type: 'credit_card',
    description: 'Secondary credit card',
    icon: '💳',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'cash',
    label: 'Cash',
    type: 'cash',
    description: 'Physical cash payments',
    icon: '💵',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'paytm-wallet',
    label: 'Paytm Wallet',
    type: 'wallet',
    description: 'Digital wallet payments',
    icon: '📱',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'phonepe',
    label: 'PhonePe',
    type: 'upi',
    description: 'UPI payments via PhonePe',
    icon: '📲',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'google-pay',
    label: 'Google Pay',
    type: 'upi',
    description: 'UPI payments via Google Pay',
    icon: '💰',
    color: 'bg-green-100 text-green-800'
  }
];

/**
 * Get source by ID
 */
export const getSourceById = (id: string): PaymentSource | undefined => {
  return PAYMENT_SOURCES.find(source => source.id === id);
};

/**
 * Get source by label (for backward compatibility)
 */
export const getSourceByLabel = (label: string): PaymentSource | undefined => {
  return PAYMENT_SOURCES.find(source => source.label === label);
};

/**
 * Get all source labels as array (for backward compatibility)
 */
export const getSourceLabels = (): string[] => {
  return PAYMENT_SOURCES.map(source => source.label);
};

/**
 * Get sources by type
 */
export const getSourcesByType = (type: PaymentSource['type']): PaymentSource[] => {
  return PAYMENT_SOURCES.filter(source => source.type === type);
};

/**
 * Validate if a source exists
 */
export const isValidSource = (sourceId: string): boolean => {
  return PAYMENT_SOURCES.some(source => source.id === sourceId);
};

/**
 * Default source for new expenses
 */
export const DEFAULT_SOURCE = PAYMENT_SOURCES[0]; // HDFC Bank Account

/**
 * Source types for categorization
 */
export const SOURCE_TYPES = {
  BANK_ACCOUNT: 'bank_account' as const,
  CREDIT_CARD: 'credit_card' as const,
  CASH: 'cash' as const,
  WALLET: 'wallet' as const,
  UPI: 'upi' as const,
  OTHER: 'other' as const
} as const;
