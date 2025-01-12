export interface Customer {
  id: string;
  name: string;
  shortName: string;
  marginGroup: string;
  region: string;
  regon: string;
  nip: string;
  pesel: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  branch: string;
  dealer: string;
  transactionTypes: string[];
  lastTransaction: string;
}

export interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'BLOCKED';
  dateAdded: string;
  dateBlocked?: string;
  lastTransaction: string;
  customerId: string;
}

export const mockCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'Orlen',
    shortName: 'BRW',
    marginGroup: 'A',
    region: 'Południowo-Wschodni',
    regon: '123456789',
    nip: '9876543210',
    pesel: '90090515836',
    status: 'ACTIVE',
    branch: 'Wrocław Main',
    dealer: 'John Smith',
    transactionTypes: ['TTWY', 'Usługa Prowizjonalna'],
    lastTransaction: '2023-03-15',
  },
  {
    id: 'C002',
    name: 'KGHM',
    shortName: 'BRW',
    marginGroup: 'A',
    region: 'Południowo-Wschodni',
    regon: '123456789',
    nip: '9876543210',
    pesel: '90090515836',
    status: 'ACTIVE',
    branch: 'Wrocław Main',
    dealer: 'John Smith',
    transactionTypes: ['TTWY', 'Usługa Prowizjonalna'],
    lastTransaction: '2023-03-15',
  }
];

export const mockUsers: User[] = [
  {
    id: 'U001',
    login: 'jkowalski',
    firstName: 'Jan',
    lastName: 'Kowalski',
    status: 'ACTIVE',
    dateAdded: '2023-01-15',
    lastTransaction: '2024-03-15 14:30:22',
    customerId: 'C001'
  },
  {
    id: 'U002',
    login: 'anowak',
    firstName: 'Anna',
    lastName: 'Nowak',
    status: 'BLOCKED',
    dateAdded: '2023-02-20',
    dateBlocked: '2024-03-01',
    lastTransaction: '2024-02-28 09:15:45',
    customerId: 'C001'
  }
];
