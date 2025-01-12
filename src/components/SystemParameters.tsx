import React, { useState } from 'react';
import { Search, ChevronRight, Save, X, Check } from 'lucide-react';

type ParameterType = 'string' | 'enum' | 'number' | 'amount' | 'date' | 'time' | 'boolean';

interface Parameter {
  name: string;
  type: ParameterType;
  value: string;
  description: string;
  options?: string[]; // For enum type
}

const initialBusinessParameters: Parameter[] = [
  {
    name: 'ONLINE_BEGIN',
    type: 'time',
    value: '08:00',
    description: 'System daily operation start time'
  },
  {
    name: 'ONLINE_END',
    type: 'time',
    value: '20:00',
    description: 'System daily operation end time'
  },
  {
    name: 'CHANNEL_MOBILE_ENABLED',
    type: 'boolean',
    value: 'true',
    description: 'Mobile channel availability flag'
  },
  {
    name: 'CHANNEL_INTERNET_ENABLED',
    type: 'boolean',
    value: 'true',
    description: 'Internet channel availability flag'
  },
  {
    name: 'LOCKED_CURRENCIES',
    type: 'string',
    value: 'VND,IDR,THB',
    description: 'Comma-separated list of restricted currencies'
  }
];

const initialTechnicalParameters: Parameter[] = [
  {
    name: 'MINIMUM_TRANSACTION_AMOUNT',
    type: 'amount',
    value: '1000.00',
    description: 'Lower transaction limit'
  },
  {
    name: 'MAXIMUM_TRANSACTION_AMOUNT',
    type: 'amount',
    value: '1000000.00',
    description: 'Upper transaction limit'
  },
  {
    name: 'CORE_BANKING_ONLINE_BEGIN',
    type: 'time',
    value: '07:00',
    description: 'Core banking system availability start'
  },
  {
    name: 'CORE_BANKING_ONLINE_END',
    type: 'time',
    value: '22:00',
    description: 'Core banking system availability end'
  },
  {
    name: 'RATE_PROVIDER',
    type: 'enum',
    value: 'reuters',
    description: 'Exchange rate data source',
    options: ['reuters', 'xe', 'oanda', 'transfer wise']
  },
  {
    name: 'NBP_TABLE_DOWNLOAD_TIME',
    type: 'time',
    value: '16:15',
    description: 'National Bank rate table update schedule'
  }
];

interface ParameterPanelProps {
  title: string;
  parameters: Parameter[];
  searchTerm: string;
  onUpdate: (name: string, value: string) => void;
}

function ParameterPanel({ title, parameters, searchTerm, onUpdate }: ParameterPanelProps) {
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateValue = (value: string, type: ParameterType, options?: string[]): boolean => {
    switch (type) {
      case 'time':
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
      case 'amount':
        return /^\d+(\.\d{0,2})?$/.test(value);
      case 'number':
        return !isNaN(Number(value));
      case 'boolean':
        return value === 'true' || value === 'false';
      case 'enum':
        return options?.includes(value) || false;
      default:
        return true;
    }
  };

  const handleEdit = (param: Parameter) => {
    setEditingParam(param.name);
    setEditValue(param.value);
    setError(null);
  };

  const handleSave = (param: Parameter) => {
    if (validateValue(editValue, param.type, param.options)) {
      onUpdate(param.name, editValue);
      setEditingParam(null);
      setError(null);
    } else {
      setError('Invalid value for this parameter type');
    }
  };

  const handleCancel = () => {
    setEditingParam(null);
    setError(null);
  };

  const filteredParameters = parameters.filter(param =>
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderValue = (param: Parameter) => {
    if (editingParam === param.name) {
      switch (param.type) {
        case 'boolean':
          return (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-32 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          );
        case 'enum':
          return (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-32 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
            >
              {param.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        case 'time':
          return (
            <input
              type="time"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-32 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
            />
          );
        default:
          return (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
            />
          );
      }
    }

    switch (param.type) {
      case 'boolean':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${param.value === 'true' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {param.value}
          </span>
        );
      case 'amount':
        return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(Number(param.value));
      default:
        return param.value;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParameters.map((param) => (
              <tr key={param.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {param.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {param.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderValue(param)}
                  {error && editingParam === param.name && (
                    <p className="text-xs text-rose-500 mt-1">{error}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {param.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingParam === param.name ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(param)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(param)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemParameters() {
  const [businessParams, setBusinessParams] = useState(initialBusinessParameters);
  const [technicalParams, setTechnicalParams] = useState(initialTechnicalParameters);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleUpdateBusinessParam = (name: string, value: string) => {
    setBusinessParams(prev => prev.map(p => 
      p.name === name ? { ...p, value } : p
    ));
    showNotification(`Business parameter ${name} updated successfully`);
  };

  const handleUpdateTechnicalParam = (name: string, value: string) => {
    setTechnicalParams(prev => prev.map(p => 
      p.name === name ? { ...p, value } : p
    ));
    showNotification(`Technical parameter ${name} updated successfully`);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span>Management</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">System Parameters</span>
      </div>

      {/* Header and Search */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">System Parameters</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-500">
          {notification}
        </div>
      )}

      {/* Parameter Panels */}
      <ParameterPanel
        title="Business Parameters"
        parameters={businessParams}
        searchTerm={searchTerm}
        onUpdate={handleUpdateBusinessParam}
      />
      <ParameterPanel
        title="Technical Parameters"
        parameters={technicalParams}
        searchTerm={searchTerm}
        onUpdate={handleUpdateTechnicalParam}
      />
    </div>
  );
}

export default SystemParameters;
