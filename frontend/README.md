# Expense Tracker Frontend

A modern React-based web application for managing personal expenses with real-time SMS processing integration.

## Features

- **Dashboard**: Monthly overview with expense summaries and breakdowns
- **Expense Management**: Full CRUD operations with inline editing
- **Real-time Updates**: Live data synchronization with Firestore
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Category Management**: Visual categorization and filtering
- **Source Tracking**: Multiple bank account and credit card support

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast development and building
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase Firestore** - Real-time database
- **React Query** - Data fetching and caching
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Toast notifications

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx      # Main layout wrapper
│   │   ├── Header.jsx      # Navigation header
│   │   ├── Dashboard.jsx   # Dashboard view
│   │   ├── ExpensesList.jsx # Expenses list view
│   │   ├── ExpenseCard.jsx # Individual expense card
│   │   ├── MonthSelector.jsx # Month navigation
│   │   └── LoadingSpinner.jsx # Loading component
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   │   └── useExpenses.js  # Expense data management
│   ├── lib/                # Utility libraries
│   │   └── firebase.js     # Firebase configuration
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase project setup

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Update `src/lib/firebase.js` with your Firebase config
   - Ensure Firestore rules are properly configured

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to Firebase Hosting.

## Firebase Integration

The app connects to the following Firestore collections:

- `expenses` - User expense records
- `sms_raw` - Raw SMS data (read-only)

### Data Model

**Expense Document:**
```javascript
{
  userId: string,
  amount: number,
  category: string,
  note: string,
  source: string,
  date: string (ISO8601),
  sender: string,
  message: string,
  receivedAt: string (ISO8601),
  expense_type?: string,
  rawSmsId?: string,
  createdAt: string (ISO8601),
  updatedAt?: string (ISO8601)
}
```

## Features Overview

### Dashboard
- Monthly expense totals
- Category and source breakdowns
- Recent transactions
- Visual charts and summaries

### Expense Management
- Inline editing for all fields
- Real-time updates
- Category and source filtering
- Search functionality
- Month-based navigation

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Optimized for all screen sizes

## Development

### Adding New Components

1. Create component in `src/components/`
2. Follow existing patterns for styling with Tailwind
3. Use the custom hook `useExpenses` for data operations
4. Implement proper error handling and loading states

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the established color scheme
- Maintain consistent spacing and typography
- Use the predefined component classes from `index.css`

### State Management

- Use React Query for server state
- Use React Context for global app state
- Use local state for component-specific data

## Deployment

The frontend is configured to deploy to Firebase Hosting:

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Contributing

1. Follow the existing code structure
2. Use meaningful component and variable names
3. Add proper error handling
4. Test on multiple screen sizes
5. Ensure accessibility standards

## License

This project is part of the Personal Expense Tracker system.