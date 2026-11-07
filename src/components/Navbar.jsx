import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  Building2,
  UserCheck,
  LogOut,
  LogIn,
  Layers,
  FileCode2,
  ChevronDown,
  Shield,
  Briefcase,
  User,
} from 'lucide-react';

export default function Navbar({ onOpenSubmissionModal }) {
  const { user, logout, switchDemoUser, demoAccounts } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('You have logged out');
    navigate('/');
  };

  const handleQuickSwitch = async (acc) => {
    try {
      await switchDemoUser(acc.email, acc.password);
      toast.success(`Switched role to ${acc.role.toUpperCase()} (${acc.name})`);
      setDemoMenuOpen(false);
      if (acc.role === 'admin') navigate('/admin');
      else if (acc.role === 'agent') navigate('/agent');
      else navigate('/customer');
    } catch (err) {
      toast.error('Quick switch failed');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Testing Utility Bar for Evaluators / Quick Role Switching */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">Project 12: Real Estate Management (MERN)</span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-400">JWT · Mongoose · RBAC · React Context</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">
                  {user ? `Role: ${user.role.toUpperCase()}` : 'Quick Demo Logins'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Test Persona
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {demoAccounts.map((acc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickSwitch(acc)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          user?.email === acc.email
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                            : 'hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-medium truncate">{acc.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{acc.role} · {acc.email}</div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded shrink-0 ml-2">
                          {acc.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission Pack Modal Trigger */}
            <button
              type="button"
              onClick={onOpenSubmissionModal}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>ER Diagram & Postman</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones (Brand, Nav Links, Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <span>Estate<span className="text-amber-600 font-semibold">Pulse</span></span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link
            to="/properties"
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              isActive('/properties') ? 'text-slate-900 font-semibold' : ''
            }`}
          >
            All Listings
          </Link>

          {/* Role-Specific Portal Links */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                location.pathname.startsWith('/admin') ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Admin Console</span>
            </Link>
          )}

          {user?.role === 'agent' && (
            <Link
              to="/agent"
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                location.pathname.startsWith('/agent') ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              <Briefcase className="w-4 h-4 text-sky-600" />
              <span>Agent Workspace</span>
            </Link>
          )}

          {user?.role === 'customer' && (
            <Link
              to="/customer"
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                location.pathname.startsWith('/customer') ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>My Dashboard</span>
            </Link>
          )}

          <button
            type="button"
            onClick={onOpenSubmissionModal}
            className="text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Project Docs & API
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</span>
                <span className="text-[11px] text-slate-500 capitalize">{user.role}</span>
              </div>
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
