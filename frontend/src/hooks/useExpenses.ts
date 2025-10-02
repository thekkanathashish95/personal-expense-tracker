import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import type { Expense, ExpenseUpdate } from '../types';

// Note: Mock data removed - now using real Firestore data

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, mappedAndroidUid } = useAuth();
  
  // Determine which user ID to use
  const getTargetUserId = (): string | null => {
    // If user has a mapped Android UID, use that
    if (mappedAndroidUid && mappedAndroidUid !== 'skipped') {
      return mappedAndroidUid;
    }
    
    // If user is anonymous, use the environment variable
    if (user && user.isAnonymous) {
      return import.meta.env.VITE_ANDROID_USER_ID;
    }
    
    // If user skipped mapping, return null (no data)
    if (mappedAndroidUid === 'skipped') {
      return null;
    }
    
    // Default fallback
    return import.meta.env.VITE_ANDROID_USER_ID;
  };
  
  const targetUserId = getTargetUserId();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!targetUserId) {
      // User skipped mapping or no target user ID
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create a query for the target user's expenses
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', targetUserId)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const expensesData: Expense[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Expense));
        // Sort by date (newest first) on the client side
        expensesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(expensesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        setError('Failed to load expenses');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user, targetUserId]);

  const updateExpense = useCallback(async (expenseId: string, updates: ExpenseUpdate): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update the document in Firestore
      const expenseRef = doc(db, 'expenses', expenseId);
      await updateDoc(expenseRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Expense updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
      return false;
    }
  }, [user]);

  const getExpensesByMonth = useCallback((year: number, month: number): Expense[] => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
    });
  }, [expenses]);

  const getExpensesByCategory = useMemo((): Array<{ amount: number; count: number; category: string }> => {
    const categoryMap: Record<string, { amount: number; count: number; category: string }> = {};
    expenses.forEach(expense => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = {
          amount: 0,
          count: 0,
          category: expense.category
        };
      }
      categoryMap[expense.category].amount += expense.amount;
      categoryMap[expense.category].count += 1;
    });
    return Object.values(categoryMap);
  }, [expenses]);

  const getExpensesBySource = useMemo((): Array<{ amount: number; count: number; source: string }> => {
    const sourceMap: Record<string, { amount: number; count: number; source: string }> = {};
    expenses.forEach(expense => {
      if (!sourceMap[expense.source]) {
        sourceMap[expense.source] = {
          amount: 0,
          count: 0,
          source: expense.source
        };
      }
      sourceMap[expense.source].amount += expense.amount;
      sourceMap[expense.source].count += 1;
    });
    return Object.values(sourceMap);
  }, [expenses]);

  const getTotalExpenses = useMemo((): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }, [expenses]);

  return {
    expenses,
    loading,
    error,
    updateExpense,
    getExpensesByMonth,
    getExpensesByCategory,
    getExpensesBySource,
    getTotalExpenses
  };
};

export default useExpenses;