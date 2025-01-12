import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Search, X } from 'lucide-react';

interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'BLOCKED';
  blockedDate?: string;
  lastTransaction: string;
  lastLogin: string;
  roles: string[];
}

const mockUsers: User[] = [
  {
    id: '1',
    login: 'jsmith',
    firstName: 'John',
    lastName: 'Smith',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 14:30:22',
    lastLogin: '2024-03-15 09:15:30',
    roles: ['Senior Dealer', 'Main Dealer']
  },
  {
    id: '2',
    login: 'akowalski',
    firstName: 'Anna',
    lastName: 'Kowalski',
    status: 'BLOCKED',
    blockedDate: '2024-03-10 11:20:15',
    lastTransaction: '2024-03-09 16:45:33',
    lastLogin: '2024-03-09 08:30:45',
    roles: ['Dealer']
  },
  {
    id: '3',
    login: 'mnowak',
    firstName: 'Marek',
    lastName: 'Nowak',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 10:25:18',
    lastLogin: '2024-03-15 08:15:22',
    roles: ['Admin', 'Main Dealer']
  },
  {
    id: '4',
    login: 'kwojcik',
    firstName: 'Katarzyna',
    lastName: 'Wójcik',
    status: 'ACTIVE',
    lastTransaction: '2024-03-14 15:40:55',
    lastLogin: '2024-03-14 09:20:15',
    roles: ['Senior Dealer']
  },
  {
    id: '5',
    login: 'plewandowski',
    firstName: 'Piotr',
    lastName: 'Lewandowski',
    status: 'BLOCKED',
    blockedDate: '2024-03-08 09:30:00',
    lastTransaction: '2024-03-07 16:20:45',
    lastLogin: '2024-03-07 08:45:30',
    roles: ['Dealer']
  },
  {
    id: '6',
    login: 'mkaminski',
    firstName: 'Michał',
    lastName: 'Kamiński',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 11:35:42',
    lastLogin: '2024-03-15 08:50:18',
    roles: ['Main Dealer']
  },
  {
    id: '7',
    login: 'azielinska',
    firstName: 'Agnieszka',
    lastName: 'Zielińska',
    status: 'ACTIVE',
    lastTransaction: '2024-03-14 14:25:33',
    lastLogin: '2024-03-14 09:10:25',
    roles: ['Senior Dealer']
  },
  {
    id: '8',
    login: 'tszymanski',
    firstName: 'Tomasz',
    lastName: 'Szymański',
    status: 'BLOCKED',
    blockedDate: '2024-03-12 10:15:00',
    lastTransaction: '2024-03-11 15:50:20',
    lastLogin: '2024-03-11 08:30:15',
    roles: ['Dealer']
  },
  {
    id: '9',
    login: 'mdabrowska',
    firstName: 'Magdalena',
    lastName: 'Dąbrowska',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 13:20:18',
    lastLogin: '2024-03-15 08:45:30',
    roles: ['Admin']
  },
  {
    id: '10',
    login: 'rwozniak',
    firstName: 'Robert',
    lastName: 'Woźniak',
    status: 'ACTIVE',
    lastTransaction: '2024-03-14 16:15:45',
    lastLogin: '2024-03-14 09:05:22',
    roles: ['Senior Dealer', 'Main Dealer']
  },
  {
    id: '11',
    login: 'kmazur',
    firstName: 'Krzysztof',
    lastName: 'Mazur',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 12:40:33',
    lastLogin: '2024-03-15 08:55:18',
    roles: ['Main Dealer']
  },
  {
    id: '12',
    login: 'epiotrowska',
    firstName: 'Ewa',
    lastName: 'Piotrowska',
    status: 'BLOCKED',
    blockedDate: '2024-03-09 14:20:00',
    lastTransaction: '2024-03-08 15:30:25',
    lastLogin: '2024-03-08 09:15:30',
    roles: ['Dealer']
  },
  {
    id: '13',
    login: 'jkrawczyk',
    firstName: 'Jan',
    lastName: 'Krawczyk',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 11:25:18',
    lastLogin: '2024-03-15 08:40:15',
    roles: ['Senior Dealer']
  },
  {
    id: '14',
    login: 'agrabowska',
    firstName: 'Alicja',
    lastName: 'Grabowska',
    status: 'ACTIVE',
    lastTransaction: '2024-03-14 15:50:42',
    lastLogin: '2024-03-14 09:25:30',
    roles: ['Main Dealer']
  },
  {
    id: '15',
    login: 'mwitkowski',
    firstName: 'Marcin',
    lastName: 'Witkowski',
    status: 'BLOCKED',
    blockedDate: '2024-03-11 11:45:00',
    lastTransaction: '2024-03-10 16:35:15',
    lastLogin: '2024-03-10 08:50:22',
    roles: ['Dealer']
  },
  {
    id: '16',
    login: 'awalczak',
    firstName: 'Adam',
    lastName: 'Walczak',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 10:15:33',
    lastLogin: '2024-03-15 08:35:18',
    roles: ['Senior Dealer', 'Main Dealer']
  },
  {
    id: '17',
    login: 'mbaran',
    firstName: 'Monika',
    lastName: 'Baran',
    status: 'ACTIVE',
    lastTransaction: '2024-03-14 14:45:20',
    lastLogin: '2024-03-14 09:30:25',
    roles: ['Admin']
  },
  {
    id: '18',
    login: 'dsikora',
    firstName: 'Daniel',
    lastName: 'Sikora',
    status: 'BLOCKED',
    blockedDate: '2024-03-13 13:10:00',
    lastTransaction: '2024-03-12 15:25:45',
    lastLogin: '2024-03-12 08:45:30',
    roles: ['Dealer']
  },
  {
    id: '19',
    login: 'kgorska',
    firstName: 'Karolina',
    lastName: 'Górska',
    status: 'ACTIVE',
    lastTransaction: '2024-03-15 13:50:18',
    lastLogin: '2024-03-15 08:25:15',
    roles: ['Senior Dealer']
  },
  {
    id: '20',
    login: 'rmichalski',
    firstName: 'Rafał',
    lastName: 'Michalski',
    status: 'ACTIVE',
    lastTransaction: '2024-03-14 16:30:42',
    lastLogin: '2024-03-14 09:15:22',
    roles: ['Main Dealer']
  }
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

function UserSearch() {
  const [searchLogin, setSearchLogin] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | 'fullName';
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof User | 'fullName') => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...mockUsers];

    // Apply filters
    if (searchLogin) {
      filtered = filtered.filter(user =>
        user.login.toLowerCase().includes(searchLogin.toLowerCase())
      );
    }

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: string;
        let bValue: string;

        if (sortConfig.key === 'fullName') {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        } else {
          aValue = String(a[sortConfig.key]);
          bValue = String(b[sortConfig.key]);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [mockUsers, searchLogin, selectedStatus, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const SortIcon = ({ column }: { column: keyof User | 'fullName' }) => {
    if (sortConfig?.key !== column) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">User Search</h2>
        
        {/* Search Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchLogin}
                onChange={(e) => setSearchLogin(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Search by login..."
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              {searchLogin && (
                <button
                  onClick={() => setSearchLogin('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | 'ACTIVE' | 'BLOCKED')}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('login')}
                  >
                    <div className="flex items-center">
                      Login
                      <SortIcon column="login" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center">
                      Full Name
                      <SortIcon column="fullName" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastTransaction')}
                  >
                    <div className="flex items-center">
                      Last Transaction
                      <SortIcon column="lastTransaction" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center">
                      Last Login
                      <SortIcon column="lastLogin" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.login}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          BLOCKED (since {formatDateTime(user.blockedDate!)})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(user.lastTransaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.roles.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedUsers.length)} of{' '}
                  {filteredAndSortedUsers.length} results
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border rounded-md text-sm px-2 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option} per page
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium
                      ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSearch;
