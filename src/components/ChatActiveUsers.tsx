import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, X, MessageSquare } from 'lucide-react';

interface ChatUser {
  id: string;
  login: string;
  customerName: string;
  userName: string;
  krsNumber: string;
  sessionStart: string;
  lastActivity: string;
}

const mockChatUsers: ChatUser[] = [
  {
    id: '1',
    login: 'jkowalski',
    customerName: 'Orlen',
    userName: 'Jan Kowalski',
    krsNumber: '0000012345',
    sessionStart: '2024-03-15 14:30:22',
    lastActivity: '2024-03-15 14:32:15'
  },
  {
    id: '2',
    login: 'anowak',
    customerName: 'KGHM',
    userName: 'Anna Nowak',
    krsNumber: '0000067890',
    sessionStart: '2024-03-15 14:15:00',
    lastActivity: '2024-03-15 14:31:45'
  }
];

const ChatActiveUsers = () => {
  const [filters, setFilters] = useState({
    login: '',
    customerName: '',
    userName: '',
    userFilter: 'all',
    activeWithin5Min: false
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ChatUser;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [users, setUsers] = useState<ChatUser[]>(mockChatUsers);

  useEffect(() => {
    // Simulated real-time updates
    const interval = setInterval(() => {
      setUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          lastActivity: new Date().toISOString().replace('T', ' ').slice(0, 19)
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      login: '',
      customerName: '',
      userName: '',
      userFilter: 'all',
      activeWithin5Min: false
    });
  };

  const handleSort = (key: keyof ChatUser) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleStartChat = (userId: string) => {
    console.log('Starting chat with user:', userId);
  };

  const getTimeDifference = (timestamp: string) => {
    const now = new Date();
    const activity = new Date(timestamp);
    return Math.floor((now.getTime() - activity.getTime()) / 1000);
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      if (filters.login && !user.login.toLowerCase().includes(filters.login.toLowerCase())) return false;
      if (filters.customerName && !user.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
      if (filters.userName && !user.userName.toLowerCase().includes(filters.userName.toLowerCase())) return false;
      if (filters.activeWithin5Min && getTimeDifference(user.lastActivity) > 300) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span>Chat</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Active Users</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Chat Active Users</h2>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Login */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login
            </label>
            <input
              type="text"
              value={filters.login}
              onChange={(e) => handleFilterChange('login', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Search by login..."
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={filters.customerName}
              onChange={(e) => handleFilterChange('customerName', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Search by customer name..."
            />
          </div>

          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              type="text"
              value={filters.userName}
              onChange={(e) => handleFilterChange('userName', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Search by user name..."
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {/* User Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">User Filter:</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="userFilter"
                  value="all"
                  checked={filters.userFilter === 'all'}
                  onChange={(e) => handleFilterChange('userFilter', e.target.value)}
                />
                <span className="ml-2">All Users</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="userFilter"
                  value="my"
                  checked={filters.userFilter === 'my'}
                  onChange={(e) => handleFilterChange('userFilter', e.target.value)}
                />
                <span className="ml-2">My Users</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="userFilter"
                  value="team"
                  checked={filters.userFilter === 'team'}
                  onChange={(e) => handleFilterChange('userFilter', e.target.value)}
                />
                <span className="ml-2">My Team Users</span>
              </label>
            </div>
          </div>

          {/* Activity Filter */}
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={filters.activeWithin5Min}
                onChange={(e) => handleFilterChange('activeWithin5Min', e.target.checked)}
              />
              <span className="ml-2">Active within last 5 minutes</span>
            </label>
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
            onClick={() => {}}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customerName')}
                >
                  Customer Name
                  {sortConfig?.key === 'customerName' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('userName')}
                >
                  User Name
                  {sortConfig?.key === 'userName' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KRS Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => {
                const timeDiff = getTimeDifference(user.lastActivity);
                const isRecentlyActive = timeDiff <= 300; // 5 minutes

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.krsNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.sessionStart}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          isRecentlyActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm text-gray-500">{user.lastActivity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleStartChat(user.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 ml-auto"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Start Chat</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatActiveUsers;
