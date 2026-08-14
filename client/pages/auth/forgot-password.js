import { useState } from 'react';
import Link from 'next/link';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { authAPI } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      setSuccess(true);
      setEmail('');
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
          <p className="text-gray-500 mt-1">Forgot your password?</p>
        </div>

        <div className="card">
          <div className="card-body">
            {success ? (
              <div>
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4 mb-4 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Check your inbox</p>
                    <p className="mt-1">
                      If an account exists for that email, we&apos;ve sent a password reset link.
                      It&apos;s valid for 1 hour.
                    </p>
                  </div>
                </div>
                <Link href="/auth/login" className="btn-primary w-full justify-center">
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  Enter the email address linked to your account and we&apos;ll send you a link to
                  reset your password.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label" htmlFor="email">Email</label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        className="input pl-10"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        Send Reset Link
                      </span>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  <Link href="/auth/login" className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}