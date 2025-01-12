import React, { useState, useRef } from 'react';
import { ChevronRight, ArrowUp, ArrowDown, Split, Save, RotateCcw, Download, Upload } from 'lucide-react';

interface MarginValue {
  bid: number;
  offer: number;
}

interface MarginRange {
  id: string;
  from: number;
  to: number;
  groupA: MarginValue;
  groupB: MarginValue;
  groupC: MarginValue;
}

interface PeriodData {
  ranges: MarginRange[];
}

interface CurrencyPairData {
  periods: {
    [key: string]: PeriodData;
  };
}

interface MarginData {
  [key: string]: CurrencyPairData;
}

const CURRENCY_PAIRS = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'GBP/PLN'];
const PERIODS = ['SPOT', 'SN', 'SW', '2W', '3W', '1M', '2M', '3M', '6M', '9M', '1Y'];
const MAX_AMOUNT = 100_000_000;

const createInitialRange = (from: number, to: number): MarginRange => ({
  id: crypto.randomUUID(),
  from,
  to,
  groupA: { bid: 0.0002, offer: 0.0002 },
  groupB: { bid: 0.0003, offer: 0.0003 },
  groupC: { bid: 0.0004, offer: 0.0004 }
});

const createInitialRanges = (): MarginRange[] => [
  createInitialRange(0, 10_000),
  createInitialRange(10_000, 100_000),
  createInitialRange(100_000, 1_000_000),
  createInitialRange(1_000_000, 10_000_000),
  createInitialRange(10_000_000, 100_000_000)
];

const createInitialMarginData = (): MarginData => {
  const data: MarginData = {};
  CURRENCY_PAIRS.forEach(pair => {
    data[pair] = {
      periods: {}
    };
    PERIODS.forEach(period => {
      data[pair].periods[period] = {
        ranges: createInitialRanges()
      };
    });
  });
  return data;
};

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const MarginGroups = () => {
  const [selectedPair, setSelectedPair] = useState(CURRENCY_PAIRS[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
  const [marginData, setMarginData] = useState<MarginData>(createInitialMarginData());
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRangeChange = (id: string, field: 'from' | 'to', value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    setMarginData(prev => ({
      ...prev,
      [selectedPair]: {
        ...prev[selectedPair],
        periods: {
          ...prev[selectedPair].periods,
          [selectedPeriod]: {
            ranges: prev[selectedPair].periods[selectedPeriod].ranges.map(range =>
              range.id === id ? { ...range, [field]: numValue } : range
            )
          }
        }
      }
    }));
    setHasChanges(true);
  };

  const handleMarginChange = (id: string, group: string, field: 'bid' | 'offer', value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    setMarginData(prev => ({
      ...prev,
      [selectedPair]: {
        ...prev[selectedPair],
        periods: {
          ...prev[selectedPair].periods,
          [selectedPeriod]: {
            ranges: prev[selectedPair].periods[selectedPeriod].ranges.map(range =>
              range.id === id ? {
                ...range,
                [group]: { ...range[group as keyof MarginRange], [field]: numValue }
              } : range
            )
          }
        }
      }
    }));
    setHasChanges(true);
  };

  const handleExport = () => {
    const data = {
      currencyPair: selectedPair,
      period: selectedPeriod,
      ranges: marginData[selectedPair].periods[selectedPeriod].ranges
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `margin-groups-${selectedPair}-${selectedPeriod}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.ranges || !Array.isArray(data.ranges)) {
          throw new Error('Invalid data format');
        }

        for (const range of data.ranges) {
          if (!range.from || !range.to || !range.groupA || !range.groupB || !range.groupC) {
            throw new Error('Invalid range format');
          }
        }

        setMarginData(prev => ({
          ...prev,
          [selectedPair]: {
            ...prev[selectedPair],
            periods: {
              ...prev[selectedPair].periods,
              [selectedPeriod]: {
                ranges: data.ranges
              }
            }
          }
        }));
        setHasChanges(true);
      } catch (error) {
        alert('Error importing file. Please ensure the file format is correct.');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    // Here you would typically save to a backend
    setHasChanges(false);
    alert('Changes saved successfully');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      setMarginData(createInitialMarginData());
      setHasChanges(false);
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span>Management</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Margin Groups</span>
      </div>

      {/* Header with Import/Export */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Margin Groups</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json,.csv"
              className="hidden"
            />
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Currency Pair Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {CURRENCY_PAIRS.map(pair => (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                className={`py-4 px-1 border-b-2 font-medium text-sm
                  ${selectedPair === pair
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {pair}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {PERIODS.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`py-4 px-1 border-b-2 font-medium text-sm
                  ${selectedPeriod === period
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {period}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Margin Table */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Range
                </th>
                <th colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group A
                </th>
                <th colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group B
                </th>
                <th colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group C
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bid</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bid</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bid</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marginData[selectedPair].periods[selectedPeriod].ranges.map((range, index) => (
                <tr key={range.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={range.from}
                        onChange={(e) => handleRangeChange(range.id, 'from', e.target.value)}
                        className="w-32 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-right"
                        min="0"
                        max={MAX_AMOUNT}
                      />
                      <span className="text-sm text-gray-500 w-24 text-right">{formatAmount(range.from)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={range.to}
                        onChange={(e) => handleRangeChange(range.id, 'to', e.target.value)}
                        className="w-32 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-right"
                        min="0"
                        max={MAX_AMOUNT}
                      />
                      <span className="text-sm text-gray-500 w-24 text-right">{formatAmount(range.to)}</span>
                    </div>
                  </td>
                  {['groupA', 'groupB', 'groupC'].map((group) => (
                    <React.Fragment key={group}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={range[group as keyof MarginRange].bid}
                          onChange={(e) => handleMarginChange(range.id, group, 'bid', e.target.value)}
                          className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-right"
                          step="0.0001"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={range[group as keyof MarginRange].offer}
                          onChange={(e) => handleMarginChange(range.id, group, 'offer', e.target.value)}
                          className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-right"
                          step="0.0001"
                        />
                      </td>
                    </React.Fragment>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="Move Up"
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="Move Down"
                      disabled={index === marginData[selectedPair].periods[selectedPeriod].ranges.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="Split Range"
                    >
                      <Split className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleReset}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-md flex items-center space-x-2
            ${hasChanges
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
            }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-md flex items-center space-x-2
            ${hasChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default MarginGroups;
