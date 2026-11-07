import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Building2, LogIn, Lock, Mail, Shield, Briefcase, User } from 'lucide-react';

export default function LoginPage() {
  const { login, demoAccounts } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Controlled form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Controlled Form Submission with event.preventDefault() and Client Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser.name}!`);

      if (from !== '/') {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (loggedUser.role === 'agent') {
        navigate('/agent', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrors({});
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to EstatePulse</h1>
          <p className="text-xs text-slate-500">
            Access your real estate console, client listings, and active transactions
          </p>
        </div>

        {/* 1-Click Quick Persona Autofill */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block text-center">
            One-Click Test Account Autofill
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleFillDemo({ email: 'admin@estatepulse.com', password: 'admin123' })}
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-800 flex items-center justify-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3 text-amber-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo({ email: 'sarah.agent@estatepulse.com', password: 'agent123' })}
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-800 flex items-center justify-center gap-1 transition-colors"
            >
              <Briefcase className="w-3 h-3 text-sky-600" />
              <span>Agent</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo({ email: 'elena.buyer@gmail.com', password: 'customer123' })}
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-800 flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3 text-emerald-600" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {/* Controlled Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@estatepulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2.5 pl-9 border rounded-lg outline-none text-slate-900 ${
                  errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            {errors.email && <span className="text-rose-600 text-[11px] mt-1 block">{errors.email}</span>}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2.5 pl-9 border rounded-lg outline-none text-slate-900 ${
                  errors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            {errors.password && <span className="text-rose-600 text-[11px] mt-1 block">{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-slate-900 hover:text-amber-600 underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
