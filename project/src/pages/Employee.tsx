import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Trash2, 
  Edit2, 
  Mail, 
  Phone,
  Building,
  Calendar,
  Filter
} from 'lucide-react';

const Employee = () => {
  const { employees, departments, deleteEmployee } = useData();
  const navigate = useNavigate();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    return (
      (searchTerm === '' || 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (departmentFilter === '' || emp.department === departmentFilter) &&
      (statusFilter === '' || emp.status === statusFilter)
    );
  });
  
  // Handle delete employee
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Management</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage employee records</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={16} />}
          onClick={() => navigate('/employee/add')}
          className="mt-4 sm:mt-0"
        >
          Add Employee
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
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
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<Filter size={16} />} 
              onClick={() => {
                setDepartmentFilter('');
                setStatusFilter('');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Employees List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center pb-4">
              <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-blue-500">
                <img 
                  src={employee.photo} 
                  alt={employee.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <Link
                to={`/employee/${employee.id}`}
                className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline text-center"
              >
                {employee.name}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{employee.designation}</p>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                employee.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : employee.status === 'On Leave'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {employee.status}
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Mail size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                <p className="text-gray-700 dark:text-gray-300 truncate">{employee.email}</p>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                <p className="text-gray-700 dark:text-gray-300">{employee.phone}</p>
              </div>
              
              <div className="flex items-center text-sm">
                <Building size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                <p className="text-gray-700 dark:text-gray-300">{employee.department}</p>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                <p className="text-gray-700 dark:text-gray-300">
                  Joined: {new Date(employee.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="secondary" 
                size="sm" 
                icon={<Edit2 size={14} />}
                onClick={() => navigate(`/employee/${employee.id}`)}
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                icon={<Trash2 size={14} />}
                onClick={() => handleDelete(employee.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
        
        {filteredEmployees.length === 0 && (
          <div className="col-span-full flex justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <div className="mt-6">
                <Button
                  type="button"
                  variant="primary"
                  icon={<Plus size={16} />}
                  onClick={() => navigate('/employee/add')}
                >
                  Add New Employee
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;