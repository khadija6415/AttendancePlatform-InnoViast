import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5050/api/auth/signup', {
        name,
        email,
        password,
        role,
      });

      setSuccess('Account created successfully. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 relative overflow-hidden">

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 35px, #1B2A4A 35px, #1B2A4A 36px)',
        }}
      />

      <div className="relative w-full max-w-md">

        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-ink"></span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-ink/5 border border-ink/5 p-8 sm:p-10">
          <h1 className="font-display text-3xl text-ink mb-1 tracking-tight">
            Create an account
          </h1>
          <p className="text-slate text-sm mb-8">
            Join the attendance register to get started.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-success text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali Khan"
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
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
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white font-medium py-2.5 rounded-lg hover:bg-ink/90 active:scale-[0.99] transition disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;