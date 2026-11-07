import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="aspect-[16/10] bg-slate-200"></div>
          <div className="p-5 space-y-3">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            <div className="pt-3 border-t border-slate-100 flex gap-4">
              <div className="h-3 bg-slate-200 rounded w-16"></div>
              <div className="h-3 bg-slate-200 rounded w-16"></div>
              <div className="h-3 bg-slate-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title = 'No records found', description = 'There are no items matching your criteria.', actionLabel, onAction }) {
  return (
    <div className="text-center py-16 px-4 border border-dashed border-slate-300 rounded-2xl bg-white/50">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message = 'An error occurred while fetching data.', onRetry }) {
  return (
    <div className="p-6 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-900 text-center my-6">
      <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
      <h4 className="font-semibold text-sm">Failed to load content</h4>
      <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
