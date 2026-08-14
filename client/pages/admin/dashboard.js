import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { resultAPI, adminAPI, examAPI } from '@/services/api';
import { GraduationCap, Users, Shield, BookOpen, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, examsRes] = await Promise.all([
          resultAPI.getAdminDashboard(),
          adminAPI.getUsers({ limit: 10 }),
          examAPI.getAll({ limit: 10 }),
        ]);
        setStats(statsRes.data.data);
        setRecentUsers(Array.isArray(usersRes.data.data) ? usersRes.data.data : []);
        setRecentExams(Array.isArray(examsRes.data.data) ? examsRes.data.data : []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: GraduationCap, color: 'bg-blue-500' },
    { label: 'Total Teachers', value: stats?.totalTeachers ?? 0, icon: Users, color: 'bg-green-500' },
    { label: 'Total Admins', value: stats?.totalAdmins ?? 0, icon: Shield, color: 'bg-purple-500' },
    { label: 'Total Exams', value: stats?.totalExams ?? 0, icon: BookOpen, color: 'bg-amber-500' },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Schools</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalSchools ?? 0}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h2>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.slice(0, 10).map((u, i) => (
                    <tr key={u._id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{u.firstName} {u.lastName}</td>
                      <td className="py-3 text-gray-600">{u.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'TEACHER' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{u.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Exams</h2>
          {recentExams.length === 0 ? (
            <p className="text-gray-500 text-sm">No exams found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExams.slice(0, 10).map((e, i) => (
                    <tr key={e._id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{e.title}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          e.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                          e.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{e.status ?? 'N/A'}</span>
                      </td>
                      <td className="py-3 text-gray-500">{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
