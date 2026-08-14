import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { auditAPI } from '@/services/api';
import { ClipboardList, Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 20 };
        if (userFilter) params.userId = userFilter;
        if (actionFilter) params.action = actionFilter;
        const res = await auditAPI.getAll(params);
        const data = res.data?.data || res.data?.logs || [];
        setLogs(Array.isArray(data) ? data : []);
        setTotalPages(res.data?.totalPages || 1);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, userFilter, actionFilter]);

  const formatUA = (ua) => {
    if (!ua || ua.length < 40) return ua || '-';
    return ua.slice(0, 40) + '...';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Logs</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by User ID"
              value={userFilter}
              onChange={(e) => { setUserFilter(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="SUBMIT">Submit</option>
            <option value="VIEW">View</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Audit Logs</h3>
            <p className="text-gray-500">No activity recorded yet.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Timestamp</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Details</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">IP Address</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id || log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {log.user?.firstName} {log.user?.lastName || log.userId || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.action === 'LOGIN' || log.action === 'LOGOUT' ? 'bg-blue-100 text-blue-700'
                          : log.action === 'CREATE' ? 'bg-green-100 text-green-700'
                          : log.action === 'UPDATE' ? 'bg-amber-100 text-amber-700'
                          : log.action === 'DELETE' ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                          {log.action || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{log.details || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.ipAddress || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate" title={log.userAgent}>
                        {formatUA(log.userAgent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
