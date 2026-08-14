import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { authAPI } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User, Lock, Eye, EyeOff, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', gender: '', phone: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);
    try {
      const res = await authAPI.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        phone: profile.phone,
      });
      updateUser(res.data.data);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account information and password.</p>
        </div>

        <div className="card">
          <div className="card-header flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="card-body">
            {profileMsg.text && (
              <div className={`text-sm rounded-lg p-3 mb-4 ${
                profileMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {profileMsg.text}
              </div>
            )}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="pf-firstName">First Name</label>
                  <input id="pf-firstName" className="input" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} required />
                </div>
                <div>
                  <label className="label" htmlFor="pf-lastName">Last Name</label>
                  <input id="pf-lastName" className="input" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="pf-email">Email</label>
                <input id="pf-email" type="email" className="input" value={profile.email} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="pf-gender">Gender</label>
                  <select id="pf-gender" className="input" value={profile.gender} onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))} required>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="pf-phone">Phone</label>
                  <input id="pf-phone" type="tel" className="input" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} required />
                </div>
              </div>
              <button type="submit" disabled={profileLoading} className="btn-primary">
                {profileLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Update Profile
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>
          <div className="card-body">
            {passwordMsg.text && (
              <div className={`text-sm rounded-lg p-3 mb-4 ${
                passwordMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {passwordMsg.text}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="label" htmlFor="currentPassword">Current Password</label>
                <div className="relative">
                  <input id="currentPassword" type={showCurrent ? 'text' : 'password'} className="input pr-10" value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} required />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="newPassword">New Password</label>
                  <div className="relative">
                    <input id="newPassword" type={showNew ? 'text' : 'password'} className="input pr-10" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} required />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="relative">
                    <input id="confirmPassword" type={showNew ? 'text' : 'password'} className="input pr-10" value={passwords.confirmPassword} onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))} required />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={passwordLoading} className="btn-primary">
                {passwordLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Changing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
