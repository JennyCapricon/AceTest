import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { examAPI, questionAPI } from '@/services/api';
import { ArrowLeft, Plus, X, Trash2, Clock, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ExamDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [adding, setAdding] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchExam = async () => {
      try {
        const res = await examAPI.getOne(id);
        setExam(res.data.data);
      } catch (err) {
        console.error('Failed to fetch exam', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const openAddModal = async () => {
    setShowAddModal(true);
    setSelectedIds(new Set());
    setFetchingBank(true);
    try {
      const res = await questionAPI.getAll({ limit: 200 });
      const data = res.data;
      const questions = Array.isArray(data.data) ? data.data : [];
      setBankQuestions(questions);
    } catch (err) {
      console.error('Failed to fetch question bank', err);
    } finally {
      setFetchingBank(false);
    }
  };

  const toggleSelect = (qId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(qId) ? next.delete(qId) : next.add(qId);
      return next;
    });
  };

  const handleAddQuestions = async () => {
    if (selectedIds.size === 0) return;
    setAdding(true);
    try {
      await examAPI.addQuestions(id, { questionIds: Array.from(selectedIds) });
      setShowAddModal(false);
      const res = await examAPI.getOne(id);
      setExam(res.data.data);
    } catch (err) {
      console.error('Failed to add questions', err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveQuestion = async (questionId) => {
    if (!confirm('Remove this question from the exam?')) return;
    try {
      await examAPI.addQuestions(id, { questionIds: [questionId], remove: true });
      const res = await examAPI.getOne(id);
      setExam(res.data.data);
    } catch (err) {
      console.error('Failed to remove question', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!exam) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Exam not found.</p>
          <Link href="/teacher/exams" className="text-primary-600 hover:underline mt-2 inline-block">Back to Exams</Link>
        </div>
      </DashboardLayout>
    );
  }

  const examQuestions = exam.questions ?? [];

  return (
    <DashboardLayout>
      <Link href="/teacher/exams" className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Exams</span>
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{exam.subject?.name || exam.subjectName}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            exam.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
            exam.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
            exam.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
            exam.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' :
            'bg-amber-100 text-amber-700'
          }`}>{exam.status || 'DRAFT'}</span>
        </div>

        {exam.description && (
          <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Duration: {exam.duration} min</span>
          <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1" /> Questions: {examQuestions.length}</span>
          <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Pass Mark: {exam.passMark}%</span>
        </div>

        {exam.instructions && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Instructions:</p>
            <p>{exam.instructions}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Questions ({examQuestions.length})</h2>
          <button onClick={openAddModal} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4" />
            <span>Add from Question Bank</span>
          </button>
        </div>

        {examQuestions.length === 0 ? (
          <p className="text-gray-500 text-sm">No questions added yet.</p>
        ) : (
          <div className="space-y-3">
            {examQuestions.map((q, i) => {
              const qId = q._id || q.id;
              return (
                <div key={qId || i} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{i + 1}. {q.questionText}</p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span className={`px-2 py-0.5 rounded-full ${
                        q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{q.difficulty}</span>
                      <span>{q.questionType}</span>
                      <span>{q.marks} marks</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveQuestion(qId)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add from Question Bank</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {fetchingBank ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                </div>
              ) : bankQuestions.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No questions in the bank.</p>
              ) : (
                <div className="space-y-2">
                  {bankQuestions.map((q) => {
                    const qId = q._id || q.id;
                    const alreadyInExam = examQuestions.some((eq) => (eq._id || eq.id) === qId);
                    return (
                      <label
                        key={qId}
                        className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedIds.has(qId)
                            ? 'border-primary-500 bg-primary-50'
                            : alreadyInExam
                            ? 'border-gray-200 bg-gray-50 opacity-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(qId)}
                          onChange={() => toggleSelect(qId)}
                          disabled={alreadyInExam}
                          className="w-4 h-4 mt-0.5 text-primary-600 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{q.questionText}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span>{q.subject?.name || q.subjectName || '-'}</span>
                            <span>{q.questionType}</span>
                            <span className={`px-1.5 py-0.5 rounded-full ${
                              q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>{q.difficulty}</span>
                            <span>{q.marks} marks</span>
                          </div>
                        </div>
                        {alreadyInExam && (
                          <span className="text-xs text-gray-400 whitespace-nowrap">Already added</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuestions}
                disabled={selectedIds.size === 0 || adding}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {adding ? 'Adding...' : `Add to Exam (${selectedIds.size})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
