import { useState } from 'react';
import { userMappingService } from '../services/userMappingService';
import toast from 'react-hot-toast';
import { 
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UserMappingSetupProps {
  googleEmail: string;
  googleUid: string;
  onMappingComplete: (androidUid: string) => void;
  onSkip: () => void;
}

const UserMappingSetup = ({ googleEmail, googleUid, onMappingComplete, onSkip }: UserMappingSetupProps) => {
  const [androidUid, setAndroidUid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!androidUid.trim()) {
      toast.error('Please enter your Android UID');
      return;
    }

    setIsLoading(true);
    try {
      const success = await userMappingService.createUserMapping(
        googleEmail,
        googleUid,
        androidUid.trim()
      );

      if (success) {
        setStep('success');
        toast.success('User mapping created successfully!');
        setTimeout(() => {
          onMappingComplete(androidUid.trim());
        }, 2000);
      } else {
        toast.error('Failed to create user mapping');
      }
    } catch (error) {
      console.error('Error creating mapping:', error);
      toast.error('An error occurred while creating the mapping');
    } finally {
      setIsLoading(false);
    }
  };

  // Removed unused handleConfirm function

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Setup Complete!
          </h2>
          <p className="text-gray-600">
            Your Google account is now linked to your expense data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <KeyIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Link Your Account
          </h2>
          <p className="text-gray-600">
            Connect your Google account to your existing expense data
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3 mb-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">First Time Setup</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter your Android UID to access your existing expense data.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-600 mb-1">Your Google Account:</p>
            <p className="text-sm font-medium text-gray-900">{googleEmail}</p>
          </div>
        </div>

        {/* Form */}
        {step === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="androidUid" className="block text-sm font-medium text-gray-700 mb-2">
                Android UID
              </label>
              <input
                type="text"
                id="androidUid"
                value={androidUid}
                onChange={(e) => setAndroidUid(e.target.value)}
                placeholder="Enter your Android UID (e.g., 9xaBAZuh7QZ6umvNVgUegwdRdc03)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You can find this in your environment variables or Firebase console.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onSkip}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={isLoading || !androidUid.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Link Account'}
              </button>
            </div>
          </form>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Confirm Mapping</h3>
              <p className="text-sm text-blue-700">
                This will link your Google account ({googleEmail}) to Android UID: <code className="bg-blue-100 px-1 rounded">{androidUid}</code>
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('input')}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Confirm & Link'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMappingSetup;
