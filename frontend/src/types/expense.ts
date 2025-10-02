// Expense data types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  note: string;
  source: string;
  date: string; // ISO8601 string
  sender: string;
  message: string;
  receivedAt: string; // ISO8601 string
  expense_type?: string;
  rawSmsId?: string;
  createdAt: string; // ISO8601 string
  updatedAt?: string; // ISO8601 string
}

// Expense update types
export interface ExpenseUpdate {
  category?: string;
  note?: string;
  source?: string;
  expense_type?: string;
}

// Expense type options
export interface ExpenseType {
  value: string;
  label: string;
  color: string;
}

// Category and source types
export interface CategoryOption {
  value: string;
  label: string;
}

export interface SourceOption {
  value: string;
  label: string;
}

// Dashboard data types
export interface DashboardData {
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  sourceBreakdown: SourceBreakdown[];
  dailySpending: DailySpending[];
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface SourceBreakdown {
  source: string;
  amount: number;
  count: number;
}

export interface DailySpending {
  date: string;
  amount: number;
}

// Date range types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}
