import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerSearch from './components/CustomerSearch';
import CustomerDetails from './components/CustomerDetails';
import CustomerRepresentatives from './components/CustomerRepresentatives';
import NewTransaction from './components/NewTransaction';
import UserSearch from './components/UserSearch';
import ManageCurrencyPairs from './components/ManageCurrencyPairs';
import SystemParameters from './components/SystemParameters';
import EventLog from './components/EventLog';
import MarginGroups from './components/MarginGroups';
import TransactionSearch from './components/TransactionSearch';
import MissingOpportunities from './components/MissingOpportunities';
import ChatActiveUsers from './components/ChatActiveUsers';
import ChatOngoing from './components/ChatOngoing';
import RolesManagement from './components/RolesManagement';
import NewTransactionFXSpot from './components/NewTransactionFXSpot';
import NewDeposit from './components/NewDeposit';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App = () => {
  const [activeTab, setActiveTab] = useState('customers');

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 bg-gray-100">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<CustomerSearch />} />
              <Route path="/customers" element={<CustomerSearch />} />
              <Route path="/customer-representatives" element={<CustomerRepresentatives />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/customers/:id/new-transaction" element={<NewTransaction />} />
              <Route path="/users" element={<UserSearch />} />
              <Route path="/roles-management" element={<RolesManagement />} />
              <Route path="/manage-currency-pairs" element={<ManageCurrencyPairs />} />
              <Route path="/system-parameters" element={<SystemParameters />} />
              <Route path="/event-log" element={<EventLog />} />
              <Route path="/margin-groups" element={<MarginGroups />} />
              <Route path="/transaction-search" element={<TransactionSearch />} />
              <Route path="/missing-opportunities" element={<MissingOpportunities />} />
              <Route path="/chat/active-users" element={<ChatActiveUsers />} />
              <Route path="/chat/ongoing" element={<ChatOngoing />} />
              <Route path="/new-fx-spot" element={<NewTransactionFXSpot />} />
              <Route path="/new-deposit" element={<NewDeposit />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
