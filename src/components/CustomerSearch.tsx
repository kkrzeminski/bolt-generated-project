import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Building2, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Customer, mockCustomers } from '../data/mockData';

function CustomerSearch() {
  const navigate = useNavigate();
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [simpleSearch, setSimpleSearch] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState({
    name: '',
    regon: '',
    nip: '',
    pesel: '',
    status: '',
    branch: '',
    dealer: '',
  });

  const suggestions = useMemo(() => {
    if (!simpleSearch) return [];
    const searchTerm = simpleSearch.toLowerCase();
    
    const companies = mockCustomers
      .filter(c => c.name.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map(c => ({ type: 'company', id: c.id, text: c.name }));
    
    const regons = mockCustomers
      .filter(c => c.regon.includes(searchTerm))
      .slice(0, 2)
      .map(c => ({ type: 'regon', id: c.id, text: c.regon }));
    
    const nips = mockCustomers
      .filter(c => c.nip.includes(searchTerm))
      .slice(0, 2)
      .map(c => ({ type: 'nip', id: c.id, text: c.nip }));
    
    return { companies, regons, nips };
  }, [simpleSearch]);

  const handleSuggestionClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
    setShowAutocomplete(false);
  };

  const filteredCustomers = useMemo(() => {
    if (isAdvancedMode) {
      return mockCustomers.filter(customer => {
        return Object.entries(advancedSearch).every(([key, value]) => {
          if (!value) return true;
          const customerValue = customer[key as keyof Customer]?.toString().toLowerCase();
          return customerValue?.includes(value.toLowerCase());
        });
      });
    }

    if (!simpleSearch) return mockCustomers;
    
    const searchTerm = simpleSearch.toLowerCase();
    return mockCustomers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.regon.includes(searchTerm) ||
      customer.nip.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm)
    );
  }, [simpleSearch, advancedSearch, isAdvancedMode]);

  const handleRowClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Customer Search</h2>
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <span>{isAdvancedMode ? 'Simple Search' : 'Advanced Search'}</span>
            {isAdvancedMode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {!isAdvancedMode ? (
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name, REGON, NIP, or client ID..."
              value={simpleSearch}
              onChange={(e) => {
                setSimpleSearch(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            
            {/* Autocomplete Panel */}
            {showAutocomplete && simpleSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                {suggestions.companies.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center text-xs text-gray-500 px-3 pb-1">
                      <Building2 className="w-3 h-3 mr-1" />
                      Companies
                    </div>
                    {suggestions.companies.map(item => (
                      <div
                        key={item.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleSuggestionClick(item.id)}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                )}
                
                {suggestions.regons.length > 0 && (
                  <div className="p-2 border-t">
                    <div className="flex items-center text-xs text-gray-500 px-3 pb-1">
                      <FileText className="w-3 h-3 mr-1" />
                      REGON
                    </div>
                    {suggestions.regons.map(item => (
                      <div
                        key={item.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleSuggestionClick(item.id)}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                )}
                
                {suggestions.nips.length > 0 && (
                  <div className="p-2 border-t">
                    <div className="flex items-center text-xs text-gray-500 px-3 pb-1">
                      <FileText className="w-3 h-3 mr-1" />
                      NIP
                    </div>
                    {suggestions.nips.map(item => (
                      <div
                        key={item.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleSuggestionClick(item.id)}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {/* Advanced search fields remain unchanged */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={advancedSearch.name}
                onChange={(e) => setAdvancedSearch({ ...advancedSearch, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                REGON
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={advancedSearch.regon}
                onChange={(e) => setAdvancedSearch({ ...advancedSearch, regon: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIP
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={advancedSearch.nip}
                onChange={(e) => setAdvancedSearch({ ...advancedSearch, nip: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PESEL
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={advancedSearch.pesel}
                onChange={(e) => setAdvancedSearch({ ...advancedSearch, pesel: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={advancedSearch.status}
                onChange={(e) => setAdvancedSearch({ ...advancedSearch, status: e.target.value })}
              >
                <option value="">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={advancedSearch.branch}
                onChange={(e) => setAdvancedSearch({ ...advancedSearch, branch: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dealer
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={advancedSearch.dealer}
                onChange={(e) => setAdvancedSearch({ ...advancedSearch, dealer: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dealer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Transaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(customer.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.shortName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        customer.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.dealer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.lastTransaction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerSearch;
