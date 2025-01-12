import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, DollarSign, ArrowUp, ArrowDown, Building2, User, Check, AlertTriangle, Info, RefreshCw } from 'lucide-react';

interface Account {
  iban: string;
  balance: number;
  currency: string;
}

interface Rate {
  value: number;
  trend: 'up' | 'down' | null;
}

type TransactionMode = 'input' | 'confirmation' | 'acknowledgment';
type TransactionSide = 'buy' | 'sell';
type ValueDate = 'today' | 'tomorrow' | 'spot';

interface ValidationError {
  field: string;
  message: string;
}

const CURRENCY_PAIRS = ['EUR/PLN', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'EUR/GBP', 'USD/PLN'];
const MOCK_ACCOUNTS: Account[] = [
  { iban: 'PL61109010140000071219812874', balance: 100000.00, currency: 'PLN' },
  { iban: 'DE89370400440532013000', balance: 50000.00, currency: 'EUR' },
  { iban: 'GB29NWBK60161331926819', balance: 75000.00, currency: 'GBP' },
];

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 10000000;

function NewTransactionFXSpot() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TransactionMode>('input');
  const [countdown, setCountdown] = useState(30);
  const [side, setSide] = useState<TransactionSide>('buy');
  const [currencyPair, setCurrencyPair] = useState(CURRENCY_PAIRS[0]);
  const [valueDate, setValueDate] = useState<ValueDate>('today');
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [fromAccount, setFromAccount] = useState<string>(MOCK_ACCOUNTS[0].iban);
  const [toAccount, setToAccount] = useState<string>(MOCK_ACCOUNTS[1].iban);
  const [rate, setRate] = useState<Rate>({ value: 4.0921, trend: null });
  const [minRate, setMinRate] = useState<Rate>({ value: 3.9100, trend: null });
  const [maxRate, setMaxRate] = useState<Rate>({ value: 4.2900, trend: null });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isRateRefreshing, setIsRateRefreshing] = useState(false);

  useEffect(() => {
    if (mode === 'confirmation') {
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
  }, [mode]);

  useEffect(() => {
    // Simulate real-time rate updates
    const timer = setInterval(() => {
      setRate(prev => {
        const change = (Math.random() - 0.5) * 0.0002;
        const newValue = Number((prev.value + change).toFixed(4));
        return {
          value: newValue,
          trend: newValue > prev.value ? 'up' : 'down'
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (buyAmount < MIN_AMOUNT) {
      newErrors.push({
        field: 'buyAmount',
        message: `Minimum amount is ${formatAmount(MIN_AMOUNT)}`
      });
    }

    if (buyAmount > MAX_AMOUNT) {
      newErrors.push({
        field: 'buyAmount',
        message: `Maximum amount is ${formatAmount(MAX_AMOUNT)}`
      });
    }

    if (sellAmount <= 0) {
      newErrors.push({
        field: 'sellAmount',
        message: 'Sell amount is required'
      });
    }

    const selectedFromAccount = MOCK_ACCOUNTS.find(acc => acc.iban === fromAccount);
    if (selectedFromAccount && buyAmount > selectedFromAccount.balance) {
      newErrors.push({
        field: 'fromAccount',
        message: 'Insufficient funds in selected account'
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMode('confirmation');
    } catch (error) {
      alert('Failed to process transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (countdown === 0) {
      alert('Rate expired. Please try again.');
      setMode('input');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMode('acknowledgment');
    } catch (error) {
      alert('Failed to confirm transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this transaction?')) {
      navigate('/transactions');
    }
  };

  const handleRefreshRate = async () => {
    setIsRateRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRate(prev => ({
        value: Number((prev.value + (Math.random() - 0.5) * 0.01).toFixed(4)),
        trend: null
      }));
    } finally {
      setIsRateRefreshing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const renderInputMode = () => (
    <>
      {/* Customer Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Orlen S.A.</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span>Jan Kowalski</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              Change
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <span className="font-medium">FX Spot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Side
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="side"
                  value="buy"
                  checked={side === 'buy'}
                  onChange={(e) => setSide(e.target.value as TransactionSide)}
                />
                <span className="ml-2">Bank buys</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="side"
                  value="sell"
                  checked={side === 'sell'}
                  onChange={(e) => setSide(e.target.value as TransactionSide)}
                />
                <span className="ml-2">Bank sells</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Pair
            </label>
            <select
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCY_PAIRS.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value Date
            </label>
            <select
              value={valueDate}
              onChange={(e) => setValueDate(e.target.value as ValueDate)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="spot">Spot</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    getFieldError('buyAmount') ? 'border-red-500' : ''
                  }`}
                  min="0"
                  step="0.01"
                />
                {getFieldError('buyAmount') && (
                  <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {getFieldError('buyAmount')}
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Account
              </label>
              <div className="relative">
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    getFieldError('fromAccount') ? 'border-red-500' : ''
                  }`}
                >
                  {MOCK_ACCOUNTS.map(account => (
                    <option key={account.iban} value={account.iban}>
                      {formatIBAN(account.iban)} ({account.currency} {formatAmount(account.balance)})
                    </option>
                  ))}
                </select>
                {getFieldError('fromAccount') && (
                  <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {getFieldError('fromAccount')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sell Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    getFieldError('sellAmount') ? 'border-red-500' : ''
                  }`}
                  min="0"
                  step="0.01"
                />
                {getFieldError('sellAmount') && (
                  <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {getFieldError('sellAmount')}
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Account
              </label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {MOCK_ACCOUNTS.map(account => (
                  <option key={account.iban} value={account.iban}>
                    {formatIBAN(account.iban)} ({account.currency} {formatAmount(account.balance)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Rate Information</h3>
          <button
            onClick={handleRefreshRate}
            disabled={isRateRefreshing}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className={`w-4 h-4 ${isRateRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Rate</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rate
            </label>
            <input
              type="text"
              value={minRate.value.toFixed(4)}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 border rounded-md font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Rate
            </label>
            <div className="relative">
              <input
                type="text"
                value={rate.value.toFixed(4)}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border rounded-md font-mono"
              />
              {rate.trend && (
                <div className="absolute right-3 top-2.5">
                  {rate.trend === 'up' ? (
                    <ArrowUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Rate
            </label>
            <input
              type="text"
              value={maxRate.value.toFixed(4)}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 border rounded-md font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Transaction Amount
            </label>
            <input
              type="text"
              value={formatAmount(buyAmount * rate.value)}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Margin
            </label>
            <div className="relative">
              <input
                type="text"
                value="0.0002"
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border rounded-md"
              />
              <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 
              flex items-center space-x-2`}
          >
            {isLoading && (
              <RefreshCw className="w-4 h-4 animate-spin" />
            )}
            <span>Next</span>
          </button>
        </div>
      </div>
    </>
  );

  const renderConfirmationMode = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-6">Confirm Transaction</h3>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Transaction Side</span>
            <p className="font-medium">{side === 'buy' ? 'Bank buys' : 'Bank sells'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Currency Pair</span>
            <p className="font-medium">{currencyPair}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Buy Amount</span>
            <p className="font-medium">{formatAmount(buyAmount)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Sell Amount</span>
            <p className="font-medium">{formatAmount(sellAmount)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Rate</span>
            <p className="font-medium">{rate.value.toFixed(4)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Value Date</span>
            <p className="font-medium capitalize">{valueDate}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-600 rounded transition-all duration-1000"
            style={{ width: `${(countdown / 30) * 100}%` }}
          />
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">
          Time remaining: {countdown} seconds
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={countdown === 0 || isLoading}
          className={`px-6 py-2 rounded-md text-white font-medium flex items-center space-x-2
            ${countdown > 0 && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {isLoading && (
            <RefreshCw className="w-4 h-4 animate-spin" />
          )}
          <span>Confirm</span>
        </button>
      </div>
    </div>
  );

  const renderAcknowledgmentMode = () => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-medium text-green-600 mb-2">
          Transaction Successful
        </h3>
        <p className="text-gray-600">
          Thank you for your transaction. Your order has been processed successfully.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-6">
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">Transaction Reference</span>
            <p className="font-medium">FX-{Date.now()}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Transaction Details</span>
            <p className="font-medium">
              {side === 'buy' ? 'Bought' : 'Sold'} {formatAmount(buyAmount)} {currencyPair.split('/')[0]}
              <br />
              at rate {rate.value.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/transactions')}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span>Transactions</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">New FX Spot</span>
      </div>

      {/* Content */}
      {mode === 'input' && renderInputMode()}
      {mode === 'confirmation' && renderConfirmationMode()}
      {mode === 'acknowledgment' && renderAcknowledgmentMode()}
    </div>
  );
}

export default NewTransactionFXSpot;
