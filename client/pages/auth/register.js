import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

function PasswordStrength({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ['', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
  const widths = ['', 'w-1/4', 'w-2/4', 'w-3/4', 'w-full'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${colors[strength]} ${widths[strength]} transition-all duration-300 rounded-full`} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{labels[strength]}</p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    gender: '', phone: '', school: '', studentId: '', department: '', employeeId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        gender: form.gender,
        phone: form.phone,
        school: form.school,
        role: role.toUpperCase(),
      };
      if (role === 'student') payload.studentId = form.studentId;
      if (role === 'teacher') {
        payload.department = form.department;
        payload.employeeId = form.employeeId;
      }

      const userData = await register(payload);
      const roleRoutes = { STUDENT: '/student/dashboard', TEACHER: '/teacher/dashboard', ADMIN: '/admin/dashboard' };
      router.push(roleRoutes[userData?.role] || '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AceTest</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex border border-gray-200 rounded-lg p-1 mb-6">
              {['student', 'teacher'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                    role === r
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="firstName">First Name</label>
                  <input id="firstName" className="input" value={form.firstName} onChange={update('firstName')} required />
                </div>
                <div>
                  <label className="label" htmlFor="lastName">Last Name</label>
                  <input id="lastName" className="input" value={form.lastName} onChange={update('lastName')} required />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="password">Password</label>
                  <div className="relative">
                    <input id="password" type={showPassword ? 'text' : 'password'} className="input pr-10" value={form.password} onChange={update('password')} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>
                <div>
                  <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative">
                    <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} className="input pr-10" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="gender">Gender</label>
                  <select id="gender" className="input" value={form.gender} onChange={update('gender')} required>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="phone">Phone</label>
                  <input id="phone" type="tel" className="input" placeholder="+234 800 000 0000" value={form.phone} onChange={update('phone')} required />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="school">School / Institution</label>
                <input id="school" className="input" placeholder="Enter your school name" value={form.school} onChange={update('school')} required />
              </div>

              {role === 'student' && (
                <div>
                  <label className="label" htmlFor="studentId">Student ID</label>
                  <input id="studentId" className="input" placeholder="e.g. STU-2024-001" value={form.studentId} onChange={update('studentId')} required />
                </div>
              )}

              {role === 'teacher' && (
                <>
                  <div>
                    <label className="label" htmlFor="department">Department</label>
                    <input id="department" className="input" placeholder="e.g. Mathematics" value={form.department} onChange={update('department')} required />
                  </div>
                  <div>
                    <label className="label" htmlFor="employeeId">Employee ID</label>
                    <input id="employeeId" className="input" placeholder="e.g. EMP-2024-001" value={form.employeeId} onChange={update('employeeId')} required />
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary-600 font-medium hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
