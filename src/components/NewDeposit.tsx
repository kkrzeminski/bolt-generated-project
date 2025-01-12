import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react';
    import { addDays, addMonths, format } from 'date-fns';

    interface Account {
      id: string;
      name: string;
      number: string;
      balance: number;
      currency: string;
    }

    interface DepositOption {
      id: string;
      label: string;
      period: string;
      interestRate: number;
      addPeriod: (date: Date) => Date;
    }

    const mockAccounts: Account[] = [
      { id: '1', name: 'AVISTA', number: '24150000', balance: 1000000.00, currency: 'USD' },
      { id: '2', name: 'AVISTA', number: '24150001', balance: 800000.00, currency: 'EUR' },
      { id: '3', name: 'AVISTA', number: '24150002', balance: 600000.00, currency: 'GBP' },
      { id: '4', name: 'AVISTA', number: '24150003', balance: 1200000.00, currency: 'CHF' },
      { id: '5', name: 'AVISTA', number: '24150004', balance: 90000000.00, currency: 'JPY' },
    ];

    const depositOptions: DepositOption[] = [
      { 
        id: '1', 
        label: 'Deposit 2 weeks', 
        period: '2 weeks',
        interestRate: 0.00,
        addPeriod: (date) => addDays(date, 14)
      },
      { 
        id: '2', 
        label: 'Deposit 1 month', 
        period: '1 month',
        interestRate: 0.00,
        addPeriod: (date) => addMonths(date, 1)
      },
      { 
        id: '3', 
        label: 'Deposit 6 months', 
        period: '6 months',
        interestRate: 0.06,
        addPeriod: (date) => addMonths(date, 6)
      },
      { 
        id: '4', 
        label: 'Deposit 9 months', 
        period: '9 months',
        interestRate: 0.23,
        addPeriod: (date) => addMonths(date, 9)
      }
    ];

    const MIN_AMOUNT = 30000;

    const NewDeposit = () => {
      const navigate = useNavigate();
      const [selectedAccount, setSelectedAccount] = useState<string>(mockAccounts[0].id);
      const [amount, setAmount] = useState<number>(200000);
      const [selectedDate, setSelectedDate] = useState<Date>(new Date());
      const [selectedOption, setSelectedOption] = useState<DepositOption>(depositOptions[2]); // 6 months default
      const [showDatePicker, setShowDatePicker] = useState(false);

      useEffect(() => {
        setSelectedDate(selectedOption.addPeriod(new Date()));
      }, [selectedOption]);

      const handleAmountChange = (value: string) => {
        const numValue = Number(value.replace(/[^0-9]/g, ''));
        setAmount(numValue);
      };

      const calculateInterest = (depositAmount: number, rate: number) => {
        return (depositAmount * rate) / 100;
      };

      const formatCurrency = (value: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      };

      const formatAccountNumber = (number: string) => {
        return number.replace(/(\d{2})(\d{4})(\d{4})/, '$1...$3');
      };

      const isValid = amount >= MIN_AMOUNT;

      return (
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center text-sm text-gray-600">
            <span>Transactions</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">New Deposit</span>
          </div>

          <div className="flex space-x-6">
            {/* Left Panel */}
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Account Information */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 mb-4"
                  >
                    {mockAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {`${account.name} - ${account.number} (${formatAccountNumber(account.number)}) | ${formatCurrency(account.balance, account.currency)} ${account.currency}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deposit Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Amount
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={formatCurrency(amount, 'USD')}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                        amount < MIN_AMOUNT ? 'border-red-300' : ''
                      }`}
                    />
                    <span className="text-gray-500">USD</span>
                  </div>
                  {amount < MIN_AMOUNT && (
                    <p className="mt-1 text-sm text-red-600">
                      Minimum amount is {formatCurrency(MIN_AMOUNT, 'USD')}
                    </p>
                  )}
                </div>

                {/* Deposit Period */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Period
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Date or choose an example period from the list on the right.
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={format(selectedDate, 'dd.MM.yyyy')}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                    />
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Calendar className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Interest Rate and Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate and Interest
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={selectedOption.interestRate.toFixed(2)}
                        readOnly
                        className="w-24 px-3 py-2 border rounded-md bg-gray-50"
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">Interest Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(calculateInterest(amount, selectedOption.interestRate), 'USD')}
                      </span>
                      <span className="text-gray-500">USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  disabled={!isValid}
                  className={`px-6 py-2 rounded-md text-white flex items-center space-x-2
                    ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  <span>Next</span>
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-1/2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">Choose a deposit from the list:</h3>
                <div className="space-y-3">
                  {depositOptions.map(option => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedOption(option)}
                      className={`p-4 rounded-lg cursor-pointer border transition-colors
                        ${selectedOption.id === option.id
                          ? 'bg-blue-50 border-l border-t border-b border-blue-200 border-r-4 border-r-blue-500'
                          : 'border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{option.label}</h4>
                          <p className="text-sm text-gray-500">
                            {format(option.addPeriod(new Date()), 'dd.MM.yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{option.interestRate.toFixed(2)}%</p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(calculateInterest(amount, option.interestRate), 'USD')} USD
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default NewDeposit;
