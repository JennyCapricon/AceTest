import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { resultAPI } from '@/services/api';
import { ClipboardList, Calendar, CheckCircle, TrendingUp, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await resultAPI.getStudentDashboard();
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
    { label: 'Total Exams', value: data?.totalExams ?? 0, icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Upcoming Exams', value: data?.upcomingExams ?? 0, icon: Calendar, color: 'bg-amber-500' },
    { label: 'Completed Exams', value: data?.completedExams ?? 0, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Average Score', value: data?.averageScore ? `${data.averageScore}%` : 'N/A', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const recentResults = data?.recentResults ?? [];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Dashboard</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h2>
          {recentResults.length === 0 ? (
            <p className="text-gray-500 text-sm">No results yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Exam</th>
                    <th className="pb-3 font-medium">Subject</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Grade</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{r.examTitle || r.exam?.title}</td>
                      <td className="py-3 text-gray-600">{r.subjectName || r.exam?.subject?.name}</td>
                      <td className="py-3 font-medium">{r.score}/{r.totalMarks}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.grade === 'A' ? 'bg-green-100 text-green-700' :
                          r.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                          r.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                          r.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>{r.grade}</span>
                      </td>
                      <td className="py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Exams</h2>
          {(!data?.upcomingExams || data.upcomingExams === 0) ? (
            <p className="text-gray-500 text-sm">No upcoming exams.</p>
          ) : (
            <div className="space-y-3">
              {(data.upcomingExamsList ?? []).map((exam, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{exam.title}</p>
                    <p className="text-xs text-gray-500">{exam.subject?.name}</p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{new Date(exam.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
