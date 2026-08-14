import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { examAPI } from '@/services/api';
import { AlertCircle, Flag, ChevronLeft, ChevronRight, Send } from 'lucide-react';

export default function ExamTaking() {
  const router = useRouter();
  const { id } = router.query;

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [violations, setViolations] = useState(0);
  const MAX_VIOLATIONS = 3;

  useEffect(() => {
    const handleCopy = (e) => e.preventDefault();
    const handlePaste = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();
    const handleContextMenu = (e) => e.preventDefault();
    const handleVisibility = () => {
      if (document.hidden) {
        setViolations((prev) => {
          const next = prev + 1;
          if (next >= MAX_VIOLATIONS) {
            handleSubmit();
          }
          return next;
        });
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const fetchExam = useCallback(async (examId) => {
    try {
      const res = await examAPI.start(examId);
      const examData = res.data?.data?.exam || res.data?.data || res.data;
      setExam(examData);
      const durationSeconds = (examData.duration || 0) * 60;
      setTimeLeft(durationSeconds);
      startTimeRef.current = Date.now();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchExam(id);
  }, [id, fetchExam]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft !== null]);

  const handleAutoSubmit = async () => {
    clearInterval(timerRef.current);
    if (!exam || submitting) return;
    setSubmitting(true);
    try {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));
      const res = await examAPI.submit(exam._id || exam.id, { answers: answersArray, timeSpent });
      const resultId = res.data?.data?.id || res.data?.data?._id;
      router.replace(resultId ? `/student/results/${resultId}` : '/student/results');
    } catch {
      router.replace('/student/results');
    }
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));
      const res = await examAPI.submit(exam._id || exam.id, { answers: answersArray, timeSpent });
      const resultId = res.data?.data?.id || res.data?.data?._id;
      router.replace(resultId ? `/student/results/${resultId}` : '/student/results');
    } catch {
      router.replace('/student/results');
    }
  };

  const formatTime = (seconds) => {
    if (seconds == null || seconds < 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleFlag = (qIndex) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      next.has(qIndex) ? next.delete(qIndex) : next.add(qIndex);
      return next;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (!exam) return;
    setCurrentIndex((prev) => Math.min(exam.questions.length - 1, prev + 1));
  };

  const attemptsCount = exam ? Object.keys(answers).length : 0;
  const totalQuestions = exam?.questions?.length ?? 0;
  const totalTime = (exam?.duration || 0) * 60;
  const elapsed = totalTime - (timeLeft ?? 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Exam</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => router.push('/student/exams')} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const question = exam.questions[currentIndex];
  const isFlagged = flaggedQuestions.has(currentIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-bold text-gray-900">AceTest</span>
        </div>
          <div className="flex items-center space-x-6">
          {violations > 0 && (
            <div className="text-sm">
              <span className={`font-semibold ${violations >= MAX_VIOLATIONS ? 'text-red-600' : 'text-amber-600'}`}>
                Violations: {violations}/{MAX_VIOLATIONS}
              </span>
            </div>
          )}
          <div className="text-sm text-gray-500">
            Attempted: <span className="font-semibold text-gray-900">{attemptsCount}</span>/{totalQuestions}
          </div>
          <div className={`text-lg font-mono font-bold ${timeLeft <= 300 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Exam'}</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-200 h-1.5">
        <div
          className="h-1.5 bg-primary-600 transition-all duration-500"
          style={{ width: `${totalTime > 0 ? (elapsed / totalTime) * 100 : 0}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-500 font-medium">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className={`flex items-center space-x-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    isFlagged ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Flag className={`w-4 h-4 ${isFlagged ? 'fill-amber-500' : ''}`} />
                  <span>{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
                </button>
              </div>

              <p className="text-lg text-gray-900 mb-6">{question?.questionText}</p>

              {question?.options?.map((option, oi) => (
                <label
                  key={oi}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer mb-2 transition-colors ${
                    answers[question._id || question.id] === option
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${question._id || question.id}`}
                    value={option}
                    checked={answers[question._id || question.id] === option}
                    onChange={() => handleAnswer(question._id || question.id, option)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === totalQuestions - 1}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Question Navigator</h3>
              <div className="flex flex-wrap gap-2">
                {exam.questions.map((q, qi) => {
                  const qId = q._id || q.id;
                  let btnClass = 'w-9 h-9 rounded-lg text-xs font-medium border transition-colors ';
                  if (flaggedQuestions.has(qi)) {
                    btnClass += 'border-amber-400 bg-amber-50 text-amber-700 ';
                  } else if (answers[qId]) {
                    btnClass += 'border-primary-400 bg-primary-50 text-primary-700 ';
                  } else {
                    btnClass += 'border-gray-200 text-gray-500 hover:bg-gray-50 ';
                  }
                  if (qi === currentIndex) {
                    btnClass += 'ring-2 ring-primary-500 ';
                  }
                  return (
                    <button
                      key={qi}
                      onClick={() => setCurrentIndex(qi)}
                      className={btnClass}
                    >
                      {qi + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-primary-50 border border-primary-400" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-amber-50 border border-amber-400" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-white border border-gray-300" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Exam?</h3>
            <p className="text-sm text-gray-600 mb-4">
              You have attempted {attemptsCount} of {totalQuestions} questions.
              {attemptsCount < totalQuestions && (
                <span className="text-amber-600 block mt-1">
                  {totalQuestions - attemptsCount} question(s) are unanswered.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
