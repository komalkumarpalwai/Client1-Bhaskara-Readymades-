import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Reusable Storefront Pagination Component
 */
const StorefrontPagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 12,
  onPageChange
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, currentPage * pageSize);

  if (totalItems <= pageSize) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 text-xs font-semibold text-slate-600">
      <div className="font-mono">
        Showing <span className="font-bold text-slate-900">{startIndex}</span> to{' '}
        <span className="font-bold text-slate-900">{endIndex}</span> of{' '}
        <span className="font-bold text-slate-900">{totalItems}</span> garments
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => {
            onPageChange(1);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page indicator pill */}
        <div className="px-4 py-2 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold shadow-sm">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onPageChange(totalPages);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StorefrontPagination;
