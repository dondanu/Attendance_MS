import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Tag, 
  X,
  Save,
  Circle
} from 'lucide-react';

const Status = () => {
  const navigate = useNavigate();
  const { statuses, addStatus, updateStatus, deleteStatus } = useData();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<null | { id?: string, name: string, description: string, color: string }>(null);
  
  // Filter statuses
  const filteredStatuses = statuses.filter(status => {
    return (
      searchTerm === '' || 
      status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Color options
  const colorOptions = [
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Teal', value: '#14b8a6' },
  ];
  
  // Open add/edit modal
  const openModal = (status = null) => {
    if (status) {
      setEditingStatus({
        id: status.id,
        name: status.name,
        description: status.description,
        color: status.color
      });
    } else {
      setEditingStatus({
        name: '',
        description: '',
        color: colorOptions[0].value
      });
    }
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStatus(null);
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingStatus(prev => ({
      ...prev!,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStatus) return;
    
    if (editingStatus.id) {
      // Update existing status
      updateStatus(editingStatus.id, {
        name: editingStatus.name,
        description: editingStatus.description,
        color: editingStatus.color
      });
    } else {
      // Add new status
      addStatus({
        name: editingStatus.name,
        description: editingStatus.description,
        color: editingStatus.color
      });
    }
    
    closeModal();
  };
  
  // Handle delete status
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      deleteStatus(id);
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/organization')}
          className="mr-4 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Status Management</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage employee statuses</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search statuses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Add Button */}
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => openModal()}
          >
            Add Status
          </Button>
        </div>
      </Card>
      
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStatuses.map((status) => (
            <div 
              key={status.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-full mr-2" style={{ backgroundColor: status.color }}>
                    <Circle size={16} className="text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">{status.name}</h3>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openModal(status)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(status.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{status.description}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 flex items-center">
                <Tag size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Color code: {status.color}</span>
              </div>
            </div>
          ))}
          
          {filteredStatuses.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center">
                <Tag size={48} className="mb-3 opacity-40" />
                <p className="text-lg font-medium">No statuses found</p>
                <p className="text-sm">Try adjusting your search criteria or add a new status</p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <span 
              className="hidden sm:inline-block sm:align-middle sm:h-screen" 
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingStatus?.id ? 'Edit Status' : 'Add New Status'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editingStatus?.name || ''}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editingStatus?.description || ''}
                        onChange={handleChange}
                        rows={3}
                        className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color
                      </label>
                      <div className="grid grid-cols-4 gap-3 mt-2">
                        {colorOptions.map((color) => (
                          <div 
                            key={color.value}
                            className={`
                              w-full aspect-square rounded-md cursor-pointer flex items-center justify-center
                              border-2 ${editingStatus?.color === color.value ? 'border-gray-800 dark:border-white' : 'border-transparent'}
                            `}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setEditingStatus(prev => ({ ...prev!, color: color.value }))}
                          >
                            {editingStatus?.color === color.value && (
                              <Check className="text-white" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    icon={<Save size={16} />}
                  >
                    {editingStatus?.id ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Small check icon component
const Check = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default Status;