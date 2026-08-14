import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { certificateAPI } from '@/services/api';
import { Award, Download, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CertificateDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await certificateAPI.getOne(id);
        setCert(res.data?.data || res.data);
      } catch {
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !cert) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-red-600">{error || 'Certificate not found'}</p>
          <Link href="/student/certificates" className="mt-4 inline-flex items-center text-primary-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Certificates
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Link href="/student/certificates" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Certificates
        </Link>

        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Achievement</h1>
            <div className="w-24 h-1 bg-primary-600 mx-auto" />
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Presented to</p>
            <p className="text-2xl font-bold text-gray-900">{cert.studentName || cert.student?.firstName + ' ' + cert.student?.lastName || 'Student'}</p>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">For successfully completing</p>
            <p className="text-xl font-semibold text-gray-900">{cert.examTitle || 'Examination'}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-xl font-bold text-gray-900">{cert.score ?? 'N/A'} / {cert.total ?? 'N/A'}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Percentage</p>
              <p className="text-xl font-bold text-gray-900">{cert.percentage ?? (cert.total ? Math.round((cert.score / cert.total) * 100) : 'N/A')}%</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Grade</p>
              <p className="text-xl font-bold text-gray-900">{cert.grade || 'N/A'}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Date Issued</p>
              <p className="text-xl font-bold text-gray-900">{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-400 mb-1">Certificate ID</p>
            <p className="text-sm font-mono text-gray-600">{cert._id || cert.id || cert.certificateId || 'N/A'}</p>
          </div>

          <div className="text-center mt-6">
            <button className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
