import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5050/api/auth/login', {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 relative overflow-hidden">

      {/* Subtle ruled-line texture, like a register page */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 35px, #1B2A4A 35px, #1B2A4A 36px)',
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Brand mark */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-ink"></span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-ink/5 border border-ink/5 p-8 sm:p-10">
          <h1 className="font-display text-3xl text-ink mb-1 tracking-tight">
            Attendance Register
          </h1>
          <p className="text-slate text-sm mb-8">
            Sign in to mark, review, and manage attendance.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institute.edu"
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white font-medium py-2.5 rounded-lg hover:bg-ink/90 active:scale-[0.99] transition disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate/70 mt-6">
          InnoViast · Institutional Attendance Operations Platform
        </p>
      </div>
    </div>
  );
}

export default Login;