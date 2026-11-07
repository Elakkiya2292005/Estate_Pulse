import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Send,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Building,
  Car,
  Home,
} from 'lucide-react';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated, token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Controlled Enquiry Form State & Validation
  const [enquiryForm, setEnquiryForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [enquiryErrors, setEnquiryErrors] = useState({});
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Controlled Visit Scheduling Form State & Validation
  const [visitForm, setVisitForm] = useState({
    visitDate: '',
    visitTimeSlot: '11:00 AM - 12:00 PM',
    notes: '',
  });
  const [visitErrors, setVisitErrors] = useState({});
  const [visitSubmitting, setVisitSubmitting] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProperty(data.data);
          setSelectedImage(data.data.images?.[0] || '/src/assets/images/hero_modern_villa_1794056675259.jpg');
        } else {
          setError(data.message || 'Property not found');
        }
      } catch (e) {
        setError('Error loading property details');
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  useEffect(() => {
    if (user) {
      setEnquiryForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Client-side Validation and Submission for Enquiry
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!enquiryForm.name.trim()) errors.name = 'Full name is required';
    if (!enquiryForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!enquiryForm.phone.trim() || enquiryForm.phone.trim().length < 7) {
      errors.phone = 'Valid phone number is required';
    }
    if (!enquiryForm.message.trim() || enquiryForm.message.trim().length < 5) {
      errors.message = 'Please provide a message (minimum 5 characters)';
    }

    setEnquiryErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setEnquirySubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: id,
          customerId: user?._id || 'usr-cust-1',
          customerName: enquiryForm.name,
          customerEmail: enquiryForm.email,
          customerPhone: enquiryForm.phone,
          message: enquiryForm.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEnquirySuccess(true);
        toast.success('Your enquiry has been delivered to the assigned agent!');
        setEnquiryForm((prev) => ({ ...prev, message: '' }));
      } else {
        toast.error(data.message || 'Failed to submit enquiry');
      }
    } catch (err) {
      toast.error('Network error submitting enquiry');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  // Client-side Validation and Submission for Visit Scheduling
  const handleVisitSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please sign in or select a demo customer to book a walkthrough');
      navigate('/login');
      return;
    }

    const errors = {};
    if (!visitForm.visitDate) errors.visitDate = 'Please select a preferred date';
    if (!visitForm.visitTimeSlot) errors.visitTimeSlot = 'Please select a time slot';

    setVisitErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setVisitSubmitting(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: id,
          visitDate: visitForm.visitDate,
          visitTimeSlot: visitForm.visitTimeSlot,
          notes: visitForm.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVisitSuccess(true);
        toast.success('Property walkthrough booked! Agent notified.');
      } else {
        toast.error(data.message || 'Could not schedule visit');
      }
    } catch (err) {
      toast.error('Network error scheduling visit');
    } finally {
      setVisitSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">{error || 'This listing does not exist or has been removed.'}</p>
        <Link
          to="/properties"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>
    );
  }

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Back Link & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {property._id}</span>
      </div>

      {/* Main Split: Left Gallery & Overview, Right Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Gallery, Specs, Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Photo */}
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={selectedImage || property.images?.[0]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {property.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-amber-600 ring-2 ring-amber-500/20' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Header Info & Price */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                  {property.propertyType}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.pincode}
                  </span>
                </div>
              </div>

              <div className="text-right sm:self-start">
                <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  {formatPrice(property.price)}
                </div>
                <div className="text-xs text-emerald-700 capitalize font-medium mt-0.5">
                  Status: {property.status?.replace('_', ' ')}
                </div>
              </div>
            </div>

            {/* Architectural Specifications Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                    {property.features.bedrooms}
                  </div>
                  <div className="text-[11px] text-slate-500">Bedrooms</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                    {property.features.bathrooms}
                  </div>
                  <div className="text-[11px] text-slate-500">Bathrooms</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Square className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                    {property.features.areaSqFt?.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">Square Feet</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {property.features.parking ? 'Yes' : 'No'}
                  </div>
                  <div className="text-[11px] text-slate-500">Private Parking</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Property Description</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities & Features */}
            {property.features.amenities?.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Key Features & Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.features.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Agent Contact, Enquiry Form, Visit Scheduler */}
        <div className="space-y-6">
          {/* Assigned Agent Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assigned Listing Specialist
            </span>
            <div className="flex items-center gap-3">
              <img
                src={property.agent?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'}
                alt={property.agent?.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-semibold text-sm text-slate-900">{property.agent?.name || 'Assigned Broker'}</h4>
                <p className="text-xs text-slate-500">{property.agent?.title || 'Licensed Real Estate Agent'}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{property.agent?.phone || '+1 (555) 234-5678'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{property.agent?.email || 'agent@estatepulse.com'}</span>
              </div>
            </div>
          </div>

          {/* Schedule Private Walkthrough Form (Controlled Form) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Calendar className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-sm">Schedule a Private Walkthrough</h3>
            </div>

            {visitSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-semibold">Showing Successfully Booked!</div>
                <p className="text-[11px] text-emerald-700">
                  Appointment confirmed for {visitForm.visitDate} ({visitForm.visitTimeSlot}). View under Customer Dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => setVisitSuccess(false)}
                  className="mt-2 text-xs font-semibold text-emerald-900 underline"
                >
                  Book another slot
                </button>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={visitForm.visitDate}
                    onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg outline-none text-slate-800 ${
                      visitErrors.visitDate ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {visitErrors.visitDate && (
                    <span className="text-rose-600 text-[11px] mt-0.5 block">{visitErrors.visitDate}</span>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={visitForm.visitTimeSlot}
                    onChange={(e) => setVisitForm({ ...visitForm, visitTimeSlot: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-slate-800 bg-white"
                  >
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM (Twilight)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Notes / Preferences</label>
                  <textarea
                    rows={2}
                    placeholder="Specific questions for agent during showing..."
                    value={visitForm.notes}
                    onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={visitSubmitting}
                  className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{visitSubmitting ? 'Confirming...' : 'Request Appointment'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Send Enquiry Form (Controlled Form) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Send className="w-4 h-4 text-sky-600" />
              <h3 className="font-semibold text-sm">Submit Property Enquiry</h3>
            </div>

            {enquirySuccess ? (
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-sky-600 mx-auto mb-1" />
                <div className="font-semibold">Enquiry Delivered!</div>
                <p className="text-[11px] text-sky-700">The agent will contact you via email or phone within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => setEnquirySuccess(false)}
                  className="mt-2 text-xs font-semibold text-sky-900 underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg outline-none text-slate-800 ${
                      enquiryErrors.name ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {enquiryErrors.name && (
                    <span className="text-rose-600 text-[11px] mt-0.5 block">{enquiryErrors.name}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg outline-none text-slate-800 ${
                        enquiryErrors.email ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {enquiryErrors.email && (
                      <span className="text-rose-600 text-[11px] mt-0.5 block">{enquiryErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg outline-none text-slate-800 ${
                        enquiryErrors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {enquiryErrors.phone && (
                      <span className="text-rose-600 text-[11px] mt-0.5 block">{enquiryErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Your Message</label>
                  <textarea
                    rows={3}
                    placeholder="Ask about floor plans, HOA fees, valuation, or financing options..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg outline-none text-slate-800 ${
                      enquiryErrors.message ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {enquiryErrors.message && (
                    <span className="text-rose-600 text-[11px] mt-0.5 block">{enquiryErrors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{enquirySubmitting ? 'Sending...' : 'Send Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
