import React from 'react';
import { 
  ChartBarIcon, 
  ListBulletIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface HeaderProps {
  activeTab: 'dashboard' | 'expenses';
  setActiveTab: (tab: 'dashboard' | 'expenses') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user, signOut } = useAuth();
  
  const tabs: Array<{
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'expenses', name: 'All Expenses', icon: ListBulletIcon },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              💰 Expense Tracker
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'dashboard' | 'expenses')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info and Sign Out */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <UserIcon className="h-4 w-4" />
              <span>{user?.displayName || user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
