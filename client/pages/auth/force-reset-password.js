import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Lock, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { authAPI } from '@/services/api';

export default function ForceResetPasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roleRoutes = { STUDENT: '/student/dashboard', TEACHER: '/teacher/dashboard', ADMIN: '/admin/dashboard' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setTimeout(() => router.push(roleRoutes[user?.role] || '/student/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
        <div className="card">
          <div className="card-body text-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <p className="text-gray-700 mb-4">You need to sign in before changing your password.</p>
            <Link href="/auth/login" className="btn-primary w-full justify-center">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user.mustResetPassword && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="card-body text-center">
              <KeyRound className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="font-medium text-gray-900">Your password is up to date</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">No password change is required for your account.</p>
              <Link href={roleRoutes[user.role] || '/student/dashboard'} className="btn-primary w-full justify-center">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AceTest</h1>
          <p className="text-gray-500 mt-1">Set a new password</p>
        </div>

        <div className="card">
          <div className="card-body">
            {success ? (
              <div>
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4 mb-4 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Password updated successfully</p>
                    <p className="mt-1">Redirecting you to your dashboard...</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3 mb-4">
                  For your account's security, you must set a new password before continuing.
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label" htmlFor="currentPassword">Current Password</label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        className="input pl-10"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="newPassword">New Password</label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        className="input pl-10 pr-10"
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        className="input pl-10"
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        Set New Password
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}