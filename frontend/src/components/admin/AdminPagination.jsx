import React from 'react';

/**
 * Reusable Minimalist Black & White Pagination Component
 */
const AdminPagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, currentPage * pageSize);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-black p-3 bg-gray-50 text-xs font-mono">
      <div className="text-gray-600 uppercase">
        Showing <span className="font-bold text-black">{startIndex}</span> to{' '}
        <span className="font-bold text-black">{endIndex}</span> of{' '}
        <span className="font-bold text-black">{totalItems}</span> records
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1 border border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black uppercase text-[11px] transition"
        >
          « First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1 border border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black uppercase text-[11px] transition"
        >
          ‹ Prev
        </button>

        <span className="px-3 py-1 border border-black bg-black text-white font-bold text-[11px]">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 border border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black uppercase text-[11px] transition"
        >
          Next ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 border border-black bg-white hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black uppercase text-[11px] transition"
        >
          Last »
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
