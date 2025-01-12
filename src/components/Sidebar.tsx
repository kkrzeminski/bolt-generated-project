import React, { useState } from 'react';
import { Users, Building2, Receipt, Settings, PieChart, DollarSign, Sliders, History, ChevronDown, ChevronRight, Search, AlertTriangle, MessageSquare, MessagesSquare, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TabId = 'customers' | 'customersSearch' | 'customerRepresentatives' | 'users' | 'usersSearch' | 'rolesManagement' | 'chat' | 'chatActiveUsers' | 'chatOngoing' | 'transactions' | 'transactionSearch' | 'newFXSpot' | 'newDeposit' | 'missingOpportunities' | 'management' | 'currencyPairs' | 'marginGroups' | 'systemParameters' | 'eventLog';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const menuItems = [
  {
    icon: Users,
    label: 'Customers',
    id: 'customers' as const,
    items: [
      { icon: Users, label: 'Customers Search', id: 'customersSearch' as const, path: '/customers' },
      { icon: Users, label: 'Representatives', id: 'customerRepresentatives' as const, path: '/customer-representatives' },
    ]
  },
  {
    icon: Building2,
    label: 'Users',
    id: 'users' as const,
    items: [
      { icon: Users, label: 'Users Search', id: 'usersSearch' as const, path: '/users' },
      { icon: Users, label: 'Roles', id: 'rolesManagement' as const, path: '/roles-management' },
    ]
  },
  {
    icon: MessageSquare,
    label: 'Chat',
    id: 'chat' as const,
    items: [
      { icon: Users, label: 'Active Users', id: 'chatActiveUsers' as const, path: '/chat/active-users' },
      { icon: MessagesSquare, label: 'Ongoing', id: 'chatOngoing' as const, path: '/chat/ongoing' }
    ]
  },
  {
    icon: Receipt,
    label: 'Transactions',
    id: 'transactions' as const,
    items: [
      { icon: DollarSign, label: 'New FX Spot', id: 'newFXSpot' as const, path: '/new-fx-spot' },
      { icon: Landmark, label: 'New Deposit', id: 'newDeposit' as const, path: '/new-deposit' },
      { icon: Search, label: 'Transaction Search', id: 'transactionSearch' as const, path: '/transaction-search' },
      { icon: AlertTriangle, label: 'Missing Opportunities', id: 'missingOpportunities' as const, path: '/missing-opportunities' }
    ]
  },
  {
    icon: Settings,
    label: 'Management',
    id: 'management' as const,
    items: [
      { icon: DollarSign, label: 'Manage Currency Pairs', id: 'currencyPairs' as const, path: '/manage-currency-pairs' },
      { icon: PieChart, label: 'Margin Groups', id: 'marginGroups' as const, path: '/margin-groups' },
      { icon: Sliders, label: 'System Parameters', id: 'systemParameters' as const, path: '/system-parameters' },
      { icon: History, label: 'Event Log', id: 'eventLog' as const, path: '/event-log' }
    ]
  }
];

function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['management']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  const handleItemClick = (item: typeof menuItems[0], event: React.MouseEvent) => {
    if ('path' in item) {
      onTabChange(item.id);
      navigate(item.path);
    } else if ('items' in item) {
      event.preventDefault();
      toggleSection(item.id);
    }
  };

  const handleKeyPress = (item: typeof menuItems[0], event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if ('items' in item) {
        toggleSection(item.id);
      } else if ('path' in item) {
        onTabChange(item.id);
        navigate(item.path);
      }
    }
  };

  const isItemActive = (id: TabId) => activeTab === id;

  const isParentActive = (item: typeof menuItems[0]) => {
    if ('items' in item && item.items) {
      return item.items.some(subItem => isItemActive(subItem.id));
    }
    return false;
  };

  return (
    <div className="w-64 bg-[#2b2b3d] text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">BOS FX Dealer</h1>
        <nav className="space-y-1" role="navigation">
          {menuItems.map((item) => (
            <div key={item.id}>
              <div
                role={('items' in item) ? 'button' : undefined}
                tabIndex={0}
                aria-expanded={('items' in item) ? isExpanded(item.id) : undefined}
                aria-controls={('items' in item) ? `${item.id}-submenu` : undefined}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200
                  ${isItemActive(item.id) || isParentActive(item)
                    ? 'bg-[#404057]'
                    : 'hover:bg-[#363649]'}`}
                onClick={(e) => handleItemClick(item, e)}
                onKeyDown={(e) => handleKeyPress(item, e)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {'items' in item && (
                  <div className="text-gray-400 transition-transform duration-200">
                    {isExpanded(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
              {'items' in item && (
                <div
                  id={`${item.id}-submenu`}
                  role="region"
                  aria-labelledby={`${item.id}-button`}
                  className={`overflow-hidden transition-all duration-200 ease-in-out
                    ${isExpanded(item.id)
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'}`}
                >
                  <div className="ml-6 mt-1 space-y-1">
                    {item.items.map((subItem) => (
                      <div
                        key={subItem.id}
                        role="menuitem"
                        tabIndex={0}
                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-all duration-200
                          ${isItemActive(subItem.id) ? 'bg-[#404057]' : 'hover:bg-[#363649]'}`}
                        onClick={() => {
                          onTabChange(subItem.id);
                          navigate(subItem.path);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onTabChange(subItem.id);
                            navigate(subItem.path);
                          }
                        }}
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span className="text-sm">{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
