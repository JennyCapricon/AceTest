import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { resultAPI, examAPI } from '@/services/api';
import { Download, CheckCircle, XCircle } from 'lucide-react';

export default function TeacherResults() {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await examAPI.getAll();
        setExams(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error('Failed to fetch exams', err);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedExamId) params.examId = selectedExamId;
        const res = await resultAPI.getAll(params);
        setResults(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [selectedExamId]);

  const handleExport = async () => {
    if (!selectedExamId) return;
    try {
      const res = await resultAPI.exportResults(selectedExamId, 'csv');
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `results_${selectedExamId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export results', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
        {selectedExamId && (
          <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      <div className="mb-6">
        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="">All Exams</option>
          {exams.map((exam) => (
            <option key={exam._id || exam.id} value={exam._id || exam.id}>{exam.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Percentage</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium">Passed</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </div>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No results found.</td>
                </tr>
              ) : (
                results.map((r, i) => {
                  const percentage = r.totalMarks > 0 ? ((r.score / r.totalMarks) * 100).toFixed(1) : '0.0';
                  const studentName = r.studentName || `${r.student?.firstName || ''} ${r.student?.lastName || ''}`.trim() || 'N/A';
                  const studentEmail = r.studentEmail || r.student?.email || '-';
                  return (
                    <tr key={r._id || i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">{studentName}</td>
                      <td className="px-6 py-4 text-gray-600">{studentEmail}</td>
                      <td className="px-6 py-4 font-semibold">{r.score} / {r.totalMarks}</td>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
