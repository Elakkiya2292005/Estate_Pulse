import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Calendar, Key, Sparkles, Building, MapPin } from 'lucide-react';
import PropertyCard from '../components/PropertyCard.jsx';
import { LoadingSkeleton } from '../components/FeedbackState.jsx';

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/properties/featured');
        const data = await res.json();
        if (data.success) {
          setFeaturedProperties(data.data);
        }
      } catch (e) {
        console.error('Error loading featured listings', e);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity.trim()) params.set('city', searchCity.trim());
    if (searchType !== 'all') params.set('propertyType', searchType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/src/assets/images/hero_modern_villa_1794056675259.jpg"
            alt="Luxury Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28 flex flex-col justify-center">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation MERN Real Estate Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
              Find Exceptional Properties with Complete Pipeline Transparency
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Connect buyers, certified agents, and brokers in one unified ecosystem. Schedule private walkthroughs, track verified enquiries, and manage closing stages seamlessly.
            </p>

            {/* Controlled Search Strip */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col sm:flex-row gap-2 max-w-2xl text-slate-900"
            >
              <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City or location (e.g. Montecito, San Francisco)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="text-xs sm:text-sm bg-transparent outline-none text-slate-800 cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Penthouse / Apt</option>
                  <option value="house">Single Family</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs sm:text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* KPI & Metrics Bar with Tabular Numerals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">$14.2M+</div>
            <div className="text-xs text-slate-500 mt-0.5">Active Transaction Value</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">98.4%</div>
            <div className="text-xs text-slate-500 mt-0.5">Scheduled Visit Completion</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">24 hrs</div>
            <div className="text-xs text-slate-500 mt-0.5">Average Agent Response</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">MERN Architecture Compliance</div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Hand-Curated Portfolio</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Premier Properties</h2>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Core Workflow (Requirement 3 from Project Scope) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Complete Lifecycle Management</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Engineered for Every Stage of the Real Estate Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-white">1. Discover & Filter</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Filter by price brackets, architectural style, bedrooms, and location coordinates with instantaneous client-side responsiveness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-white">2. Schedule Private Visits</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Book walkthrough slots directly with assigned licensed agents. Receive calendar confirmations and post-visit walk reports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-white">3. Track Commercial Deals</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Follow transactions from initial offer submission to under-contract and closed escrow with audited role access.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
