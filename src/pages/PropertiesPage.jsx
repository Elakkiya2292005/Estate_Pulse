import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard.jsx';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/FeedbackState.jsx';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Data & Feedback states
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 9 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with search params changes
  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const queryString = searchParams.toString();
      const res = await fetch(`/api/properties?${queryString}`);
      const data = await res.json();

      if (data.success) {
        setProperties(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Network connection error while fetching listings.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set('search', search.trim());
    if (propertyType !== 'all') params.set('propertyType', propertyType);
    if (status !== 'all') params.set('status', status);
    if (city !== 'all') params.set('city', city);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    params.set('page', '1');

    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setPropertyType('all');
    setStatus('all');
    setCity('all');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSortBy('newest');
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Header and Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Real Estate Portfolio</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified listings, search by specifications, and request immediate walkthroughs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                const params = new URLSearchParams(searchParams);
                params.set('sortBy', e.target.value);
                setSearchParams(params);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="area_desc">Largest Area (Sq Ft)</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Controlled Filter Sidebar */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } md:block md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Search & Filter</span>
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={applyFilters} className="space-y-4 text-xs">
            {/* Search Input */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ocean, Penthouse, Oak"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 pl-8 border border-slate-300 rounded-lg outline-none focus:border-slate-900 text-slate-800"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-slate-900 text-slate-800 cursor-pointer bg-white"
              >
                <option value="all">All Types</option>
                <option value="villa">Luxury Villa</option>
                <option value="apartment">Penthouse / Apartment</option>
                <option value="house">Single Family House</option>
                <option value="commercial">Commercial Building</option>
              </select>
            </div>

            {/* Listing Status */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-slate-900 text-slate-800 cursor-pointer bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="under_offer">Under Offer</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">City / Region</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-slate-900 text-slate-800 cursor-pointer bg-white"
              >
                <option value="all">All Locations</option>
                <option value="Montecito">Montecito</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Pasadena">Pasadena</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="San Diego">San Diego</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono"
                />
              </div>
            </div>

            {/* Minimum Bedrooms */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Minimum Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-slate-900 text-slate-800 cursor-pointer bg-white"
              >
                <option value="">Any Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Listings Grid Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Active Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-mono tabular-nums">{properties.length}</strong> of{' '}
              <strong className="text-slate-900 font-mono tabular-nums">{pagination.total}</strong> properties
            </span>
          </div>

          {/* Feedback: Loading State */}
          {loading && <LoadingSkeleton count={6} />}

          {/* Feedback: Error State */}
          {!loading && error && <ErrorState message={error} onRetry={fetchProperties} />}

          {/* Feedback: Empty State */}
          {!loading && !error && properties.length === 0 && (
            <EmptyState
              title="No properties match your filters"
              description="Try adjusting your price range, location, or property category to see more listings."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}

          {/* Feedback: Populated State */}
          {!loading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-2 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold font-mono tabular-nums transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-2 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
