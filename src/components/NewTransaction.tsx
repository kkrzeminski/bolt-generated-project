import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Customer, mockCustomers, mockUsers } from '../data/mockData';
import { ChevronRight, Plus } from 'lucide-react';

interface FormData {
  referenceNumber: string;
  currencyPair: string;
  transactionSide: 'BID' | 'ASK';
  baseAmount: number;
  quoteAmount: number;
}

const CURRENCY_PAIRS = ['EUR/PLN', 'USD/PLN', 'CHF/PLN', 'CZK/PLN', 'DKK/PLN', 'NOK/PLN'];

function NewTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const customer = mockCustomers.find(c => c.id === id);
  const dealer = mockUsers.find(u => u.status === 'ACTIVE' && u.customerId === id);
  
  const [formData, setFormData] = useState<FormData>({
    referenceNumber: '0000000000000000',
    currencyPair: 'EUR/PLN',
    transactionSide: 'BID',
    baseAmount: 1000.00,
    quoteAmount: 3901.40,
  });

  useEffect(() => {
    if (showConfirmation) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showConfirmation]);

  if (!customer || !dealer) {
    return <div className="p-6">Customer or dealer not found</div>;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!/^\d{16}$/.test(formData.referenceNumber)) {
      newErrors.referenceNumber = 'Reference number must be exactly 16 digits';
    }
    
    if (formData.baseAmount <= 0) {
      newErrors.baseAmount = 'Base amount must be positive';
    }
    
    if (formData.quoteAmount <= 0) {
      newErrors.quoteAmount = 'Quote amount must be positive';
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    // Handle transaction confirmation
    navigate(`/customers/${id}`);
  };

  const formatIBAN = (iban: string) => {
    return iban.slice(2).replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Breadcrumb Panel */}
        <div className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/customers" className="hover:text-blue-600">Customers</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to={`/customers/${id}`} className="hover:text-blue-600">{customer.name}</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">New Transaction</span>
        </div>

        {/* Main Form Container */}
        <div className="space-y-6">
          {/* Customer and Dealer Information Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div className="border-r border-gray-200 pr-8">
                <h3 className="text-lg font-medium mb-4 pb-2 border-b">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customer.name}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                    <input
                      type="text"
                      value={customer.shortName}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                    <input
                      type="text"
                      value={customer.nip.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1-$2-$3-$4')}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 pb-2 border-b">Dealer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Name</label>
                    <input
                      type="text"
                      value={`${dealer.firstName} ${dealer.lastName}`}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Login</label>
                    <input
                      type="text"
                      value={dealer.login}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={customer.branch}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">Transaction Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  pattern="[0-9]{16}"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.referenceNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.referenceNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Pair</label>
                <select
                  value={formData.currencyPair}
                  onChange={(e) => setFormData({ ...formData, currencyPair: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCY_PAIRS.map(pair => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Side</label>
                <select
                  value={formData.transactionSide}
                  onChange={(e) => setFormData({ ...formData, transactionSide: e.target.value as 'BID' | 'ASK' })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BID">BID</option>
                  <option value="ASK">ASK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rate Information Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">Rate Information</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                <input
                  type="text"
                  value={new Date().toISOString().split('T')[0]}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Rate</label>
                <input
                  type="number"
                  value="3.9140"
                  readOnly
                  step="0.0001"
                  className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Rate</label>
                <input
                  type="number"
                  value="3.8940"
                  readOnly
                  step="0.0001"
                  className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Amount and Account Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div className="border-r border-gray-200 pr-8">
                <h3 className="text-lg font-medium mb-4 pb-2 border-b">Amount Section</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount</label>
                      <input
                        type="number"
                        value={formData.baseAmount}
                        onChange={(e) => setFormData({ ...formData, baseAmount: Number(e.target.value) })}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
                      <input
                        type="text"
                        value="EUR"
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quote Amount</label>
                      <input
                        type="number"
                        value={formData.quoteAmount}
                        onChange={(e) => setFormData({ ...formData, quoteAmount: Number(e.target.value) })}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quote Currency</label>
                      <input
                        type="text"
                        value="PLN"
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference Quote Amount</label>
                    <input
                      type="number"
                      value="3891.40"
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profit</label>
                    <input
                      type="number"
                      value={formData.quoteAmount - 3891.40}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 pb-2 border-b">Account Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Account</label>
                    <input
                      type="text"
                      value={formatIBAN('DE89370400440532013000123312')}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Account Currency</label>
                    <input
                      type="text"
                      value="EUR"
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote Account</label>
                    <input
                      type="text"
                      value={formatIBAN('PL61109010140000071219812874')}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote Account Currency</label>
                    <input
                      type="text"
                      value="PLN"
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Panel */}
          {showConfirmation && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b">Confirmation</h3>
              <div className="space-y-4">
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-blue-600 rounded transition-all duration-1000"
                    style={{ width: `${(countdown / 15) * 100}%` }}
                  />
                </div>
                <p className="text-center mt-2 text-sm text-gray-600">
                  Time remaining: {countdown} seconds
                </p>
                <button
                  onClick={handleConfirm}
                  disabled={countdown === 0}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium
                    ${countdown > 0
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  Confirm Transaction
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(`/customers/${id}`)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={showConfirmation}
                className={`px-6 py-2 text-white rounded-md
                  ${showConfirmation
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTransaction;
