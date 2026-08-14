import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { gamificationAPI } from '@/services/api';
import { Trophy, Medal, Award, Loader2, Users } from 'lucide-react';

const periods = ['All Time', 'This Week', 'This Month'];

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('All Time');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await gamificationAPI.getLeaderboard();
        setData(res.data?.data || []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-400';
    if (rank === 2) return 'bg-gray-50 border-gray-300 ring-2 ring-gray-400';
    if (rank === 3) return 'bg-orange-50 border-orange-300 ring-2 ring-orange-400';
    return 'bg-white border-gray-200';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-gray-500">{rank}</span>;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Leaderboard Data</h3>
            <p className="text-gray-500">No rankings available yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((entry, index) => {
              const rank = index + 1;
              return (
                <div
                  key={entry._id || entry.userId || index}
                  className={`flex items-center p-4 rounded-xl border transition-all ${getRankStyle(rank)}`}
                >
                  <div className="w-10 flex justify-center">{getRankIcon(rank)}</div>
                  <div className="flex items-center space-x-3 flex-1 ml-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {entry.firstName?.charAt(0)}{entry.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{entry.firstName} {entry.lastName}</p>
                      <p className="text-xs text-gray-500">{entry.email || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{entry.points || 0}</p>
                      <p className="text-xs text-gray-500">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{entry.streak || 0}</p>
                      <p className="text-xs text-gray-500">Streak</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-lg font-bold text-gray-900">{entry.badges?.length || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Badges</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
