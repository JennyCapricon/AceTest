import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { gamificationAPI } from '@/services/api';
import { Award, Flame, Star, Loader2, Trophy } from 'lucide-react';

export default function Achievements() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await gamificationAPI.getMine();
        setData(res.data?.data || res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : !data ? (
          <div className="text-center py-20">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Achievements Yet</h3>
            <p className="text-gray-500">Complete exams and activities to earn points and badges.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <Star className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                <p className="text-4xl font-bold text-gray-900 mb-1">{data.totalPoints || data.points || 0}</p>
                <p className="text-sm text-gray-500">Total Points</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <Flame className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="text-4xl font-bold text-gray-900 mb-1">{data.currentStreak || data.streak || 0}</p>
                <p className="text-sm text-gray-500">Day Streak</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <Award className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <p className="text-4xl font-bold text-gray-900 mb-1">{data.badges?.length || 0}</p>
                <p className="text-sm text-gray-500">Badges Earned</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
            {data.badges && data.badges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.badges.map((badge, i) => (
                  <div key={badge._id || i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-7 h-7 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{badge.name || 'Badge'}</h3>
                    <p className="text-sm text-gray-500">{badge.description || ''}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No badges earned yet. Keep going!</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
