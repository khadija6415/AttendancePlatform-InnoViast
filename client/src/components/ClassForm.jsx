import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ClassForm({ onClassCreated }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
       'https://attendanceplatform-innoviast.onrender.com/api/classes',
        { title, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Class created successfully.');
      setTitle('');
      setDate('');
      setTime('');

      if (onClassCreated) onClassCreated(res.data.class);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Only Admin/Instructor can see this form
  if (user?.role !== 'admin' && user?.role !== 'instructor') {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 sm:p-8">
      <h3 className="font-display text-xl text-ink mb-1">Create a class</h3>
      <p className="text-sm text-slate mb-6">
        Set up a new session to take attendance for.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-success text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Class title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Math Class - Morning Batch"
            className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Time
            </label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM"
              className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-white font-medium py-2.5 rounded-lg hover:bg-ink/90 active:scale-[0.99] transition disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create class'}
        </button>
      </form>
    </div>
  );
}

export default ClassForm;