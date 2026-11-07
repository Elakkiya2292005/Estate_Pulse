import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  BarChart3,
  Building,
  MessageSquare,
  Calendar,
  Briefcase,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  CheckCircle2,
  Clock,
  TrendingUp,
  X,
  UserCheck,
} from 'lucide-react';
import { LoadingSkeleton, EmptyState } from '../components/FeedbackState.jsx';

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'properties' | 'enquiries' | 'visits' | 'deals'

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controlled Create Property Modal State
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'villa',
    status: 'available',
    address: '',
    city: 'Montecito',
    state: 'California',
    pincode: '93108',
    bedrooms: '4',
    bathrooms: '3',
    areaSqFt: '3500',
    furnished: 'furnished',
    parking: true,
    featured: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Controlled Create Deal Modal State
  const [showDealModal, setShowDealModal] = useState(false);
  const [dealForm, setDealForm] = useState({
    propertyId: '',
    customerId: 'usr-cust-1',
    agentId: 'usr-agent-1',
    agreedPrice: '',
    dealType: 'sale',
    stage: 'offer_made',
    closingDate: '2026-04-15',
    paymentTerms: '10% escrow earnest deposit, balance upon closing inspection.',
    notes: '',
  });

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Load Analytics
      const resAnalytics = await fetch('/api/reports/dashboard', { headers });
      const dataAnalytics = await resAnalytics.json();
      if (dataAnalytics.success) setAnalytics(dataAnalytics.data);

      // Load Properties
      const resProps = await fetch('/api/properties?limit=50');
      const dataProps = await resProps.json();
      if (dataProps.success) setProperties(dataProps.data);

      // Load Enquiries
      const resEnq = await fetch('/api/enquiries', { headers });
      const dataEnq = await resEnq.json();
      if (dataEnq.success) setEnquiries(dataEnq.data);

      // Load Visits
      const resVisits = await fetch('/api/visits', { headers });
      const dataVisits = await resVisits.json();
      if (dataVisits.success) setVisits(dataVisits.data);

      // Load Deals
      const resDeals = await fetch('/api/deals', { headers });
      const dataDeals = await resDeals.json();
      if (dataDeals.success) setDeals(dataDeals.data);
    } catch (e) {
      toast.error('Error fetching admin records');
    } finally {
      setLoading(false);
    }
  };

  // Create Property with Client Validation & event.preventDefault()
  const handleCreateProperty = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!propertyForm.title.trim()) errors.title = 'Title is required';
    if (!propertyForm.description.trim()) errors.description = 'Description is required';
    if (!propertyForm.price || Number(propertyForm.price) <= 0) errors.price = 'Valid price required';
    if (!propertyForm.address.trim()) errors.address = 'Street address is required';
    if (!propertyForm.city.trim()) errors.city = 'City is required';
    if (!propertyForm.pincode.trim()) errors.pincode = 'Pincode is required';
    if (!propertyForm.areaSqFt || Number(propertyForm.areaSqFt) <= 0) errors.areaSqFt = 'Valid Sq Ft required';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: propertyForm.title,
          description: propertyForm.description,
          price: Number(propertyForm.price),
          propertyType: propertyForm.propertyType,
          status: propertyForm.status,
          location: {
            address: propertyForm.address,
            city: propertyForm.city,
            state: propertyForm.state,
            pincode: propertyForm.pincode,
          },
          features: {
            bedrooms: Number(propertyForm.bedrooms),
            bathrooms: Number(propertyForm.bathrooms),
            areaSqFt: Number(propertyForm.areaSqFt),
            furnished: propertyForm.furnished,
            parking: propertyForm.parking,
            amenities: ['Central Air', 'Smart Security', 'Architectural Glass', 'Designer Kitchen'],
          },
          images: [
            '/src/assets/images/hero_modern_villa_1794056675259.jpg',
            '/src/assets/images/prop_penthouse_skyline_1794056675330.jpg',
          ],
          featured: propertyForm.featured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Property listing created successfully');
        setShowPropertyModal(false);
        setPropertyForm({
          title: '',
          description: '',
          price: '',
          propertyType: 'villa',
          status: 'available',
          address: '',
          city: 'Montecito',
          state: 'California',
          pincode: '93108',
          bedrooms: '4',
          bathrooms: '3',
          areaSqFt: '3500',
          furnished: 'furnished',
          parking: true,
          featured: true,
        });
        loadAllData();
      } else {
        toast.error(data.message || 'Creation failed');
      }
    } catch (err) {
      toast.error('Network error creating property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Are you sure you want to remove this property?')) return;
    try {
      const res = await fetch(`/api/properties/${propId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Property removed from catalog');
        setProperties((prev) => prev.filter((p) => p._id !== propId));
      }
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  const handleUpdateEnquiryStatus = async (enquiryId, newStatus) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Enquiry status changed to ${newStatus}`);
        setEnquiries((prev) =>
          prev.map((e) => (e._id === enquiryId ? { ...e, status: newStatus } : e))
        );
      }
    } catch (e) {
      toast.error('Failed to update enquiry status');
    }
  };

  const handleUpdateDealStage = async (dealId, newStage) => {
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deal stage updated to ${newStage.replace('_', ' ')}`);
        setDeals((prev) =>
          prev.map((d) => (d._id === dealId ? { ...d, stage: newStage } : d))
        );
      }
    } catch (e) {
      toast.error('Failed to update deal stage');
    }
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    if (!dealForm.propertyId) {
      toast.error('Please select a property');
      return;
    }
    if (!dealForm.agreedPrice || Number(dealForm.agreedPrice) <= 0) {
      toast.error('Please enter a valid agreed valuation');
      return;
    }

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: dealForm.propertyId,
          customerId: dealForm.customerId,
          agentId: dealForm.agentId,
          agreedPrice: Number(dealForm.agreedPrice),
          dealType: dealForm.dealType,
          stage: dealForm.stage,
          closingDate: dealForm.closingDate,
          paymentTerms: dealForm.paymentTerms,
          notes: dealForm.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Deal recorded in pipeline');
        setShowDealModal(false);
        loadAllData();
      }
    } catch (err) {
      toast.error('Could not create deal');
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
            Administrative Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">Brokerage Management Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            System Overseer: <strong>{user?.name}</strong> · Role: <span className="font-mono text-amber-700">admin</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPropertyModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
          <button
            onClick={() => {
              if (properties.length > 0) {
                setDealForm((prev) => ({ ...prev, propertyId: properties[0]._id, agreedPrice: properties[0].price.toString() }));
              }
              setShowDealModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Log Deal</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'properties' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Properties ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'enquiries' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'visits' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Walkthrough Visits ({visits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'deals' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Deals Pipeline ({deals.length})</span>
        </button>
      </div>

      {loading && <LoadingSkeleton count={3} />}

      {/* TAB 1: ANALYTICS & REPORTS (Requirement 8) */}
      {!loading && activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* KPI Matrix with Tabular Figures */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Active Pipeline</span>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                {formatPrice(analytics.kpi.totalPipelineValue)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Active transactional value</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Closed Won Revenue</span>
              <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                {formatPrice(analytics.kpi.closedRevenue)}
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">Executed escrow closings</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Active Listings</span>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                {analytics.kpi.availableProperties} / {analytics.kpi.totalProperties}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Available for buyer showing</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Customer Enquiries</span>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                {analytics.kpi.totalEnquiries} ({analytics.kpi.newEnquiries} New)
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Scheduled showings: {analytics.kpi.scheduledVisits}</div>
            </div>
          </div>

          {/* Pipeline Stage Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Deals Pipeline by Commercial Stage</h3>
                <p className="text-xs text-slate-500">Live funnel progression from initial inquiry to closed transaction.</p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-600">Total Deals: {deals.length}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Inquiry</span>
                <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                  {analytics.dealsByStage.inquiry}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                <span className="text-[10px] uppercase font-semibold text-amber-800">Offer Made</span>
                <div className="text-xl font-bold text-amber-900 font-mono tabular-nums mt-1">
                  {analytics.dealsByStage.offer_made}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-sky-200 bg-sky-50/50">
                <span className="text-[10px] uppercase font-semibold text-sky-800">Under Contract</span>
                <div className="text-xl font-bold text-sky-900 font-mono tabular-nums mt-1">
                  {analytics.dealsByStage.under_contract}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="text-[10px] uppercase font-semibold text-emerald-800">Closed Won</span>
                <div className="text-xl font-bold text-emerald-900 font-mono tabular-nums mt-1">
                  {analytics.dealsByStage.closed_won}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Closed Lost</span>
                <div className="text-xl font-bold text-slate-700 font-mono tabular-nums mt-1">
                  {analytics.dealsByStage.closed_lost}
                </div>
              </div>
            </div>
          </div>

          {/* Agent Leaderboard */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Agent Performance & Deal Volume</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Agent</th>
                    <th className="p-3">Specialization</th>
                    <th className="p-3 text-center">Active Visits</th>
                    <th className="p-3 text-center">Total Deals</th>
                    <th className="p-3 text-center">Closed Won</th>
                    <th className="p-3 text-right">Closed Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {analytics.agentLeaderboard.map((ag) => (
                    <tr key={ag.id} className="hover:bg-slate-50/50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img src={ag.avatar} alt={ag.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-slate-900">{ag.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{ag.email}</div>
                        </div>
                      </td>
                      <td className="p-3">{ag.title}</td>
                      <td className="p-3 text-center font-mono tabular-nums">{ag.activeVisits}</td>
                      <td className="p-3 text-center font-mono tabular-nums">{ag.totalDeals}</td>
                      <td className="p-3 text-center font-mono tabular-nums font-semibold text-emerald-700">{ag.closedWon}</td>
                      <td className="p-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatPrice(ag.closedVolume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTIES MANAGEMENT */}
      {!loading && activeTab === 'properties' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Active Inventory: {properties.length} Properties
            </span>
            <button
              onClick={() => setShowPropertyModal(true)}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Property</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Property</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">City</th>
                  <th className="p-3 font-mono">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{p.title}</div>
                      <div className="text-[11px] text-slate-400">{p.location.address}</div>
                    </td>
                    <td className="p-3 capitalize">{p.propertyType}</td>
                    <td className="p-3">{p.location.city}</td>
                    <td className="p-3 font-mono font-semibold tabular-nums text-slate-900">
                      {formatPrice(p.price)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase border bg-slate-100 text-slate-700 border-slate-200">
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">{p.agent?.name || 'Assigned Agent'}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteProperty(p._id)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ENQUIRIES MANAGEMENT */}
      {!loading && activeTab === 'enquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-800">
              Customer Enquiries Pipeline: {enquiries.length} Inquiries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Assigned Agent</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{e.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{e.customerEmail}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{e.customerPhone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800 max-w-xs truncate">{e.property?.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{formatPrice(e.property?.price || 0)}</div>
                    </td>
                    <td className="p-3 max-w-xs text-slate-600 line-clamp-2">{e.message}</td>
                    <td className="p-3">{e.agent?.name || 'Sarah Jenkins'}</td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={e.status}
                        onChange={(evt) => handleUpdateEnquiryStatus(e._id, evt.target.value)}
                        className="px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-800"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: VISITS MANAGEMENT */}
      {!loading && activeTab === 'visits' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-800">
              Walkthrough Appointments: {visits.length} Scheduled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes & Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visits.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 font-mono">{v.visitDate}</div>
                      <div className="text-[11px] text-slate-500">{v.visitTimeSlot}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-900">{v.property?.title}</div>
                      <div className="text-[10px] text-slate-400">{v.property?.location?.city}</div>
                    </td>
                    <td className="p-3">{v.customer?.name || 'Customer'}</td>
                    <td className="p-3">{v.agent?.name || 'Assigned Agent'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs">{v.feedback || v.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DEALS PIPELINE MANAGEMENT (Requirement 4) */}
      {!loading && activeTab === 'deals' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Commercial Deal Pipeline: {deals.length} Active Contracts
            </span>
            <button
              onClick={() => setShowDealModal(true)}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Deal</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Property</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3 font-mono">Agreed Price</th>
                  <th className="p-3">Target Closing</th>
                  <th className="p-3">Pipeline Stage</th>
                  <th className="p-3 text-right">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{d.property?.title}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{d.dealType} contract</div>
                    </td>
                    <td className="p-3">{d.customer?.name}</td>
                    <td className="p-3">{d.agent?.name}</td>
                    <td className="p-3 font-mono font-semibold tabular-nums text-slate-900">
                      {formatPrice(d.agreedPrice)}
                    </td>
                    <td className="p-3 font-mono">{d.closingDate}</td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                        {d.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={d.stage}
                        onChange={(evt) => handleUpdateDealStage(d._id, evt.target.value)}
                        className="px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-800"
                      >
                        <option value="inquiry">Inquiry</option>
                        <option value="offer_made">Offer Made</option>
                        <option value="under_contract">Under Contract</option>
                        <option value="closed_won">Closed Won</option>
                        <option value="closed_lost">Closed Lost</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PROPERTY MODAL */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">Create New Property Listing</h2>
              <button onClick={() => setShowPropertyModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs mt-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Listing Title</label>
                <input
                  type="text"
                  placeholder="e.g. Pacific Cliffside Modern Haven"
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
                {formErrors.title && <span className="text-rose-600 text-[11px]">{formErrors.title}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    placeholder="1850000"
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 font-mono"
                  />
                  {formErrors.price && <span className="text-rose-600 text-[11px]">{formErrors.price}</span>}
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Property Type</label>
                  <select
                    value={propertyForm.propertyType}
                    onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 bg-white"
                  >
                    <option value="villa">Luxury Villa</option>
                    <option value="apartment">Penthouse / Apartment</option>
                    <option value="house">Single Family House</option>
                    <option value="commercial">Commercial Building</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="124 Marina Blvd"
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Montecito"
                    value={propertyForm.city}
                    onChange={(e) => setPropertyForm({ ...propertyForm, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pincode/ZIP</label>
                  <input
                    type="text"
                    placeholder="93108"
                    value={propertyForm.pincode}
                    onChange={(e) => setPropertyForm({ ...propertyForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Area (Sq Ft)</label>
                  <input
                    type="number"
                    value={propertyForm.areaSqFt}
                    onChange={(e) => setPropertyForm({ ...propertyForm, areaSqFt: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Architectural features, finishes, panoramic views..."
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPropertyModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD DEAL MODAL */}
      {showDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">Record Commercial Deal</h2>
              <button onClick={() => setShowDealModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs mt-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Property</label>
                <select
                  value={dealForm.propertyId}
                  onChange={(e) => {
                    const sel = properties.find((p) => p._id === e.target.value);
                    setDealForm({
                      ...dealForm,
                      propertyId: e.target.value,
                      agreedPrice: sel ? sel.price.toString() : dealForm.agreedPrice,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 bg-white"
                >
                  <option value="">Select property...</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} (${p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Agreed Price ($)</label>
                  <input
                    type="number"
                    value={dealForm.agreedPrice}
                    onChange={(e) => setDealForm({ ...dealForm, agreedPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Closing</label>
                  <input
                    type="date"
                    value={dealForm.closingDate}
                    onChange={(e) => setDealForm({ ...dealForm, closingDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pipeline Stage</label>
                <select
                  value={dealForm.stage}
                  onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 bg-white"
                >
                  <option value="inquiry">Inquiry</option>
                  <option value="offer_made">Offer Made</option>
                  <option value="under_contract">Under Contract</option>
                  <option value="closed_won">Closed Won</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment & Escrow Terms</label>
                <textarea
                  rows={2}
                  value={dealForm.paymentTerms}
                  onChange={(e) => setDealForm({ ...dealForm, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDealModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
