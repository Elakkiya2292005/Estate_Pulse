import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SubmissionModal from './components/SubmissionModal.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import PropertiesPage from './pages/PropertiesPage.jsx';
import PropertyDetailPage from './pages/PropertyDetailPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AgentDashboardPage from './pages/AgentDashboardPage.jsx';
import CustomerDashboardPage from './pages/CustomerDashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import { Building2, FileText, Database, ShieldCheck } from 'lucide-react';

export default function App() {
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
            {/* Top Navigation */}
            <Navbar onOpenSubmissionModal={() => setSubmissionModalOpen(true)} />

            {/* Main Viewport Content */}
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Role-Protected Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent/*"
                  element={
                    <ProtectedRoute allowedRoles={['agent']}>
                      <AgentDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/*"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-base">
                      <Building2 className="w-5 h-5 text-amber-400" />
                      <span>Estate<span className="text-amber-500">Pulse</span></span>
                    </div>
                    <p className="text-slate-400 max-w-md">
                      Project 12: Real Estate Management MERN Full-Stack System with JWT Security, Mongoose Relational Schemas, and Role-Based Portals.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setSubmissionModalOpen(true)}
                      className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Database className="w-4 h-4 text-amber-400" />
                      <span>ER Diagram (6 Models)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionModalOpen(true)}
                      className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-sky-400" />
                      <span>Postman Collection</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionModalOpen(true)}
                      className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>100-Mark Rubric</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
                  <div>
                    &copy; {new Date().getFullYear()} EstatePulse Real Estate Management System. All rights reserved.
                  </div>
                  <div className="flex items-center gap-4">
                    <span>MongoDB Atlas &amp; Mongoose</span>
                    <span>·</span>
                    <span>Express.js REST APIs</span>
                    <span>·</span>
                    <span>React Context API</span>
                  </div>
                </div>
              </div>
            </footer>

            {/* Submission Documentation & ER Modal */}
            <SubmissionModal
              isOpen={submissionModalOpen}
              onClose={() => setSubmissionModalOpen(false)}
            />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
