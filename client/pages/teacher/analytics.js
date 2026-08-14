import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { resultAPI } from '@/services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function TeacherAnalytics() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const passedRef = useRef(null);
  const barRef = useRef(null);
  const passedChartRef = useRef(null);
  const barChartRef = useRef(null);

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

  useEffect(() => {
    if (results.length === 0 || loading) return;
    if (typeof window === 'undefined') return;

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;

    if (passedChartRef.current) passedChartRef.current.destroy();
    if (passedRef.current) {
      const { Chart: ChartJs } = require('chart.js');
      passedChartRef.current = new ChartJs(passedRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Failed'],
          datasets: [{
            data: [passed, failed],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }

    const scoreRanges = [0, 20, 40, 60, 80, 100];
    const distribution = scoreRanges.map((range, idx) => {
      if (idx === scoreRanges.length - 1) return 0;
      const min = range;
      const max = scoreRanges[idx + 1];
      return results.filter((r) => {
        const pct = r.totalMarks > 0 ? (r.score / r.totalMarks) * 100 : 0;
        return pct >= min && pct < max;
      }).length;
    });

    if (barChartRef.current) barChartRef.current.destroy();
    if (barRef.current) {
      const { Chart: ChartJs } = require('chart.js');
      barChartRef.current = new ChartJs(barRef.current, {
        type: 'bar',
        data: {
          labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
          datasets: [{
            label: 'Students',
            data: distribution,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    return () => {
      if (passedChartRef.current) passedChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, [results, loading]);

  const examScores = results.reduce((acc, r) => {
    const examName = r.examTitle || r.exam?.title || 'Unknown';
    if (!acc[examName]) acc[examName] = { total: 0, count: 0 };
    acc[examName].total += r.totalMarks > 0 ? (r.score / r.totalMarks) * 100 : 0;
    acc[examName].count += 1;
    return acc;
  }, {});

  const examAverages = Object.entries(examScores).map(([exam, data]) => ({
    exam,
    average: (data.total / data.count).toFixed(1),
    students: data.count,
  }));

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No data available for analytics.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pass Rate</h2>
              <div className="max-w-xs mx-auto">
                <canvas ref={passedRef} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h2>
              <div className="max-h-64">
                <canvas ref={barRef} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Average Score per Exam</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Exam</th>
                    <th className="pb-3 font-medium">Average Score (%)</th>
                    <th className="pb-3 font-medium">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {examAverages.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500">No data available.</td>
                    </tr>
                  ) : (
                    examAverages.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-gray-900 font-medium">{item.exam}</td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                              <div
                                className="h-2 rounded-full bg-primary-600"
                                style={{ width: `${Math.min(100, parseFloat(item.average))}%` }}
                              />
                            </div>
                            <span className="text-gray-600">{item.average}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600">{item.students}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
