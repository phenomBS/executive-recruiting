import React, { useState } from 'react';
import { X, Search, ShieldAlert, Calendar, Building, Plus } from 'lucide-react';
import { useRestricted } from '../context/RestrictedContext';

const MOCK_GLOBAL_COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Netflix', 'Tesla', 'Oracle', 'IBM', 'Intel', 
  'Adobe', 'Salesforce', 'Cisco', 'Broadcom', 'Qualcomm', 'AMD', 'Apple', 'NVIDIA'
];

interface Props {
  onClose: () => void;
}

export function RestrictedCompaniesModal({ onClose }: Props) {
  const { restrictedCompanies, addRestrictedCompany, removeRestrictedCompany } = useRestricted();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [reason, setReason] = useState('');

  const filteredCompanies = MOCK_GLOBAL_COMPANIES.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !restrictedCompanies.find(rc => rc.name === c)
  );

  const handleAdd = () => {
    if (selectedCompany && reason.trim()) {
      addRestrictedCompany({
        name: selectedCompany,
        reason: reason.trim(),
        dateAdded: new Date().toISOString().split('T')[0]
      });
      setSelectedCompany('');
      setSearchTerm('');
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Restricted Companies</h2>
              <p className="text-sm text-slate-500">Manage 'Do Not Contact' or off-limits companies</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Add New Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Add Company to Restricted List</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Company</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search global companies..." 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedCompany('');
                    }}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {searchTerm && !selectedCompany && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map(c => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCompany(c);
                            setSearchTerm(c);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <Building className="w-4 h-4 text-slate-400" />
                          {c}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-slate-500 text-center">No matching companies found.</div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Reason for Restriction</label>
                <input 
                  type="text"
                  placeholder="e.g. Active Client - 12 month block"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button 
              onClick={handleAdd}
              disabled={!selectedCompany || !reason.trim()}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> Restrict Company
            </button>
          </div>

          {/* Current List */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              Current Restricted List 
              <span className="bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full border border-slate-200">{restrictedCompanies.length} Total</span>
            </h3>
            
            {restrictedCompanies.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm">
                No companies are currently restricted.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Date Added</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {restrictedCompanies.map(company => (
                      <tr key={company.name} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-800 flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400" /> {company.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{company.reason}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {company.dateAdded}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => removeRestrictedCompany(company.name)}
                            className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 shrink-0 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
