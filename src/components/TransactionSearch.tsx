import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Download, X, FileText } from 'lucide-react';
import { exportTransactionsToPDF } from '../utils/pdfExport';

interface Transaction {
  id: string;
  date: string;
  currencyPair: string;
  type: string;
  amount: number;
  status: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TX001',
    date: '2024-03-15 14:30:22',
    currencyPair: 'EUR/PLN',
    type: 'Spot',
    amount: 1250000.00,
    status: 'Executed'
  },
  {
    id: 'TX002',
    date: '2024-03-15 11:20:15',
    type: 'Forward',
    currencyPair: 'USD/PLN',
    amount: 750000.00,
    status: 'Settled'
  },
  {
    id: 'TX003',
    date: '2024-03-15 09:45:33',
    currencyPair: 'EUR/PLN',
    type: 'Spot',
    amount: 500000.00,
    status: 'Executed'
  },
  {
    id: 'TX004',
    date: '2024-03-14 16:15:42',
    currencyPair: 'CHF/PLN',
    type: 'Order',
    amount: 300000.00,
    status: 'Pending'
  },
  {
    id: 'TX005',
    date: '2024-03-14 15:20:18',
    currencyPair: 'GBP/PLN',
    type: 'Spot',
    amount: 425000.00,
    status: 'Executed'
  }
];

const TRANSACTION_TYPES = ['Spot', 'Order', 'Forward', 'Other'];
const TRANSACTION_STATUSES = ['Pending', 'Executed', 'Settled'];
const CURRENCY_PAIRS = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'GBP/PLN'];

const TransactionSearch = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    transactionId: '',
    amountFrom: '',
    amountTo: '',
    type: '',
    status: '',
    currencyPair: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      transactionId: '',
      amountFrom: '',
      amountTo: '',
      type: '',
      status: '',
      currencyPair: ''
    });
  };

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...mockTransactions];

    if (filters.transactionId) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(filters.transactionId.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    if (filters.currencyPair) {
      filtered = filtered.filter(tx => tx.currencyPair === filters.currencyPair);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(tx => tx.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(tx => tx.date <= filters.dateTo);
    }

    if (filters.amountFrom) {
      filtered = filtered.filter(tx => tx.amount >= Number(filters.amountFrom));
    }

    if (filters.amountTo) {
      filtered = filtered.filter(tx => tx.amount <= Number(filters.amountTo));
    }

    return filtered;
  }, [filters]);

  const handleExportPDF = () => {
    exportTransactionsToPDF(filteredAndSortedTransactions, filters);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span>Transactions</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Transaction Search</span>
      </div>

      {/* Header with Export Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transaction Search</h2>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Export to PDF</span>
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              value={filters.transactionId}
              onChange={(e) => handleFilterChange('transactionId', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Transaction ID"
            />
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.amountFrom}
                onChange={(e) => handleFilterChange('amountFrom', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Min Amount"
              />
              <input
                type="number"
                value={filters.amountTo}
                onChange={(e) => handleFilterChange('amountTo', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Max Amount"
              />
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {TRANSACTION_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Transaction Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {TRANSACTION_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Currency Pair */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Pair
            </label>
            <select
              value={filters.currencyPair}
              onChange={(e) => handleFilterChange('currencyPair', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {CURRENCY_PAIRS.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency Pair
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.currencyPair}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {transaction.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${transaction.status === 'Executed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleExportPDF()}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 ml-auto"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionSearch;
