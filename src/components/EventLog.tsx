import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronDown, Code, X, Filter } from 'lucide-react';
import TreeSelect from './TreeSelect';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const actionTypes: TreeNode[] = [
  {
    id: 'user-visit',
    label: 'User Visit',
    children: [
      { id: 'user-visit-enter', label: 'Enter' },
      { id: 'user-visit-exit', label: 'Exit' }
    ]
  },
  {
    id: 'dealer',
    label: 'Dealer',
    children: [
      { id: 'dealer-login', label: 'Login' },
      { id: 'dealer-logout', label: 'Logout' }
    ]
  },
  {
    id: 'transaction',
    label: 'Transaction',
    children: [
      { id: 'transaction-spot', label: 'Spot' },
      { id: 'transaction-forward', label: 'Forward' },
      { id: 'transaction-deposit', label: 'Deposit' }
    ]
  },
  {
    id: 'alert',
    label: 'Alert',
    children: [
      { id: 'alert-create', label: 'Create' },
      { id: 'alert-delete', label: 'Delete' },
      { id: 'alert-activation', label: 'Activation' }
    ]
  },
  {
    id: 'standing-order',
    label: 'Standing Order',
    children: [
      { id: 'standing-order-create', label: 'Create' },
      { id: 'standing-order-delete', label: 'Delete' },
      { id: 'standing-order-execution', label: 'Execution' }
    ]
  },
  {
    id: 'conditional-order',
    label: 'Conditional Order',
    children: [
      { id: 'conditional-order-create', label: 'Create' },
      { id: 'conditional-order-update', label: 'Update' },
      { id: 'conditional-order-delete', label: 'Delete' },
      { id: 'conditional-order-execution', label: 'Execution' }
    ]
  },
  {
    id: 'customer',
    label: 'Customer',
    children: [
      { id: 'customer-create', label: 'Create' },
      { id: 'customer-update', label: 'Update' },
      { id: 'customer-activation', label: 'Activation' },
      { id: 'customer-deactivation', label: 'Deactivation' }
    ]
  },
  {
    id: 'customer-agreement',
    label: 'Customer Agreement',
    children: [
      { id: 'customer-agreement-create', label: 'Create' },
      { id: 'customer-agreement-update', label: 'Update' },
      { id: 'customer-agreement-activation', label: 'Activation' },
      { id: 'customer-agreement-deactivation', label: 'Deactivation' }
    ]
  }
];

interface Event {
  id: string;
  timestamp: string;
  channel: string;
  actor: string;
  actionType: string;
  requestId: string;
  sessionId: string;
  details: any;
}

const mockEvents: Event[] = [
  {
    id: '1',
    timestamp: '2024-03-15 14:30:22',
    channel: 'INTERNET',
    actor: 'John Doe',
    actionType: 'transaction-spot',
    requestId: 'REQ12345',
    sessionId: 'SES67890',
    details: {
      amount: 100000,
      currency: 'EUR/USD',
      rate: 1.0921
    }
  },
  {
    id: '2',
    timestamp: '2024-03-15 14:28:15',
    channel: 'MOBILE',
    actor: 'Jane Smith',
    actionType: 'alert-create',
    requestId: 'REQ12346',
    sessionId: 'SES67891',
    details: {
      currency: 'EUR/PLN',
      targetRate: 4.3500,
      direction: 'above'
    }
  }
];

const EventLog = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [requestId, setRequestId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRow = (eventId: string) => {
    setExpandedRows(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSearch = () => {
    // Implement search logic using all filter criteria
    console.log('Searching with filters:', {
      startDate,
      endDate,
      selectedChannel,
      requestId,
      sessionId,
      selectedActionTypes,
      searchTerm
    });
  };

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return event.actor.toLowerCase().includes(searchLower);
    });
  }, [searchTerm]);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span>Management</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Event Log</span>
      </div>

      {/* Header with Search */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Event Log</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by user or dealer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date/Time
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date/Time
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Channels</option>
              <option value="INTERNET">INTERNET</option>
              <option value="MOBILE">MOBILE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request ID
            </label>
            <input
              type="text"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="8-character alphanumeric"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="8-character alphanumeric"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action Types
          </label>
          <TreeSelect
            nodes={actionTypes}
            selectedItems={selectedActionTypes}
            onSelect={setSelectedActionTypes}
          />
        </div>
        
        {/* New Search Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSearch}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Filter className="w-5 h-5 mr-2" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <React.Fragment key={event.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.channel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.actor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.actionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.requestId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.sessionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleRow(event.id)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <Code className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                  {expandedRows.includes(event.id) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventLog;
