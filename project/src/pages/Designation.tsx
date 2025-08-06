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
  Briefcase, 
  ChevronDown,
  X,
  Save
} from 'lucide-react';

const Designation = () => {
  const navigate = useNavigate();
  const { designations, departments, addDesignation, updateDesignation, deleteDesignation } = useData();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<null | { id?: string, name: string, department: string, description: string }>(null);
  
  // Filter designations
  const filteredDesignations = designations.filter(des => {
    return (
      (searchTerm === '' || 
        des.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        des.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (departmentFilter === '' || des.department === departmentFilter)
    );
  });
  
  // Open add/edit modal
  const openModal = (designation = null) => {
    if (designation) {
      setEditingDesignation({
        id: designation.id,
        name: designation.name,
        department: designation.department,
        description: designation.description
      });
    } else {
      setEditingDesignation({
        name: '',
        department: departments[0] || '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDesignation(null);
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingDesignation(prev => ({
      ...prev!,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingDesignation) return;
    
    if (editingDesignation.id) {
      // Update existing designation
      updateDesignation(editingDesignation.id, {
        name: editingDesignation.name,
        department: editingDesignation.department,
        description: editingDesignation.description
      });
    } else {
      // Add new designation
      addDesignation({
        name: editingDesignation.name,
        department: editingDesignation.department,
        description: editingDesignation.description
      });
    }
    
    closeModal();
  };
  
  // Handle delete designation
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      deleteDesignation(id);
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Designation Management</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage job titles and positions</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search designations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filters and Add Button */}
          <div className="flex space-x-3">
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <Button 
              variant="primary" 
              icon={<Plus size={16} />}
              onClick={() => openModal()}
            >
              Add Designation
            </Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Designation Name
                </th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDesignations.map((designation) => (
                <tr key={designation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md mr-3">
                        <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {designation.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{designation.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{designation.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openModal(designation)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(designation.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredDesignations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <Briefcase size={48} className="mb-3 opacity-40" />
                      <p className="text-lg font-medium">No designations found</p>
                      <p className="text-sm">Try adjusting your search criteria or add a new designation</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                  {editingDesignation?.id ? 'Edit Designation' : 'Add New Designation'}
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
                        Designation Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editingDesignation?.name || ''}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={editingDesignation?.department || ''}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editingDesignation?.description || ''}
                        onChange={handleChange}
                        rows={3}
                        className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
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
                    {editingDesignation?.id ? 'Update' : 'Save'}
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

export default Designation;