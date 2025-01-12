import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  nodes: TreeNode[];
  selectedItems: string[];
  onSelect: (items: string[]) => void;
}

function TreeSelect({ nodes, selectedItems, onSelect }: TreeSelectProps) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const getAllChildIds = (node: TreeNode): string[] => {
    const ids = [node.id];
    if (node.children) {
      node.children.forEach(child => {
        ids.push(...getAllChildIds(child));
      });
    }
    return ids;
  };

  const getParentIds = (nodeId: string, nodes: TreeNode[]): string[] => {
    for (const node of nodes) {
      if (node.children) {
        if (node.children.some(child => child.id === nodeId || getAllChildIds(child).includes(nodeId))) {
          return [node.id];
        }
        const parentIds = getParentIds(nodeId, node.children);
        if (parentIds.length > 0) {
          return [node.id, ...parentIds];
        }
      }
    }
    return [];
  };

  const handleSelect = (node: TreeNode) => {
    const childIds = getAllChildIds(node);
    const isSelected = childIds.every(id => selectedItems.includes(id));
    
    let newSelected: string[];
    if (isSelected) {
      // Deselect node and all children
      newSelected = selectedItems.filter(id => !childIds.includes(id));
    } else {
      // Select node and all children
      newSelected = [...new Set([...selectedItems, ...childIds])];
    }
    
    onSelect(newSelected);
  };

  const isNodeSelected = (node: TreeNode): boolean | 'partial' => {
    const childIds = getAllChildIds(node);
    const selectedCount = childIds.filter(id => selectedItems.includes(id)).length;
    
    if (selectedCount === 0) return false;
    if (selectedCount === childIds.length) return true;
    return 'partial';
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.includes(node.id);
    const selectionState = isNodeSelected(node);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer
            ${level > 0 ? 'ml-6' : ''}`}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-5" /> // Spacer for alignment
          )}
          
          <div
            onClick={() => handleSelect(node)}
            className="flex items-center space-x-2 flex-1"
          >
            <div className={`w-4 h-4 border rounded flex items-center justify-center
              ${selectionState === true ? 'bg-blue-500 border-blue-500' : 
                selectionState === 'partial' ? 'bg-gray-200 border-gray-300' : 
                'border-gray-300'}`}
            >
              {selectionState === true && (
                <Check className="w-3 h-3 text-white" />
              )}
              {selectionState === 'partial' && (
                <div className="w-2 h-2 bg-gray-500 rounded-sm" />
              )}
            </div>
            <span className="text-sm">{node.label}</span>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-md p-2 max-h-64 overflow-y-auto bg-white">
      {nodes.map(node => renderNode(node))}
    </div>
  );
}

export default TreeSelect;
