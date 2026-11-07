import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  MessageSquare,
  Calendar,
  Briefcase,
  Building,
  Clock,
  ArrowRight,
  XCircle,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { LoadingSkeleton, EmptyState } from '../components/FeedbackState.jsx';

export default function CustomerDashboardPage() {
  const { user, token } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'visits' | 'deals'
  const [enquiries, setEnquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, [activeTab]);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // My Enquiries
      const resEnq = await fetch('/api/enquiries', { headers });
      const dataEnq = await resEnq.json();
      if (dataEnq.success) setEnquiries(dataEnq.data);

      // My Visits
      const resVisits = await fetch('/api/visits', { headers });
      const dataVisits = await resVisits.json();
      if (dataVisits.success) setVisits(dataVisits.data);

      // My Deals
      const resDeals = await fetch('/api/deals', { headers });
      const dataDeals = await resDeals.json();
      if (dataDeals.success) setDeals(dataDeals.data);
    } catch (e) {
      toast.error('Error fetching customer records');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelVisit = async (visitId) => {
    if (!window.confirm('Cancel this scheduled walkthrough?')) return;
    try {
      const res = await fetch(`/api/visits/${visitId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.info('Visit cancelled');
        setVisits((prev) =>
          prev.map((v) => (v._id === visitId ? { ...v, status: 'cancelled' } : v))
        );
      }
    } catch (err) {
      toast.error('Failed to cancel visit');
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Customer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Customer Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{user?.name}</h1>
            <p className="text-xs text-slate-500">Track property inquiries, scheduled showings, and purchase offers.</p>
          </div>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <Building className="w-4 h-4" />
          <span>Browse Properties</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'enquiries' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'visits' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Scheduled Showings ({visits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'deals' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Transactions ({deals.length})</span>
        </button>
      </div>

      {loading && <LoadingSkeleton count={3} />}

      {/* TAB 1: ENQUIRIES */}
      {!loading && activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <EmptyState
              title="No property inquiries submitted"
              description="Explore luxury listings and submit an enquiry to connect with dedicated specialists."
              actionLabel="Explore Portfolio"
              onAction={() => (window.location.href = '/properties')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enquiries.map((enq) => (
                <div key={enq._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{enq.property?.title}</h4>
                      <div className="font-mono text-xs font-semibold text-amber-700 tabular-nums mt-0.5">
                        {formatPrice(enq.property?.price || 0)}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-sky-50 text-sky-800 border border-sky-200">
                      {enq.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Your Message:
                    </span>
                    <p className="italic">"{enq.message}"</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="text-[11px]">Assigned Agent:</span>
                      <strong className="text-slate-800">{enq.agent?.name || 'Sarah Jenkins'}</strong>
                    </div>
                    <Link
                      to={`/properties/${enq.propertyId}`}
                      className="text-xs font-semibold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1"
                    >
                      <span>View Listing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VISITS */}
      {!loading && activeTab === 'visits' && (
        <div className="space-y-4">
          {visits.length === 0 ? (
            <EmptyState
              title="No walkthrough showings scheduled"
              description="Visit any listing page to pick a date and schedule a private showing."
              actionLabel="View Properties"
              onAction={() => (window.location.href = '/properties')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visits.map((vis) => (
                <div key={vis._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-sm font-bold text-slate-900">{vis.visitDate}</div>
                      <div className="text-xs text-slate-500">{vis.visitTimeSlot}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {vis.status}
                    </span>
                  </div>

                  <div className="text-xs">
                    <h4 className="font-semibold text-slate-900">{vis.property?.title}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {vis.property?.location?.address}, {vis.property?.location?.city}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Host Agent:</span>
                      <span className="font-medium">{vis.agent?.name || 'Sarah Jenkins'}</span>
                    </div>
                    {vis.feedback && (
                      <div className="pt-1.5 border-t border-slate-200/60 text-emerald-800 text-[11px]">
                        <strong>Agent Feedback:</strong> "{vis.feedback}"
                      </div>
                    )}
                  </div>

                  {vis.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancelVisit(vis._id)}
                      className="w-full py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors"
                    >
                      Cancel Walkthrough
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEALS */}
      {!loading && activeTab === 'deals' && (
        <div className="space-y-4">
          {deals.length === 0 ? (
            <EmptyState
              title="No active transactions"
              description="Formal purchase offers and closing escrow milestones will be managed here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deals.map((deal) => (
                <div key={deal._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                        {formatPrice(deal.agreedPrice)}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{deal.dealType} Transaction</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-50 text-amber-900 border border-amber-200">
                      {deal.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs">
                    <h4 className="font-medium text-slate-900">{deal.property?.title}</h4>
                    <p className="text-slate-500 text-[11px]">Managing Agent: {deal.agent?.name}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 space-y-1">
                    <div>Target Closing Date: <strong className="font-mono">{deal.closingDate}</strong></div>
                    <div className="text-[11px] text-slate-500">{deal.paymentTerms}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
