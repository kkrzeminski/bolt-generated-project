import React, { useState } from 'react';
import { ChevronRight, Plus, Save, Check, ChevronDown, Edit, AlertTriangle } from 'lucide-react';

interface Permission {
  id: string;
  label: string;
  children?: Permission[];
}

interface Role {
  id: string;
  name: string;
  adGroupName: string;
  permissions: string[];
  isEditing?: boolean;
}

const permissionsTree: Permission[] = [
  {
    id: 'customers',
    label: 'Customers',
    children: [
      { id: 'customers.view', label: 'View' },
      { id: 'customers.update', label: 'Update' },
      { id: 'customers.enroll', label: 'Enroll' }
    ]
  },
  {
    id: 'users',
    label: 'Users',
    children: [
      { id: 'users.view', label: 'View' },
      { id: 'users.lock', label: 'Lock/Unlock' }
    ]
  },
  {
    id: 'rolePermissions',
    label: 'Role Permissions',
    children: [
      { id: 'rolePermissions.view', label: 'View' },
      { id: 'rolePermissions.map', label: 'Map' }
    ]
  },
  {
    id: 'transactions',
    label: 'Transactions',
    children: [
      {
        id: 'transactions.spot',
        label: 'Spot',
        children: [
          { id: 'transactions.spot.view', label: 'View' },
          { id: 'transactions.spot.create', label: 'Create' },
          { id: 'transactions.spot.cancel', label: 'Cancel' }
        ]
      },
      {
        id: 'transactions.forward',
        label: 'Forward',
        children: [
          { id: 'transactions.forward.view', label: 'View' },
          { id: 'transactions.forward.create', label: 'Create' },
          { id: 'transactions.forward.cancel', label: 'Cancel' }
        ]
      },
      {
        id: 'transactions.deposit',
        label: 'Deposit',
        children: [
          { id: 'transactions.deposit.view', label: 'View' },
          { id: 'transactions.deposit.create', label: 'Create' },
          { id: 'transactions.deposit.cancel', label: 'Cancel' }
        ]
      }
    ]
  },
  {
    id: 'management',
    label: 'Management',
    children: [
      {
        id: 'management.currencyPairs',
        label: 'Currency Pairs',
        children: [
          { id: 'management.currencyPairs.view', label: 'View' },
          { id: 'management.currencyPairs.manage', label: 'Manage' }
        ]
      },
      {
        id: 'management.marginGroups',
        label: 'Margin Groups',
        children: [
          { id: 'management.marginGroups.view', label: 'View' },
          { id: 'management.marginGroups.manage', label: 'Manage' }
        ]
      },
      {
        id: 'management.businessParams',
        label: 'Business Parameters',
        children: [
          { id: 'management.businessParams.view', label: 'View' },
          { id: 'management.businessParams.manage', label: 'Manage' }
        ]
      },
      {
        id: 'management.technicalParams',
        label: 'Technical Parameters',
        children: [
          { id: 'management.technicalParams.view', label: 'View' },
          { id: 'management.technicalParams.manage', label: 'Manage' }
        ]
      }
    ]
  },
  {
    id: 'chat',
    label: 'Chat',
    children: [
      { id: 'chat.start', label: 'Start' },
      { id: 'chat.takePart', label: 'Take Part' },
      { id: 'chat.history', label: 'History' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    children: [
      { id: 'reports.activity', label: 'Activity' },
      { id: 'reports.groups', label: 'Groups' },
      { id: 'reports.events', label: 'Events' }
    ]
  }
];

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    adGroupName: 'EFX_Admin_Group',
    permissions: ['customers.view', 'customers.update', 'customers.enroll']
  },
  {
    id: '2',
    name: 'Main Dealer',
    adGroupName: 'EFX_MainDealer_Group',
    permissions: ['customers.view', 'transactions.spot.view', 'transactions.spot.create']
  },
  {
    id: '3',
    name: 'Senior Dealer',
    adGroupName: 'EFX_SeniorDealer_Group',
    permissions: ['customers.view', 'transactions.spot.view']
  },
  {
    id: '4',
    name: 'Dealer',
    adGroupName: 'EFX_Dealer_Group',
    permissions: ['customers.view']
  }
];

