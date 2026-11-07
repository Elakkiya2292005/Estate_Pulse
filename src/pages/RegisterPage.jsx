import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Building2, UserPlus, Lock, Mail, User, Phone, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Controlled form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
    title: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Controlled Form Submission with event.preventDefault() and Client Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Phone number must have at least 7 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const newUser = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        title: formData.title || (formData.role === 'agent' ? 'Licensed Specialist' : 'Customer'),
      });

      toast.success(`Account created! Welcome, ${newUser.name}`);
      if (newUser.role === 'admin') navigate('/admin');
      else if (newUser.role === 'agent') navigate('/agent');
      else navigate('/customer');
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      }
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create EstatePulse Account</h1>
          <p className="text-xs text-slate-500">
            Select your real estate persona to access tailored tools and permissions
          </p>
        </div>

        {/* Controlled Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Jordan Mitchell"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 pl-9 border rounded-lg outline-none text-slate-900 ${
                  errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {errors.name && <span className="text-rose-600 text-[11px] mt-1 block">{errors.name}</span>}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="jordan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 pl-9 border rounded-lg outline-none text-slate-900 ${
                  errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {errors.email && <span className="text-rose-600 text-[11px] mt-1 block">{errors.email}</span>}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3 py-2 pl-9 border rounded-lg outline-none text-slate-900 ${
                  errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {errors.phone && <span className="text-rose-600 text-[11px] mt-1 block">{errors.phone}</span>}
          </div>

          {/* Account Role Selection */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">Account Role</label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-2 rounded-lg border text-center cursor-pointer transition-colors ${
                  formData.role === 'customer'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="sr-only"
                />
                <span>Customer</span>
              </label>

              <label
                className={`p-2 rounded-lg border text-center cursor-pointer transition-colors ${
                  formData.role === 'agent'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="agent"
                  checked={formData.role === 'agent'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="sr-only"
                />
                <span>Agent</span>
              </label>

              <label
                className={`p-2 rounded-lg border text-center cursor-pointer transition-colors ${
                  formData.role === 'admin'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="sr-only"
                />
                <span>Admin</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-3 py-2 pl-9 border rounded-lg outline-none text-slate-900 ${
                    errors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {errors.password && <span className="text-rose-600 text-[11px] mt-1 block">{errors.password}</span>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Confirm</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Re-enter"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 pl-9 border rounded-lg outline-none text-slate-900 ${
                    errors.confirmPassword ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {errors.confirmPassword && (
                <span className="text-rose-600 text-[11px] mt-1 block">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Registering...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-amber-600 underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
