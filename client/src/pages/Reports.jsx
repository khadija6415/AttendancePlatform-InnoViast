import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_BADGE = {
  present: 'bg-success/10 text-success',
  late: 'bg-amber/10 text-amber',
  absent: 'bg-red-50 text-red-600',
};

function Reports() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [records, setRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    session: '',
    status: '',
  });

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/classes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error('Could not load classes', err);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.session) params.session = filters.session;
      if (filters.status) params.status = filters.status;

      const res = await axios.get('http://localhost:5050/api/attendance', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setRecords(res.data);
    } catch (err) {
      console.error('Could not load attendance records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Student Email', 'Class', 'Date', 'Time', 'Status'];
    const rows = records.map((r) => [
      r.student?.name || '',
      r.student?.email || '',
      r.session?.title || '',
      r.session?.date ? new Date(r.session.date).toLocaleDateString('en-GB') : '',
      r.session?.time || '',
      r.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-white border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          <span className="w-2 h-2 rounded-full bg-amber"></span>
          <span className="w-2 h-2 rounded-full bg-ink"></span>
          <h1 className="font-display text-xl text-ink ml-2 tracking-tight">
            Attendance Register
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm px-4 py-2 rounded-lg border border-ink/15 text-ink hover:bg-ink hover:text-white transition"
        >
          Back to dashboard
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-2xl text-ink">Attendance reports</h2>
          <button
            onClick={handleExportCSV}
            disabled={records.length === 0}
            className="text-sm px-4 py-2 rounded-lg bg-ink text-white font-medium hover:bg-ink/90 transition disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>
        <p className="text-slate mb-8">Filter and review attendance history.</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate mb-1.5">Class</label>
            <select
              value={filters.session}
              onChange={(e) => handleFilterChange('session', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-amber/40"
            >
              <option value="">All classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.title}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate mb-1.5">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-amber/40"
            >
              <option value="">All statuses</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Records table */}
        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-slate text-sm p-8">Loading…</p>
          ) : records.length === 0 ? (
            <p className="text-slate text-sm p-8">No attendance records match these filters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-slate text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Class</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-b border-ink/5 last:border-0">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{r.student?.name}</p>
                      <p className="text-xs text-slate">{r.student?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-ink">{r.session?.title}</td>
                    <td className="px-6 py-4 text-slate">
                      {r.session?.date ? new Date(r.session.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_BADGE[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reports;