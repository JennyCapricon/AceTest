import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { certificateAPI } from '@/services/api';
import { Award, FileText, Loader2, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await certificateAPI.getMine();
        setCertificates(res.data?.data || []);
      } catch {
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Certificates Yet</h3>
            <p className="text-gray-500">Complete exams to earn certificates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id || cert.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.examTitle || 'Exam'}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Grade: <span className="font-medium text-gray-900">{cert.grade || 'N/A'}</span></p>
                  <p>Score: <span className="font-medium text-gray-900">{cert.score ?? 'N/A'} / {cert.total ?? 'N/A'}</span></p>
                  <p>Issued: <span className="font-medium text-gray-900">{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'N/A'}</span></p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/student/certificates/${cert._id || cert.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
