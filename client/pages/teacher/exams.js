import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { examAPI, subjectAPI } from '@/services/api';
import { Plus, Pencil, Send, Calendar, Trash2, X, Eye } from 'lucide-react';
import Link from 'next/link';

export default function TeacherExams() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForExam, setScheduleForExam] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleData, setScheduleData] = useState({ startsAt: '', endsAt: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    duration: 60,
    passMark: 50,
    instructions: '',
    shuffleQuestions: false,
    showResult: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, subjectsRes] = await Promise.all([
          examAPI.getAll(),
          subjectAPI.getAll(),
        ]);
        setExams(Array.isArray(examsRes.data.data) ? examsRes.data.data : []);
        setSubjects(Array.isArray(subjectsRes.data.data) ? subjectsRes.data.data : []);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subjectId: '',
      duration: 60,
      passMark: 50,
      instructions: '',
      shuffleQuestions: false,
      showResult: false,
    });
    setEditingExam(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (exam) => {
    setFormData({
      title: exam.title || '',
      description: exam.description || '',
      subjectId: exam.subjectId || exam.subject?._id || '',
      duration: exam.duration || 60,
      passMark: exam.passMark || 50,
      instructions: exam.instructions || '',
      shuffleQuestions: exam.shuffleQuestions || false,
      showResult: exam.showResult || false,
    });
    setEditingExam(exam);
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        passMark: Number(formData.passMark),
      };
      if (editingExam) {
        await examAPI.update(editingExam._id || editingExam.id, payload);
      } else {
        await examAPI.create(payload);
      }
      setShowModal(false);
      resetForm();
      const res = await examAPI.getAll();
      setExams(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to save exam', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (exam) => {
    try {
      await examAPI.publish(exam._id || exam.id);
      const res = await examAPI.getAll();
      setExams(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to publish exam', err);
    }
  };

  const openScheduleModal = (exam) => {
    setScheduleForExam(exam);
    setScheduleData({ startsAt: '', endsAt: '' });
    setShowScheduleModal(true);
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleForExam) return;
    setSubmitting(true);
    try {
      await examAPI.schedule(scheduleForExam._id || scheduleForExam.id, scheduleData);
      setShowScheduleModal(false);
      setScheduleForExam(null);
      const res = await examAPI.getAll();
      setExams(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to schedule exam', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (exam) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await examAPI.delete(exam._id || exam.id);
      setExams((prev) => prev.filter((e) => (e._id || e.id) !== (exam._id || exam.id)));
    } catch (err) {
      console.error('Failed to delete exam', err);
    }
  };

  const getStatusBadge = (status) => {
    const cls = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PUBLISHED: 'bg-green-100 text-green-700',
      SCHEDULED: 'bg-blue-100 text-blue-700',
      COMPLETED: 'bg-purple-100 text-purple-700',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${cls[status] || 'bg-gray-100 text-gray-700'}`;
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
        <button onClick={openCreateModal} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" />
          <span>Create Exam</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Questions</th>
                <th className="px-6 py-4 font-medium">Submissions</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No exams created yet.</td>
                </tr>
              ) : (
                exams.map((exam, i) => (
                  <tr key={exam._id || i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/teacher/exams/${exam._id || exam.id}`} className="text-gray-900 font-medium hover:text-primary-600">
                        {exam.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{exam.subject?.name || exam.subjectName || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(exam.status || 'Draft')}>{exam.status || 'DRAFT'}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{exam.questions?.length ?? exam.questionCount ?? 0}</td>
                    <td className="px-6 py-4 text-gray-600">{exam.submissionsCount ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/teacher/exams/${exam._id || exam.id}`}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => openEditModal(exam)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {(exam.status === 'DRAFT') && (
                          <button onClick={() => handlePublish(exam)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {exam.status === 'PUBLISHED' && (
                          <button onClick={() => openScheduleModal(exam)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Calendar className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(exam)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{editingExam ? 'Edit Exam' : 'Create Exam'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => handleFormChange('subjectId', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleFormChange('duration', e.target.value)}
                    min={1}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pass Mark (%)</label>
                  <input
                    type="number"
                    value={formData.passMark}
                    onChange={(e) => handleFormChange('passMark', e.target.value)}
                    min={0}
                    max={100}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => handleFormChange('instructions', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.shuffleQuestions}
                    onChange={(e) => handleFormChange('shuffleQuestions', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span>Shuffle Questions</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.showResult}
                    onChange={(e) => handleFormChange('showResult', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span>Show Result After Submission</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingExam ? 'Update Exam' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Exam</h3>
              <button onClick={() => { setShowScheduleModal(false); setScheduleForExam(null); }} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-4">
              <p className="text-sm text-gray-600">Scheduling: <span className="font-medium text-gray-900">{scheduleForExam?.title}</span></p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleData.startsAt}
                  onChange={(e) => setScheduleData((prev) => ({ ...prev, startsAt: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleData.endsAt}
                  onChange={(e) => setScheduleData((prev) => ({ ...prev, endsAt: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowScheduleModal(false); setScheduleForExam(null); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
