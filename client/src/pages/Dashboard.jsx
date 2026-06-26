import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = {
    admin: 'Administrator',
    instructor: 'Instructor',
    student: 'Student',
  };

  return (
    <div className="min-h-screen bg-paper">

      {/* Top bar */}
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

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl text-ink mb-2">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
        <p className="text-slate mb-8">
          Here's what's happening with attendance today.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-8 text-center">
          <p className="text-slate">
            Dashboard content for <span className="font-medium text-ink">{roleLabel[user?.role]}</span> coming next.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;