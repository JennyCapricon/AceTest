import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { examAPI } from '@/services/api';
import { Clock, FileQuestion, Calendar, Play } from 'lucide-react';
import { useRouter } from 'next/router';

export default function StudentExams() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('available');
  const [availableExams, setAvailableExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const [availRes, upcomRes] = await Promise.all([
          examAPI.getAvailable(),
          examAPI.getUpcoming(),
        ]);
        setAvailableExams(availRes.data.data || []);
        setUpcomingExams(upcomRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch exams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = async (examId) => {
    setStartingId(examId);
    try {
      await examAPI.start(examId);
      router.push(`/student/exams/${examId}`);
    } catch (err) {
      console.error('Failed to start exam', err);
      setStartingId(null);
    }
  };

  const tabs = [
    { key: 'available', label: 'Available Exams' },
    { key: 'upcoming', label: 'Upcoming Exams' },
  ];

  const renderExamCard = (exam, showStart = false) => (
    <div key={exam._id || exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{exam.subject?.name || exam.subjectName}</p>
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{exam.duration} min</span>
        <span className="flex items-center"><FileQuestion className="w-4 h-4 mr-1" />{exam.questions?.length ?? exam.questionCount} questions</span>
      </div>
      {exam.scheduledDate && (
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(exam.scheduledDate).toLocaleString()}
        </div>
      )}
      {showStart && (
        <button
          onClick={() => handleStartExam(exam._id || exam.id)}
          disabled={startingId === (exam._id || exam.id)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>{startingId === (exam._id || exam.id) ? 'Starting...' : 'Start Exam'}</span>
        </button>
      )}
    </div>
  );

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Exams</h1>

      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'available' && (
        availableExams.length === 0 ? (
          <p className="text-gray-500">No available exams right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableExams.map((exam) => renderExamCard(exam, true))}
          </div>
        )
      )}

      {activeTab === 'upcoming' && (
        upcomingExams.length === 0 ? (
          <p className="text-gray-500">No upcoming exams.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingExams.map((exam) => renderExamCard(exam))}
          </div>
        )
      )}
    </DashboardLayout>
  );
}
