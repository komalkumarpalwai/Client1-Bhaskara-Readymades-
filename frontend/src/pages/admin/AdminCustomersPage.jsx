import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import AdminPagination from '../../components/admin/AdminPagination.jsx';

const AdminCustomersPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // View Lead Modal State
  const [viewLead, setViewLead] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/customers');
        setLeads(res.data?.customers || res.customers || []);
      } catch (err) {
        setError(err.message || 'Failed to load leads from Salesforce.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleOpenView = async (leadId) => {
    setViewLoading(true);
    setViewLead(null);
    try {
      const res = await api.get(`/admin/customers/${leadId}`);
      setViewLead(res.data?.customer || res.customer || null);
    } catch (err) {
      alert('Failed to load lead details from Salesforce: ' + err.message);
    } finally {
      setViewLoading(false);
    }
  };

  // Compute paginated items
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLeads = leads.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-black pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide">Contact Leads</h1>
          <p className="text-xs text-gray-600">Live Customer Leads from Salesforce Org</p>
        </div>
        <div className="text-xs font-mono border border-black px-3 py-1">
          {loading ? 'LOADING...' : `TOTAL: ${leads.length} LEADS`}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-black text-white text-xs font-mono">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs font-mono uppercase tracking-widest text-gray-500">
          Fetching Leads from Salesforce...
        </div>
      ) : leads.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono uppercase tracking-widest text-gray-500 border border-black p-8">
          No leads found in Salesforce Org.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-black overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black text-white font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Lead ID</th>
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono font-bold text-gray-600">{lead.id}</td>
                    <td className="py-3 px-3 font-bold">{lead.name}</td>
                    <td className="py-3 px-3 font-mono">{lead.phone}</td>
                    <td className="py-3 px-3 text-gray-600">{lead.email}</td>
                    <td className="py-3 px-3">{lead.company}</td>
                    <td className="py-3 px-3 font-mono font-bold">{lead.status || lead.sfStatus}</td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{lead.date}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenView(lead.id)}
                        className="border border-black px-2.5 py-1 text-[11px] font-mono uppercase hover:bg-black hover:text-white transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalItems={leads.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* VIEW LEAD MODAL (ALL FIELDS) */}
      {(viewLead || viewLoading) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-black pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Salesforce Lead Record</span>
                <h2 className="text-xl font-bold uppercase">{viewLead?.name || 'Loading Lead Details...'}</h2>
              </div>
              <button
                onClick={() => setViewLead(null)}
                className="border border-black px-2 py-1 text-xs font-mono font-bold hover:bg-black hover:text-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {viewLoading ? (
              <div className="py-8 text-center text-xs font-mono uppercase">Retrieving All Lead Fields from Salesforce...</div>
            ) : viewLead ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4 border border-black p-4 bg-gray-50">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Salesforce Lead ID</span>
                    <span className="font-bold text-sm text-black">{viewLead.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Full Name</span>
                    <span className="font-bold text-sm text-black">{viewLead.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">First Name</span>
                    <span className="font-bold">{viewLead.firstName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Last Name</span>
                    <span className="font-bold">{viewLead.lastName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Title / Designation</span>
                    <span className="font-bold">{viewLead.title || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Company / Account</span>
                    <span className="font-bold">{viewLead.company || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Phone</span>
                    <span className="font-bold">{viewLead.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Mobile Phone</span>
                    <span className="font-bold">{viewLead.mobilePhone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Email</span>
                    <span className="font-bold">{viewLead.email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Lead Source</span>
                    <span className="font-bold">{viewLead.leadSource || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Lead Status</span>
                    <span className="font-bold">{viewLead.status || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Industry</span>
                    <span className="font-bold">{viewLead.industry || '-'}</span>
                  </div>
                </div>

                <div className="border border-black p-4">
                  <span className="text-gray-500 block text-[10px] uppercase mb-1">Address Information</span>
                  <p className="text-gray-800">
                    {[viewLead.street, viewLead.city, viewLead.state, viewLead.postalCode, viewLead.country]
                      .filter(Boolean)
                      .join(', ') || 'No address specified.'}
                  </p>
                </div>

                <div className="border border-black p-4">
                  <span className="text-gray-500 block text-[10px] uppercase mb-1">Description / Notes</span>
                  <p className="text-gray-800 whitespace-pre-wrap">{viewLead.description || 'No description provided.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border border-black p-3 bg-gray-50 text-[11px]">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Created Date</span>
                    <span>{viewLead.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Last Modified Date</span>
                    <span>{viewLead.lastModifiedDate}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
