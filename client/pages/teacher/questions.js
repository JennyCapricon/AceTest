import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { questionAPI, subjectAPI } from '@/services/api';
import { Plus, Upload, Pencil, Trash2, X, ChevronLeft, ChevronRight, Video, HelpCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({ subjectId: '', difficulty: '', questionType: '' });

  const [formData, setFormData] = useState({
    subjectId: '',
    questionText: '',
    questionType: 'MCQ',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    videoUrl: '',
    marks: 1,
    difficulty: 'EASY',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes] = await Promise.all([subjectAPI.getAll()]);
        setSubjects(Array.isArray(subjectsRes.data.data) ? subjectsRes.data.data : []);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const params = { page, limit: ITEMS_PER_PAGE };
        if (filters.subjectId) params.subjectId = filters.subjectId;
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.questionType) params.questionType = filters.questionType;
        const res = await questionAPI.getAll(params);
        const data = res.data;
        setQuestions(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err) {
        console.error('Failed to fetch questions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [page, filters]);

  const resetForm = () => {
    setFormData({
      subjectId: '',
      questionText: '',
      questionType: 'MCQ',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      videoUrl: '',
      marks: 1,
      difficulty: 'EASY',
    });
    setEditingQuestion(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (question) => {
    const opts = Array.isArray(question.options) ? question.options : [];
    setFormData({
      subjectId: question.subjectId || question.subject?.id || '',
      questionText: question.questionText,
      questionType: question.questionType || 'MCQ',
      options: [...opts].concat(Array(4).fill('')).slice(0, 4),
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || '',
      videoUrl: question.videoUrl || '',
      marks: question.marks || 1,
      difficulty: question.difficulty || 'EASY',
    });
    setEditingQuestion(question);
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    setFormData((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        subjectId: formData.subjectId,
        questionText: formData.questionText,
        questionType: formData.questionType,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        videoUrl: formData.videoUrl,
        marks: Number(formData.marks),
        difficulty: formData.difficulty.toUpperCase(),
      };
      if (formData.questionType === 'MCQ') {
        payload.options = formData.options.filter((o) => o.trim() !== '');
      }
      if (editingQuestion) {
        await questionAPI.update(editingQuestion._id || editingQuestion.id, payload);
      } else {
        await questionAPI.create(payload);
      }
      setShowModal(false);
      resetForm();
      const params = { page, limit: ITEMS_PER_PAGE };
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.questionType) params.questionType = filters.questionType;
      const res = await questionAPI.getAll(params);
      const data = res.data;
      setQuestions(Array.isArray(data.data) ? data.data : []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Failed to save question', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (question) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await questionAPI.delete(question._id || question.id);
      setQuestions((prev) => prev.filter((q) => (q._id || q.id) !== (question._id || question.id)));
    } catch (err) {
      console.error('Failed to delete question', err);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      await questionAPI.import(formData);
      e.target.value = '';
      const params = { page, limit: ITEMS_PER_PAGE };
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.questionType) params.questionType = filters.questionType;
      const res = await questionAPI.getAll(params);
      const data = res.data;
      setQuestions(Array.isArray(data.data) ? data.data : []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Failed to import questions', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Excel</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={openCreateModal} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4" />
            <span>Create Question</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.subjectId}
          onChange={(e) => { setFilters((prev) => ({ ...prev, subjectId: e.target.value })); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filters.difficulty}
          onChange={(e) => { setFilters((prev) => ({ ...prev, difficulty: e.target.value })); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <select
          value={filters.questionType}
          onChange={(e) => { setFilters((prev) => ({ ...prev, questionType: e.target.value })); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="">All Types</option>
          <option value="MCQ">MCQ</option>
          <option value="THEORY">Theory</option>
          <option value="TRUE_FALSE">True/False</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-6 py-4 font-medium">Question Text</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
                <th className="px-6 py-4 font-medium">Marks</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </div>
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No questions found.</td>
                </tr>
              ) : (
                questions.map((q, i) => (
                  <tr key={q._id || i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 max-w-xs truncate">{q.questionText}</td>
                    <td className="px-6 py-4 text-gray-600">{q.subject?.name || q.subjectName || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{q.questionType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        q.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        q.difficulty === 'HARD' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{q.difficulty}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{q.marks}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(q)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(q)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{editingQuestion ? 'Edit Question' : 'Create Question'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => handleFormChange('questionText', e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                  <select
                    value={formData.questionType}
                    onChange={(e) => handleFormChange('questionType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="THEORY">Theory</option>
                    <option value="TRUE_FALSE">True/False</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleFormChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {formData.questionType === 'MCQ' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map((label, idx) => (
                      <input
                        key={label}
                        value={formData.options[idx]}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${label}`}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                  <input
                    value={formData.correctAnswer}
                    onChange={(e) => handleFormChange('correctAnswer', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => handleFormChange('marks', e.target.value)}
                    min={1}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <HelpCircle className="w-4 h-4 inline mr-1" /> Explanation (shown after exam for corrections)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => handleFormChange('explanation', e.target.value)}
                  rows={2}
                  placeholder="Explain why the correct answer is right..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Video className="w-4 h-4 inline mr-1" /> Video URL (YouTube/Vimeo link for this question)
                </label>
                <input
                  value={formData.videoUrl}
                  onChange={(e) => handleFormChange('videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
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
                  {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
