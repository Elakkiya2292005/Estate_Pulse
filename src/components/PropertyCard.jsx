import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Eye } from 'lucide-react';

export default function PropertyCard({ property }) {
  const [imageError, setImageError] = useState(false);

  const fallbackImage = '/src/assets/images/hero_modern_villa_1794056675259.jpg';
  const displayImage = imageError || !property.images?.[0] ? fallbackImage : property.images[0];

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const statusColors = {
    available: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    under_offer: 'text-amber-700 bg-amber-50 border-amber-200',
    sold: 'text-slate-700 bg-slate-100 border-slate-200',
    rented: 'text-sky-700 bg-sky-50 border-sky-200',
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-all duration-200 hover:shadow-sm">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Status Indicator */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
              statusColors[property.status] || 'text-slate-700 bg-slate-100 border-slate-200'
            }`}
          >
            {property.status?.replace('_', ' ')}
          </span>
        </div>

        {/* Property Type Indicator */}
        <div className="absolute top-3 right-3">
          <span className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-white">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price with Tabular Numerals */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatPrice(property.price)}
            </span>
            {property.agent?.name && (
              <span className="text-xs text-slate-500 truncate max-w-[140px]">
                Agent: {property.agent.name.split(' ')[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-base line-clamp-1 group-hover:text-amber-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">
              {property.location.address}, {property.location.city}
            </span>
          </div>

          {/* Zero-Pill Unboxed Metadata Spec Row */}
          <div className="flex items-center gap-2 text-xs text-slate-600 py-2.5 border-t border-slate-100">
            {property.features.bedrooms > 0 && (
              <>
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono tabular-nums">{property.features.bedrooms}</span>
                  <span className="text-slate-400 text-[11px]">Beds</span>
                </div>
                <span aria-hidden="true" className="text-slate-300">·</span>
              </>
            )}

            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono tabular-nums">{property.features.bathrooms}</span>
              <span className="text-slate-400 text-[11px]">Baths</span>
            </div>

            <span aria-hidden="true" className="text-slate-300">·</span>

            <div className="flex items-center gap-1">
              <Square className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono tabular-nums">{property.features.areaSqFt?.toLocaleString()}</span>
              <span className="text-slate-400 text-[11px]">sq ft</span>
            </div>
          </div>
        </div>

        {/* View Details Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 capitalize">
            {property.features.furnished}
          </span>
          <Link
            to={`/properties/${property._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>View Details</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
