import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, Shield, Bell } from 'lucide-react';

export default function AdminSettings() {
  const [examRules, setExamRules] = useState({
    defaultPassMark: 50,
    maxAttempts: 3,
    defaultDuration: 60,
  });
  const [security, setSecurity] = useState({
    minPasswordLength: 8,
    specialCharsRequired: true,
    sessionTimeout: 30,
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    notificationEmail: '',
  });
  const [message, setMessage] = useState('');

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h1>

      {message && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Exam Rules</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Pass Mark (%)</label>
              <input
                type="number"
                value={examRules.defaultPassMark}
                onChange={(e) => setExamRules({ ...examRules, defaultPassMark: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts Per Exam</label>
              <input
                type="number"
                value={examRules.maxAttempts}
                onChange={(e) => setExamRules({ ...examRules, maxAttempts: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Duration (mins)</label>
              <input
                type="number"
                value={examRules.defaultDuration}
                onChange={(e) => setExamRules({ ...examRules, defaultDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <button onClick={() => showMessage('Settings saved')} className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              Save Exam Rules
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Password Length</label>
              <input
                type="number"
                value={security.minPasswordLength}
                onChange={(e) => setSecurity({ ...security, minPasswordLength: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Special Characters Required</label>
              <button
                onClick={() => setSecurity({ ...security, specialCharsRequired: !security.specialCharsRequired })}
                className={`relative w-11 h-6 rounded-full transition-colors ${security.specialCharsRequired ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${security.specialCharsRequired ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (mins)</label>
              <input
                type="number"
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({ ...security, sessionTimeout: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <button onClick={() => showMessage('Settings saved')} className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              Save Security Settings
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable Email Notifications</label>
              <button
                onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications.emailNotifications ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Email</label>
              <input
                type="email"
                value={notifications.notificationEmail}
                onChange={(e) => setNotifications({ ...notifications, notificationEmail: e.target.value })}
                placeholder="admin@school.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <button onClick={() => showMessage('Settings saved')} className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              Save Notification Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
