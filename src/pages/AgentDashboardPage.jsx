import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  Building2,
  MessageSquare,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { LoadingSkeleton, EmptyState } from '../components/FeedbackState.jsx';

export default function AgentDashboardPage() {
  const { user, token } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'visits' | 'properties' | 'deals'
  const [enquiries, setEnquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Visit feedback modal state
  const [activeVisitModal, setActiveVisitModal] = useState(null);
  const [visitFeedbackText, setVisitFeedbackText] = useState('');

  useEffect(() => {
    loadAgentData();
  }, [activeTab]);

  const loadAgentData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Assigned Enquiries
      const resEnq = await fetch('/api/enquiries', { headers });
      const dataEnq = await resEnq.json();
      if (dataEnq.success) setEnquiries(dataEnq.data);

      // Assigned Visits
      const resVisits = await fetch('/api/visits', { headers });
      const dataVisits = await resVisits.json();
      if (dataVisits.success) setVisits(dataVisits.data);

      // Assigned Properties
      const resProps = await fetch(`/api/properties?agentId=${user?._id}&limit=50`);
      const dataProps = await resProps.json();
      if (dataProps.success) setProperties(dataProps.data);

      // Assigned Deals
      const resDeals = await fetch('/api/deals', { headers });
      const dataDeals = await resDeals.json();
      if (dataDeals.success) setDeals(dataDeals.data);
    } catch (e) {
      toast.error('Error fetching agent records');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (enquiryId, status) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Enquiry marked as ${status}`);
        setEnquiries((prev) =>
          prev.map((e) => (e._id === enquiryId ? { ...e, status } : e))
        );
      }
    } catch (e) {
      toast.error('Could not update status');
    }
  };

  const handleCompleteVisitWithFeedback = async (e) => {
    e.preventDefault();
    if (!activeVisitModal) return;

    try {
      const res = await fetch(`/api/visits/${activeVisitModal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'completed',
          feedback: visitFeedbackText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Walkthrough marked as completed with feedback recorded.');
        setVisits((prev) =>
          prev.map((v) =>
            v._id === activeVisitModal._id
              ? { ...v, status: 'completed', feedback: visitFeedbackText }
              : v
          )
        );
        setActiveVisitModal(null);
        setVisitFeedbackText('');
      }
    } catch (err) {
      toast.error('Failed to update visit feedback');
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Agent Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-600">
              Agent Showing & Client Workspace
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.title || 'Senior Real Estate Specialist'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-400">Scheduled Showings:</span>{' '}
            <strong className="font-mono text-slate-900">{visits.filter((v) => v.status === 'scheduled').length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-400">Open Inquiries:</span>{' '}
            <strong className="font-mono text-slate-900">{enquiries.filter((e) => e.status !== 'closed').length}</strong>
          </div>
        </div>
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
          <span>Assigned Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'visits' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduled Showings ({visits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'properties' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Assigned Portfolio ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'deals' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Deals ({deals.length})</span>
        </button>
      </div>

      {loading && <LoadingSkeleton count={3} />}

      {/* TAB 1: ENQUIRIES */}
      {!loading && activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <EmptyState title="No assigned enquiries" description="New customer inquiries for your properties will show here." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enquiries.map((enq) => (
                <div key={enq._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{enq.customerName}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {enq.customerEmail}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {enq.customerPhone}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-sky-50 text-sky-800 border border-sky-200">
                      {enq.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Property: {enq.property?.title}
                    </div>
                    <p className="italic">"{enq.message}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Received: {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(enq._id, 'contacted')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(enq._id, 'scheduled')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        Scheduled
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(enq._id, 'closed')}
                        className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium transition-colors"
                      >
                        Resolved
                      </button>
                    </div>
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
            <EmptyState title="No walkthroughs scheduled" description="Customer showing requests will populate your calendar here." />
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

                  <div className="text-xs text-slate-700">
                    <div className="font-semibold text-slate-900">{vis.property?.title}</div>
                    <div className="text-slate-500">{vis.property?.location?.address}, {vis.property?.location?.city}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="font-medium text-slate-900">Client: {vis.customer?.name}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{vis.customer?.email} · {vis.customer?.phone}</div>
                    {vis.notes && <div className="text-slate-600 text-[11px] mt-1">Notes: "{vis.notes}"</div>}
                    {vis.feedback && (
                      <div className="text-emerald-800 text-[11px] mt-1 font-medium">Feedback: "{vis.feedback}"</div>
                    )}
                  </div>

                  {vis.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        setActiveVisitModal(vis);
                        setVisitFeedbackText(vis.feedback || '');
                      }}
                      className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      Complete Showing & Log Client Feedback
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROPERTIES */}
      {!loading && activeTab === 'properties' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="aspect-[16/10] bg-slate-100">
                <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-mono tabular-nums font-bold text-slate-900 text-lg mb-1">
                    {formatPrice(p.price)}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{p.title}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">{p.location.address}, {p.location.city}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="uppercase text-[10px] font-semibold text-slate-600">{p.status.replace('_', ' ')}</span>
                  <span className="text-slate-400 capitalize">{p.propertyType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: DEALS */}
      {!loading && activeTab === 'deals' && (
        <div className="space-y-4">
          {deals.length === 0 ? (
            <EmptyState title="No active contracts" description="Deals in negotiation or closing will show here." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deals.map((d) => (
                <div key={d._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                        {formatPrice(d.agreedPrice)}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{d.dealType} Transaction</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-50 text-amber-900 border border-amber-200">
                      {d.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700">
                    <div className="font-medium text-slate-900">{d.property?.title}</div>
                    <div className="text-slate-500">Buyer: {d.customer?.name}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
                    <div>Target Closing: <strong className="font-mono">{d.closingDate}</strong></div>
                    <div className="text-[11px] text-slate-500">{d.paymentTerms}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FEEDBACK RECORD MODAL */}
      {activeVisitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Record Walkthrough Feedback</h3>
            <p className="text-xs text-slate-500">
              Walkthrough for: <strong>{activeVisitModal.property?.title}</strong> with{' '}
              <strong>{activeVisitModal.customer?.name}</strong>.
            </p>

            <form onSubmit={handleCompleteVisitWithFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Showing Outcome / Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Client expressed strong interest in master suite and ocean view. Moving to formal written offer..."
                  value={visitFeedbackText}
                  onChange={(e) => setVisitFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveVisitModal(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                  Save & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
