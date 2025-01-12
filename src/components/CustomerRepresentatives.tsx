import React, { useState } from 'react';
import { ChevronRight, Search, Plus, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Representative {
  id: string;
  initials: string;
  name: string;
  role: string;
  type: 'Reprezentant' | 'Transakcje';
  permissions: {
    name: string;
    status: 'Aktywne' | 'Nieaktywne';
  }[];
  documents: {
    name: string;
    date: string;
  }[];
}

const mockRepresentatives: Representative[] = [
  {
    id: '1',
    initials: 'AK',
    name: 'Anna Kowalska',
    role: 'Transakcje',
    type: 'Transakcje',
    permissions: [
      { name: 'FX Spot', status: 'Aktywne' },
      { name: 'FX Forward', status: 'Aktywne' },
      { name: 'FX Swap', status: 'Aktywne' }
    ],
    documents: []
  },
  {
    id: '2',
    initials: 'TN',
    name: 'Tomasz Nowak',
    role: 'Transakcje',
    type: 'Transakcje',
    permissions: [
      { name: 'FX Spot', status: 'Aktywne' },
      { name: 'FX Forward', status: 'Aktywne' }
    ],
    documents: []
  },
  {
    id: '3',
    initials: 'MK',
    name: 'Michał Kowalski',
    role: 'Reprezentant',
    type: 'Reprezentant',
    permissions: [
      { name: 'FX Spot', status: 'Aktywne' },
      { name: 'FX Forward', status: 'Aktywne' },
      { name: 'FX Swap', status: 'Aktywne' },
      { name: 'Lokata strukturyzowana', status: 'Aktywne' }
    ],
    documents: [
      { name: 'Umowa ramowa DUS', date: '12.09.2023' },
      { name: 'Aneks do umowy', date: '12.09.2023' }
    ]
  },
  {
    id: '4',
    initials: 'MK',
    name: 'Mateusz Nowik',
    role: 'Transakcje',
    type: 'Transakcje',
    permissions: [
      { name: 'FX Spot', status: 'Aktywne' },
      { name: 'FX Forward', status: 'Aktywne' }
    ],
    documents: []
  },
  {
    id: '5',
    initials: 'KJ',
    name: 'Katarzyna Jackowska',
    role: 'Transakcje',
    type: 'Transakcje',
    permissions: [
      { name: 'FX Spot', status: 'Aktywne' },
      { name: 'FX Forward', status: 'Aktywne' }
    ],
    documents: []
  }
];

function CustomerRepresentatives() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Representative>(mockRepresentatives[2]);

  const filteredRepresentatives = mockRepresentatives.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Link to="/customers" className="hover:text-blue-600">Customers</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Representatives</span>
      </div>

      <div className="flex space-x-6">
        {/* Left Panel - List */}
        <div className="w-96">
          <h2 className="text-lg font-medium mb-4">Representatives of customer</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Wyszukaj osobę"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Representatives List */}
          <div className="space-y-2">
            {filteredRepresentatives.map(person => (
              <button
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-colors
                  ${selectedPerson.id === person.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center
                  ${selectedPerson.id === person.id ? 'bg-blue-100' : ''}`}
                >
                  <span className="text-sm font-medium">{person.initials}</span>
                </div>
                <div>
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-gray-500">{person.role}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Details */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-medium">{selectedPerson.initials}</span>
              </div>
              <div>
                <h2 className="text-xl font-medium">{selectedPerson.name}</h2>
                <p className="text-gray-500">{selectedPerson.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Autentykacja SMS
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                Pokaż dane osoby
              </button>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Uprawnienia do transakcji i produktów</h3>
              <button className="flex items-center text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4 mr-1" />
                Dodaj nowe
              </button>
            </div>
            <div className="space-y-3">
              {selectedPerson.permissions.map((permission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>{permission.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 text-sm">Aktywne</span>
                    <button className="text-blue-600 hover:text-blue-700">
                      Dalej →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          {selectedPerson.documents.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Dokumenty</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  Dodaj lub wypowiedz dokument
                </button>
              </div>
              <div className="space-y-3">
                {selectedPerson.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div>{doc.name}</div>
                        <div className="text-sm text-gray-500">z dn {doc.date}</div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      Zobacz →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerRepresentatives;
