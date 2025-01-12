import React, { useState } from 'react';
import { Search, SlidersHorizontal, Check, X, RefreshCw } from 'lucide-react';

interface CurrencyPairData {
  pair: string;
  enabled: boolean;
  referenceRate: { bid: number; ask: number };
  transactionRate: { bid: number; ask: number };
  marginA: { bid: number; ask: number };
  marginB: { bid: number; ask: number };
  marginC: { bid: number; ask: number };
  bidVolume: number;
  askVolume: number;
}

const initialCurrencyPairs: CurrencyPairData[] = [
  {
    pair: 'EUR/USD',
    enabled: true,
    referenceRate: { bid: 1.0921, ask: 1.0923 },
    transactionRate: { bid: 1.0919, ask: 1.0925 },
    marginA: { bid: 0.0002, ask: 0.0002 },
    marginB: { bid: 0.0003, ask: 0.0003 },
    marginC: { bid: 0.0004, ask: 0.0004 },
    bidVolume: 1234567,
    askVolume: 1111111,
  },
  {
    pair: 'GBP/USD',
    enabled: true,
    referenceRate: { bid: 1.2641, ask: 1.2643 },
    transactionRate: { bid: 1.2639, ask: 1.2645 },
    marginA: { bid: 0.0002, ask: 0.0002 },
    marginB: { bid: 0.0003, ask: 0.0003 },
    marginC: { bid: 0.0004, ask: 0.0004 },
    bidVolume: 654321,
    askVolume: 580246,
  },
  {
    pair: 'USD/JPY',
    enabled: false,
    referenceRate: { bid: 147.81, ask: 147.83 },
    transactionRate: { bid: 147.79, ask: 147.85 },
    marginA: { bid: 0.02, ask: 0.02 },
    marginB: { bid: 0.03, ask: 0.03 },
    marginC: { bid: 0.04, ask: 0.04 },
    bidVolume: 493827,
    askVolume: 493827,
  },
  {
    pair: 'EUR/PLN',
    enabled: true,
    referenceRate: { bid: 4.3215, ask: 4.3217 },
    transactionRate: { bid: 4.3213, ask: 4.3219 },
    marginA: { bid: 0.0002, ask: 0.0002 },
    marginB: { bid: 0.0003, ask: 0.0003 },
    marginC: { bid: 0.0004, ask: 0.0004 },
    bidVolume: 228394,
    askVolume: 228395,
  },
];

function CurrencyPairPanel({ 
  data, 
  onToggle,
  isSelected,
  onSelect 
}: { 
  data: CurrencyPairData; 
  onToggle: (pair: string) => void;
  isSelected: boolean;
  onSelect: (pair: string) => void;
}) {
  const formatNumber = (num: number) => num.toFixed(4);
  const formatVolume = (vol: number) => new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(vol);

  const [base, quote] = data.pair.split('/');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const getCountryCode = (currency: string) => {
    const currencyToCountry: { [key: string]: string } = {
      'EUR': 'eu',
      'USD': 'us',
      'GBP': 'gb',
      'JPY': 'jp',
      'PLN': 'pl',
      'CHF': 'ch',
      'AUD': 'au',
      'CAD': 'ca',
      'NZD': 'nz',
    };
    return currencyToCountry[currency] || 'unknown';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border ${
      isSelected ? 'border-blue-500' : 'border-gray-200'
    } transition-all duration-200`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(data.pair)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <img
                  src={`https://flagcdn.com/24x18/${getCountryCode(base).toLowerCase()}.png`}
                  alt={`${base} flag`}
                  className="h-4 w-5 object-cover rounded-sm"
                />
                <span className="mx-1">/</span>
                <img
                  src={`https://flagcdn.com/24x18/${getCountryCode(quote).toLowerCase()}.png`}
                  alt={`${quote} flag`}
                  className="h-4 w-5 object-cover rounded-sm"
                />
              </div>
              <h3 className="text-lg font-semibold">{data.pair}</h3>
            </div>
          </div>
          <button
            onClick={() => onToggle(data.pair)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              data.enabled
                ? 'bg-emerald-400 focus:ring-emerald-400'
                : 'bg-rose-300 focus:ring-rose-300'
            }`}
            role="switch"
            aria-checked={data.enabled}
          >
            <span
              className={`${
                data.enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <span className={data.enabled ? 'text-emerald-600' : 'text-rose-400'}>
              {data.enabled ? 'Trading Enabled' : 'Trading Disabled'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>Bid Volume: {formatVolume(data.bidVolume)}</div>
            <div>Ask Volume: {formatVolume(data.askVolume)}</div>
          </div>
        </div>
      </div>
      <div className={`transition-opacity duration-200 ${data.enabled ? 'opacity-100' : 'opacity-50'}`}>
        <div className="p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500"></th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Bid</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Ask</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Reference Rate</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.referenceRate.bid)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.referenceRate.ask)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Transaction Rate</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.transactionRate.bid)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.transactionRate.ask)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Margin A</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.marginA.bid)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.marginA.ask)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Margin B</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.marginB.bid)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.marginB.ask)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Margin C</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.marginC.bid)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatNumber(data.marginC.ask)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ManageCurrencyPairs() {
  const [currencyPairs, setCurrencyPairs] = useState(initialCurrencyPairs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [notification, setNotification] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggle = (pair: string) => {
    setCurrencyPairs(prev => prev.map(p => {
      if (p.pair === pair) {
        const newState = !p.enabled;
        showNotification(`${pair} trading has been ${newState ? 'enabled' : 'disabled'}`);
        return { ...p, enabled: newState };
      }
      return p;
    }));
  };

  const handleBulkToggle = (enable: boolean) => {
    if (selectedPairs.length === 0) {
      showNotification('Please select at least one currency pair');
      return;
    }
    
    setCurrencyPairs(prev => prev.map(p => {
      if (selectedPairs.includes(p.pair)) {
        return { ...p, enabled: enable };
      }
      return p;
    }));
    
    showNotification(`${selectedPairs.length} pairs have been ${enable ? 'enabled' : 'disabled'}`);
    setSelectedPairs([]);
  };

  const handleSelect = (pair: string) => {
    setSelectedPairs(prev => 
      prev.includes(pair) 
        ? prev.filter(p => p !== pair)
        : [...prev, pair]
    );
  };

  const handleSelectAll = () => {
    const allPairs = currencyPairs.map(p => p.pair);
    setSelectedPairs(selectedPairs.length === currencyPairs.length ? [] : allPairs);
  };

  const filteredPairs = currencyPairs.filter(pair =>
    pair.pair.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Manage Currency Pairs</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleBulkToggle(true)}
              className="px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-500 flex items-center space-x-2"
              disabled={selectedPairs.length === 0}
            >
              <Check className="w-4 h-4" />
              <span>Enable Selected</span>
            </button>
            <button
              onClick={() => handleBulkToggle(false)}
              className="px-4 py-2 bg-rose-300 text-white rounded-md hover:bg-rose-400 flex items-center space-x-2"
              disabled={selectedPairs.length === 0}
            >
              <X className="w-4 h-4" />
              <span>Disable Selected</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search currency pairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{selectedPairs.length === currencyPairs.length ? 'Deselect All' : 'Select All'}</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-500">
          {notification}
        </div>
      )}

      {/* Currency Pairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPairs.map((pair) => (
          <CurrencyPairPanel 
            key={pair.pair} 
            data={pair} 
            onToggle={handleToggle}
            isSelected={selectedPairs.includes(pair.pair)}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default ManageCurrencyPairs;
