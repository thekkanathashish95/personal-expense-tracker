// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import React from 'react';

// Mock Firebase
jest.mock('./lib/firebase', () => ({
  auth: {},
  db: {},
}));

// Mock environment variables
process.env = {
  ...process.env,
  VITE_FIREBASE_API_KEY: 'test-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test-project.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'test-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: 'test-app-id',
  VITE_ANDROID_USER_ID: 'test-android-user-id',
};

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => React.createElement('div', { 'data-testid': 'toaster' }),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock Zustand store
jest.mock('./store/useAppStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    selectedMonth: new Date('2024-01-01'),
    dateRange: null,
    activeTab: 'dashboard',
    setSelectedMonth: jest.fn(),
    setDateRange: jest.fn(),
    setActiveTab: jest.fn(),
    resetDateFilter: jest.fn(),
    goToPreviousMonth: jest.fn(),
    goToNextMonth: jest.fn(),
    goToCurrentMonth: jest.fn(),
  })),
}));