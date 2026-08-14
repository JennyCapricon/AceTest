import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Lock, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authAPI } from '@/services/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    if (router.isReady && !token) {
      setValidating(false);
      setError('Invalid or missing reset token. Please request a new password reset link.');
    } else if (token) {
      setValidating(false);
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AceTest</h1>
          <p className="text-gray-500 mt-1">Choose a new password</p>
        </div>

        <div className="card">
          <div className="card-body">
            {validating ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : success ? (
              <div>
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4 mb-4 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Password reset successful</p>
                    <p className="mt-1">You can now sign in with your new password.</p>
                  </div>
                </div>
                <Link href="/auth/login" className="btn-primary w-full justify-center">
                  Go to Sign In
                </Link>
              </div>
            ) : error && !password ? (
              <div>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
                <Link href="/auth/forgot-password" className="btn-primary w-full justify-center">
                  Request a New Link
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}

                <div>
                  <label className="label" htmlFor="password">New Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="input pl-10 pr-10"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Reset Password
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}