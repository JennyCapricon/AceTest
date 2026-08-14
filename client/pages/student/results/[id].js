import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { resultAPI, certificateAPI } from '@/services/api';
import { Award, CheckCircle, XCircle, ArrowLeft, Download, BookOpen, Video, Lightbulb, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ResultDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [generatingCert, setGeneratingCert] = useState(false);
  const [certMsg, setCertMsg] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!id) return;
    const fetchResult = async () => {
      try {
        const res = await resultAPI.getOne(id);
        const data = res.data.data;
        setResult({ ...data, score: data.obtainedMarks, answers: data.submission?.answers || [] });
      } catch (err) {
        console.error('Failed to fetch result', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const handleGenerateCert = async () => {
    setGeneratingCert(true);
    try {
      const res = await certificateAPI.generate({ resultId: id });
      setCertMsg({ type: 'success', text: 'Certificate generated!' });
    } catch (err) {
      setCertMsg({ type: 'error', text: err.response?.data?.message || 'Failed to generate certificate' });
    } finally {
      setGeneratingCert(false);
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

  if (!result) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Result not found.</p>
          <Link href="/student/results" className="text-primary-600 hover:underline mt-2 inline-block">Back to Results</Link>
        </div>
      </DashboardLayout>
    );
  }

  const percentage = result.totalMarks > 0 ? ((result.score / result.totalMarks) * 100) : 0;
  const studentName = result.studentName || `${result.student?.firstName || ''} ${result.student?.lastName || ''}`.trim() || 'N/A';

  const answers = result.answers || [];
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const wrongCount = answers.filter((a) => a.isCorrect === false).length;

  const filteredAnswers = answers.filter((a) => {
    if (filter === 'correct') return a.isCorrect;
    if (filter === 'wrong') return a.isCorrect === false;
    return true;
  });

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getGradeColor = (g) => {
    const colors = { A: 'text-green-600', B: 'text-blue-600', C: 'text-amber-600', D: 'text-orange-600' };
    return colors[g] || 'text-red-600';
  };

  const getGradeBg = (g) => {
    const colors = { A: 'bg-green-100', B: 'bg-blue-100', C: 'bg-amber-100', D: 'bg-orange-100' };
    return colors[g] || 'bg-red-100';
  };

  const weakTopics = answers.filter((a) => !a.isCorrect).map((a) => a.question?.subject?.name || a.subjectName).filter(Boolean);
  const uniqueWeakTopics = [...new Set(weakTopics)];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Link href="/student/results" className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </Link>

        {certMsg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${certMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {certMsg.text}
          </div>
        )}

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 md:p-8 text-white mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{result.examTitle || result.exam?.title}</h1>
              <p className="text-primary-100 mt-1">{result.subjectName || result.exam?.subject?.name}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
              <p className="text-primary-100 text-xs uppercase tracking-wide">Student</p>
              <p className="text-lg font-bold mt-1">{studentName}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
              <p className="text-primary-100 text-xs uppercase tracking-wide">Score</p>
              <p className="text-lg font-bold mt-1">{result.score} <span className="text-primary-200">/ {result.totalMarks}</span></p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
              <p className="text-primary-100 text-xs uppercase tracking-wide">Percentage</p>
              <p className="text-lg font-bold mt-1">{percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
              <p className="text-primary-100 text-xs uppercase tracking-wide">Grade</p>
              <p className="text-2xl font-bold mt-1">{result.grade}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
              <p className="text-sm text-gray-500">Correct</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{wrongCount}</p>
              <p className="text-sm text-gray-500">Wrong</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              {result.passed ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{result.passed ? 'Passed' : 'Failed'}</p>
              <p className="text-sm text-gray-500">{result.passed ? 'Above pass mark' : 'Below pass mark'}</p>
            </div>
          </div>
        </div>

        {wrongCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800">Areas for Improvement</h3>
                <p className="text-sm text-orange-700 mt-1">
                  You got {wrongCount} question{wrongCount > 1 ? 's' : ''} wrong. Review the corrections below to strengthen your understanding.
                </p>
                {uniqueWeakTopics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uniqueWeakTopics.map((topic) => (
                      <span key={topic} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <BookOpen className="w-3 h-3 mr-1" /> {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              <BookOpen className="w-5 h-5 inline mr-2" />
              Question Review & Corrections
            </h2>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: `All (${answers.length})` },
                { key: 'wrong', label: `Wrong (${wrongCount})` },
                { key: 'correct', label: `Correct (${correctCount})` },
              ].map((t) => (
                <button key={t.key} onClick={() => setFilter(t.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === t.key ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAnswers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {filter === 'wrong' ? 'No wrong answers — perfect score! 🎉' :
                 filter === 'correct' ? 'No correct answers yet.' :
                 'No breakdown available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnswers.map((ans, idx) => {
                const question = ans.question || {};
                const isCorrect = ans.isCorrect;
                const options = Array.isArray(question.options) ? question.options : [];
                const hasVideo = !!question.videoUrl;
                const hasExplanation = !!question.explanation;

                return (
                  <div key={ans.id || idx}
                    className={`border-2 rounded-xl overflow-hidden transition-all ${
                      isCorrect ? 'border-green-200' : 'border-red-200'
                    }`}
                  >
                    <div className={`px-5 py-3 flex items-center justify-between ${
                      isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-green-200' : 'bg-red-200'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-700" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-700" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">Question {idx + 1}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isCorrect ? `+${question.marks || ans.marksObtained} pts` : `0 / ${question.marks || 0} pts`}
                        </span>
                        {question.difficulty && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            question.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                            question.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {question.difficulty}
                          </span>
                        )}
                      </div>
                      <button onClick={() => toggleExpand(idx)} className="text-gray-400 hover:text-gray-600 text-sm font-medium">
                        {expanded[idx] ? 'Collapse' : 'Review'}
                      </button>
                    </div>

                    <div className="px-5 py-4">
                      <p className="text-gray-900 font-medium mb-3">{question.questionText}</p>

                      {options.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {options.map((opt, oi) => {
                            const isSelected = ans.selectedAnswer === opt;
                            const isCorrectOpt = question.correctAnswer === opt;
                            let optClass = 'border-gray-200 bg-white';
                            if (isSelected && isCorrectOpt) optClass = 'border-green-500 bg-green-50';
                            else if (isSelected) optClass = 'border-red-500 bg-red-50';
                            else if (isCorrectOpt) optClass = 'border-green-500 bg-green-50/50';

                            return (
                              <div key={oi} className={`flex items-center px-3 py-2 rounded-lg border text-sm ${optClass}`}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                                  isCorrectOpt ? 'border-green-500 bg-green-500' :
                                  isSelected ? 'border-red-500 bg-red-500' :
                                  'border-gray-300'
                                }`}>
                                  {(isCorrectOpt || isSelected) && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className={`flex-1 ${isCorrectOpt ? 'font-medium text-green-800' : isSelected ? 'text-red-800' : 'text-gray-700'}`}>
                                  {opt}
                                </span>
                                {isCorrectOpt && <CheckCircle className="w-4 h-4 text-green-600 ml-2" />}
                                {isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-600 ml-2" />}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {!isCorrect && (
                        <div className="text-sm mb-3">
                          <span className="text-gray-500">Your answer: </span>
                          <span className="font-medium text-red-600">{ans.selectedAnswer || 'Not answered'}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-gray-500">Correct answer: </span>
                          <span className="font-medium text-green-600">{question.correctAnswer}</span>
                        </div>
                      )}

                      {expanded[idx] && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                          {hasExplanation && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-blue-800">Explanation</p>
                                  <p className="text-sm text-blue-700 mt-1">{question.explanation}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {hasVideo && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <Video className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800 mb-2">Video Lesson</p>
                                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                    <a href={question.videoUrl} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                      <Video className="w-4 h-4" />
                                      <span>Watch Video</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {!hasExplanation && !hasVideo && (
                            <p className="text-sm text-gray-400 italic">No additional explanation provided for this question.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              <Sparkles className="w-5 h-5 inline mr-2 text-amber-500" />
              Performance Summary
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-medium">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all ${
                  percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`} style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-medium">{answers.length > 0 ? ((correctCount / answers.length) * 100).toFixed(0) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500 transition-all" style={{ width: `${answers.length > 0 ? (correctCount / answers.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Download Certificate</p>
              <p className="text-xs text-gray-500">Get your achievement certificate</p>
            </div>
          </div>
          <button onClick={handleGenerateCert} disabled={generatingCert}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm">
            {generatingCert ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
