import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseCard from '../ExpenseCard';

const mockExpense = {
  id: 'test-expense-1',
  amount: 100.50,
  category: 'Food & Dining',
  source: 'HDFC Credit Card',
  note: 'Test expense note',
  date: '2024-01-15T10:30:00Z',
  expense_type: 'personal',
  userId: 'test-user-id',
  sender: 'HDFC',
  message: 'Test SMS message',
  receivedAt: '2024-01-15T10:30:00Z',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

// Mock the useExpenses hook
jest.mock('../../hooks/useExpenses', () => ({
  useExpenses: () => ({
    updateExpense: jest.fn().mockResolvedValue(true),
  }),
}));

describe('ExpenseCard', () => {
  it('renders expense information correctly', () => {
    render(<ExpenseCard expense={mockExpense} />);
    
    expect(screen.getByText('₹100.5')).toBeInTheDocument();
    expect(screen.getByText('Food & Dining')).toBeInTheDocument();
    expect(screen.getByText('HDFC Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Test expense note')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('shows edit button', () => {
    render(<ExpenseCard expense={mockExpense} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<ExpenseCard expense={mockExpense} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    // Should show save and cancel buttons
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    
    // Should show editable fields
    expect(screen.getByDisplayValue('Food & Dining')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test expense note')).toBeInTheDocument();
  });

  it('exits edit mode when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<ExpenseCard expense={mockExpense} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    // Cancel edit
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    // Should show edit button again
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });

  it('allows editing expense fields', async () => {
    const user = userEvent.setup();
    render(<ExpenseCard expense={mockExpense} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    // Edit the note
    const noteField = screen.getByDisplayValue('Test expense note');
    await user.clear(noteField);
    await user.type(noteField, 'Updated note');
    
    expect(noteField).toHaveValue('Updated note');
  });

  it('formats date correctly', () => {
    render(<ExpenseCard expense={mockExpense} />);
    
    // Should display formatted date (adjust based on your formatDate function)
    expect(screen.getByText(/15 Jan 2024/)).toBeInTheDocument();
  });
});
