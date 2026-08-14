import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { announcementAPI } from '@/services/api';
import { Megaphone, Calendar, User, Loader2 } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await announcementAPI.getAll();
        setAnnouncements(res.data?.data || []);
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-8">
            <Megaphone className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Announcements</h3>
              <p className="text-gray-500">Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div key={item._id || item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
                  <p className="text-gray-600 mb-4 whitespace-pre-line">{item.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{item.author?.firstName} {item.author?.lastName || item.authorName || 'Unknown'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
