import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { resultAPI } from '@/services/api';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/router';

export default function StudentResults() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await resultAPI.getAll();
        setResults(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
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

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Results</h1>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No results available yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Exam</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Percentage</th>
                  <th className="px-6 py-4 font-medium">Grade</th>
                  <th className="px-6 py-4 font-medium">Passed</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const percentage = r.totalMarks > 0 ? ((r.score / r.totalMarks) * 100).toFixed(1) : '0.0';
                  return (
                    <tr
                      key={r._id || i}
                      onClick={() => router.push(`/student/results/${r._id || r.id}`)}
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">{r.examTitle || r.exam?.title}</td>
                      <td className="px-6 py-4 text-gray-600">{r.subjectName || r.exam?.subject?.name}</td>
                      <td className="px-6 py-4 font-semibold">{r.score}</td>
                      <td className="px-6 py-4 text-gray-600">{r.totalMarks}</td>
                      <td className="px-6 py-4">{percentage}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.grade === 'A' ? 'bg-green-100 text-green-700' :
                          r.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                          r.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                          r.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>{r.grade}</span>
                      </td>
                      <td className="px-6 py-4">
                        {r.passed ? (
                          <span className="flex items-center space-x-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-4 h-4" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-red-600 text-xs font-medium">
                            <XCircle className="w-4 h-4" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
