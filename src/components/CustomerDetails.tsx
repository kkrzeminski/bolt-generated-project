import React, { useState } from 'react';
import { Customer, mockUsers, mockCustomers } from '../data/mockData';
import { ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface CustomerDetailsProps {
  customer?: Customer;
}

function CustomerDetails({ customer: propCustomer }: CustomerDetailsProps) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('currencyPairs');
  
  // Find customer either from props or by ID
  const customer = propCustomer || mockCustomers.find(c => c.id === id);
  
  if (!customer) {
    return <div className="p-6">Customer not found</div>;
  }

  const tabs = [
    { id: 'currencyPairs', label: 'Currency Pairs' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'standingOrders', label: 'Standing Orders' },
    { id: 'conditionalOrders', label: 'Conditional Orders' },
    { id: 'users', label: 'Users' },
  ];

  const mockCurrencyPairs = [
    { pair: 'EUR/PLN', bid: 4.3215, ask: 4.3315, spread: 0.01 },
    { pair: 'USD/PLN', bid: 3.9876, ask: 3.9976, spread: 0.01 },
    { pair: 'GBP/PLN', bid: 5.1234, ask: 5.1334, spread: 0.01 },
  ];

  const mockTransactions = [
    { id: 'T001', date: '2024-03-15 14:30:22', type: 'SPOT', pair: 'EUR/PLN', amount: 100000.00, rate: 4.3215 },
    { id: 'T002', date: '2024-03-14 11:20:15', type: 'FORWARD', pair: 'USD/PLN', amount: 50000.00, rate: 3.9876 },
  ];

  const mockAlerts = [
    { id: 'A001', pair: 'EUR/PLN', targetRate: 4.3500, direction: 'above', status: 'active' },
    { id: 'A002', pair: 'USD/PLN', targetRate: 3.9500, direction: 'below', status: 'active' },
  ];

  const mockStandingOrders = [
    { id: 'SO001', pair: 'EUR/PLN', amount: 100000.00, targetRate: 4.3500, expiry: '2024-04-15', status: 'active' },
    { id: 'SO002', pair: 'USD/PLN', amount: 50000.00, targetRate: 3.9500, expiry: '2024-04-30', status: 'active' },
  ];

  const mockConditionalOrders = [
    { id: 'CO001', pair: 'EUR/PLN', amount: 75000.00, condition: 'if bid >= 4.3500', status: 'active' },
    { id: 'CO002', pair: 'USD/PLN', amount: 25000.00, condition: 'if ask <= 3.9500', status: 'active' },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/customers" className="hover:text-blue-600">Customers</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">{customer.name}</span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{customer.name}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Short Name</p>
            <p className="font-medium">{customer.shortName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                customer.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}>
              {customer.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Margin Group</p>
            <p className="font-medium">{customer.marginGroup}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">REGON</p>
            <p className="font-medium">{customer.regon}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">NIP</p>
            <p className="font-medium">{customer.nip}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">PESEL</p>
            <p className="font-medium">{customer.pesel}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'currencyPairs' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Available Currency Pairs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ask</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spread</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockCurrencyPairs.map((pair) => (
                      <tr key={pair.pair} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{pair.pair}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pair.bid}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pair.ask}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pair.spread}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{tx.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{tx.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{tx.pair}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{tx.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Price Alerts</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{alert.pair}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{alert.targetRate}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{alert.direction}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {alert.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'standingOrders' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Standing Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockStandingOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{order.pair}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.targetRate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.expiry}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'conditionalOrders' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Conditional Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockConditionalOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{order.pair}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.condition}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-medium mb-4">User Access List</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Blocked</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers
                      .filter(user => user.customerId === customer.id)
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{user.login}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.dateAdded}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.dateBlocked || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.lastTransaction}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
