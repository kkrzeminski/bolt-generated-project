import React from 'react';
import { Search, Grid, Bell, HelpCircle, User, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.pathname.split('/')[2];
  const isCustomerDetails = location.pathname.startsWith('/customers/') && !location.pathname.includes('new-transaction');
  // const isCustomerDetails = (location.pathname.startsWith('/customers/') || location.pathname.startsWith('/transaction-search')) && !location.pathname.includes('new-transaction');

  return (
    <header className="h-12 bg-[#2b2b3d] text-white flex items-center px-4 justify-between">
      <div className="flex items-center space-x-4">
        <Grid className="w-6 h-6" />
        <div className="text-lg font-semibold">BOS FX Dealer</div>
      </div>
      
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full bg-[#404057] text-white placeholder-gray-400 px-4 py-1.5 rounded-md pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isCustomerDetails && (
          <button
            onClick={() => navigate(`/customers/${customerId}/new-transaction`)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        )}
        <Bell className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
        <HelpCircle className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#404057] p-1 rounded">
          <div className="w-8 h-8 bg-[#404057] rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <span className="text-sm">John Doe</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
