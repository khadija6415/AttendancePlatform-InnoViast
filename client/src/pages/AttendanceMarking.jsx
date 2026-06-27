import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: 'bg-success text-white' },
  { value: 'late', label: 'Late', color: 'bg-amber text-white' },
  { value: 'absent', label: 'Absent', color: 'bg-red-500 text-white' },
];

function AttendanceMarking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchStudents = async () => {
    try {
     const res = await axios.get('https://attendanceplatform-innoviast.onrender.com/api/auth/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Could not load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const setStatus = (studentId, status) => {
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage('');

    try {
      const entries = Object.entries(marks);
      for (const [studentId, status] of entries) {
        await axios.post(
          'https://attendanceplatform-innoviast.onrender.com/api/attendance',
          { student: studentId, session: sessionId, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setMessage(`Attendance saved for ${entries.length} student(s).`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-8 max-w-md text-center">
          <p className="text-ink font-medium mb-2">No class selected</p>
          <p className="text-slate text-sm mb-6">Go back to the dashboard and choose a class to mark attendance for.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

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

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl text-ink mb-2">Mark attendance</h2>
        <p className="text-slate mb-8">Set a status for each student, then save.</p>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-ink/5 border border-ink/10 text-ink text-sm">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 sm:p-8">
          {loading ? (
            <p className="text-slate text-sm">Loading students…</p>
          ) : students.length === 0 ? (
            <p className="text-slate text-sm">No students found yet.</p>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-ink/10"
                >
                  <div>
                    <p className="font-medium text-ink">{student.name}</p>
                    <p className="text-xs text-slate">{student.email}</p>
                  </div>

                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setStatus(student._id, opt.value)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                          marks[student._id] === opt.value
                            ? opt.color
                            : 'bg-ink/5 text-slate hover:bg-ink/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {students.length > 0 && (
          <button
            onClick={handleSaveAll}
            disabled={saving || Object.keys(marks).length === 0}
            className="mt-6 w-full bg-ink text-white font-medium py-3 rounded-lg hover:bg-ink/90 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save attendance'}
          </button>
        )}
      </main>
    </div>
  );
}

export default AttendanceMarking;