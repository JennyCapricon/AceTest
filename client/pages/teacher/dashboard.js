import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { resultAPI } from '@/services/api';
import { BookOpen, Users, TrendingUp, BarChart3 } from 'lucide-react';

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await resultAPI.getTeacherDashboard();
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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

  const stats = [
    { label: 'Total Exams Created', value: data?.totalExams ?? 0, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Students', value: data?.totalStudents ?? 0, icon: Users, color: 'bg-green-500' },
    { label: 'Average Pass Rate', value: data?.averagePassRate ? `${data.averagePassRate}%` : 'N/A', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Total Results', value: data?.totalResults ?? 0, icon: BarChart3, color: 'bg-amber-500' },
  ];

  const recentExams = data?.recentExams ?? [];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Exams</h2>
        {recentExams.length === 0 ? (
          <p className="text-gray-500 text-sm">No exams created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Questions</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map((exam, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-gray-900 font-medium">{exam.title}</td>
                    <td className="py-3 text-gray-600">{exam.subject?.name || exam.subjectName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.status === 'Published' ? 'bg-green-100 text-green-700' :
                        exam.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                        exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                        exam.status === 'Completed' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{exam.status || 'Draft'}</span>
                    </td>
                    <td className="py-3 text-gray-600">{exam.questions?.length ?? exam.questionCount ?? 0}</td>
                    <td className="py-3 text-gray-500">{new Date(exam.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
