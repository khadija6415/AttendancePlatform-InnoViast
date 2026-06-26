import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClassForm from '../components/ClassForm';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const roleLabel = {
    admin: 'Administrator',
    instructor: 'Instructor',
    student: 'Student',
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/classes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error('Could not load classes', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClassCreated = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
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

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-ink">{user?.name}</p>
            <p className="text-xs text-slate">{roleLabel[user?.role] || user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border border-ink/15 text-ink hover:bg-ink hover:text-white transition"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl text-ink mb-2">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
        <p className="text-slate mb-8">
          Here's what's happening with attendance today.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(user?.role === 'admin' || user?.role === 'instructor') && (
            <div className="lg:col-span-1">
              <ClassForm onClassCreated={handleClassCreated} />
            </div>
          )}

          <div className={user?.role === 'student' ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 sm:p-8">
              <h3 className="font-display text-xl text-ink mb-1">Classes</h3>
              <p className="text-sm text-slate mb-6">
                All sessions scheduled so far.
              </p>

              {loadingClasses ? (
                <p className="text-slate text-sm">Loading…</p>
              ) : classes.length === 0 ? (
                <p className="text-slate text-sm">No classes yet. Create one to get started.</p>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => (
                    <div
                      key={cls._id}
                      className="flex items-center justify-between px-4 py-3 rounded-lg border border-ink/10 hover:border-amber/40 transition"
                    >
                      <div>
                        <p className="font-medium text-ink">{cls.title}</p>
                        <p className="text-xs text-slate">
                          {new Date(cls.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {cls.time}
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-ink/5 text-ink">
                        {cls.instructor?.name || 'Instructor'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;