function PermissionTree({
  permissions,
  selectedPermissions,
  onToggle,
  level = 0,
  parentExpanded = true,
  inheritedPermissions = []
}: {
  permissions: Permission[];
  selectedPermissions: string[];
  onToggle: (permissionId: string) => void;
  level?: number;
  parentExpanded?: boolean;
  inheritedPermissions?: string[];
}) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const isNodeSelected = (permission: Permission): boolean | 'partial' => {
    const allChildPermissions = getAllChildPermissions(permission);
    const selectedCount = allChildPermissions.filter(id => selectedPermissions.includes(id)).length;
    
    if (selectedCount === 0) return false;
    if (selectedCount === allChildPermissions.length) return true;
    return 'partial';
  };

  const getAllChildPermissions = (permission: Permission): string[] => {
    const permissions = [permission.id];
    if (permission.children) {
      permission.children.forEach(child => {
        permissions.push(...getAllChildPermissions(child));
      });
    }
    return permissions;
  };

  if (!parentExpanded) return null;

  return (
    <div className="space-y-2">
      {permissions.map(permission => {
        const hasChildren = permission.children && permission.children.length > 0;
        const isExpanded = expandedNodes.includes(permission.id);
        const selectionState = isNodeSelected(permission);
        const isInherited = inheritedPermissions.includes(permission.id);

        return (
          <div key={permission.id} className="select-none">
            <div
              className={`flex items-center space-x-2 py-1 ${level > 0 ? 'ml-6' : ''}`}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleNode(permission.id)}
                  className="p-0.5 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              ) : (
                <div className="w-5" />
              )}
              
              <div
                onClick={() => !isInherited && onToggle(permission.id)}
                className={`flex items-center space-x-2 flex-1 ${isInherited ? 'opacity-50' : 'cursor-pointer'}`}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center
                  ${isInherited ? 'bg-gray-100 border-gray-300' :
                    selectionState === true ? 'bg-blue-500 border-blue-500' : 
                    selectionState === 'partial' ? 'bg-gray-200 border-gray-300' : 
                    'border-gray-300'}`}
                >
                  {selectionState === true && !isInherited && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                  {selectionState === 'partial' && !isInherited && (
                    <div className="w-2 h-2 bg-gray-500 rounded-sm" />
                  )}
                </div>
                <span className="text-sm">{permission.label}</span>
              </div>
            </div>
            
            {hasChildren && (
              <PermissionTree
                permissions={permission.children}
                selectedPermissions={selectedPermissions}
                onToggle={onToggle}
                level={level + 1}
                parentExpanded={isExpanded}
                inheritedPermissions={inheritedPermissions}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleCreateRole = () => {
    const newRole: Role = {
      id: crypto.randomUUID(),
      name: 'New Role',
      adGroupName: 'EFX_NewRole_Group',
      permissions: [],
      isEditing: true
    };
    setRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    setHasChanges(true);
  };

  const handleEditRole = (role: Role) => {
    setRoles(prev => prev.map(r => 
      r.id === role.id ? { ...r, isEditing: true } : r
    ));
    setSelectedRole(role);
  };

  const handleSaveRole = (role: Role) => {
    if (!role.name.trim()) {
      alert('Role name cannot be empty');
      return;
    }

    setRoles(prev => prev.map(r =>
      r.id === role.id ? { ...role, isEditing: false } : r
    ));
    setShowConfirmation(true);
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!selectedRole) return;

    const allChildPermissions = getAllChildPermissionsById(permissionId);
    const parentPermissions = getParentPermissionsById(permissionId);
    
    let newPermissions: string[];
    if (selectedRole.permissions.includes(permissionId)) {
      // Remove permission and all child permissions
      newPermissions = selectedRole.permissions.filter(p => 
        !allChildPermissions.includes(p) && p !== permissionId
      );
    } else {
      // Add permission, all child permissions, and all parent permissions
      newPermissions = [
        ...new Set([
          ...selectedRole.permissions,
          permissionId,
          ...allChildPermissions,
          ...parentPermissions
        ])
      ];
    }

    setRoles(prev => prev.map(r =>
      r.id === selectedRole.id ? { ...r, permissions: newPermissions } : r
    ));
    setHasChanges(true);
  };

  const getAllChildPermissionsById = (permissionId: string): string[] => {
    const findPermission = (permissions: Permission[]): Permission | null => {
      for (const permission of permissions) {
        if (permission.id === permissionId) return permission;
        if (permission.children) {
          const found = findPermission(permission.children);
          if (found) return found;
        }
      }
      return null;
    };

    const permission = findPermission(permissionsTree);
    if (!permission) return [];

    const getAllChildIds = (permission: Permission): string[] => {
      const ids = [permission.id];
      if (permission.children) {
        permission.children.forEach(child => {
          ids.push(...getAllChildIds(child));
        });
      }
      return ids;
    };

    return getAllChildIds(permission);
  };

  const getParentPermissionsById = (permissionId: string): string[] => {
    const parents: string[] = [];
    
    const findParents = (permissions: Permission[], parentId?: string) => {
      for (const permission of permissions) {
        if (permission.id === permissionId && parentId) {
          parents.push(parentId);
        }
        if (permission.children) {
          findParents(permission.children, permission.id);
        }
      }
    };

    findParents(permissionsTree);
    return parents;
  };

  const handleConfirmSave = () => {
    setShowConfirmation(false);
    setHasChanges(false);
    // Here you would typically save to a backend
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span>Users</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900">Roles Management</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Roles Management</h2>
        <button
          onClick={handleCreateRole}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Roles List */}
        <div className="col-span-4 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Roles</h3>
          <div className="space-y-2">
            {roles.map(role => (
              <div
                key={role.id}
                className={`p-4 rounded-md cursor-pointer transition-colors
                  ${selectedRole?.id === role.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-transparent'
                  } border`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    {role.isEditing ? (
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) => setRoles(prev => prev.map(r =>
                          r.id === role.id ? { ...r, name: e.target.value } : r
                        ))}
                        className="px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <h4 className="font-medium">{role.name}</h4>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{role.adGroupName}</p>
                  </div>
                  {!role.isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRole(role);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Tree */}
        <div className="col-span-8 bg-white rounded-lg shadow-md p-6">
          {selectedRole ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Permissions for {selectedRole.name}</h3>
                {hasChanges && (
                  <div className="flex items-center space-x-4">
                    <span className="text-amber-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Unsaved changes
                    </span>
                    <button
                      onClick={() => handleSaveRole(selectedRole)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
              <PermissionTree
                permissions={permissionsTree}
                selectedPermissions={selectedRole.permissions}
                onToggle={handleTogglePermission}
              />
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Select a role to manage permissions
            </div>
          )}
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Save Changes</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save the changes to role permissions?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolesManagement;
