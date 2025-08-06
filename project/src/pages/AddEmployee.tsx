import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { useDropzone } from 'react-dropzone';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Tag,
  Upload
} from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { departments, designations, statuses, addEmployee } = useData();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: departments[0] || '',
    designation: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    photo: '',
    address: '',
    daysPresent: 0,
    totalLeaves: 24,
    remainingLeaves: 24
  });
  
  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Handle image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user changes input
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Filter designations based on selected department
  const filteredDesignations = designations.filter(
    des => des.department === formData.department
  );
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!formData.photo) {
      newErrors.photo = 'Profile photo is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Add new employee
    addEmployee(formData);
    
    // Navigate back to employee list
    navigate('/employee');
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/employee')}
          className="mr-4 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Employee</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a new employee record</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photo Upload */}
          <div>
            <Card>
              <div className="flex flex-col items-center">
                <div 
                  {...getRootProps()} 
                  className={`w-32 h-32 relative mb-4 rounded-full border-4 border-dashed cursor-pointer
                    ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}
                    ${errors.photo ? 'border-red-300 dark:border-red-700' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  {formData.photo ? (
                    <img 
                      src={formData.photo}
                      alt="Employee" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Drop photo here or<br />click to upload
                      </p>
                    </div>
                  )}
                </div>
                {errors.photo && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.photo}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                  Upload a profile photo for the employee
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Leave Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="totalLeaves" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Leaves
                    </label>
                    <input
                      type="number"
                      id="totalLeaves"
                      name="totalLeaves"
                      value={formData.totalLeaves}
                      onChange={handleChange}
                      min="0"
                      className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="remainingLeaves" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Remaining Leaves
                    </label>
                    <input
                      type="number"
                      id="remainingLeaves"
                      name="remainingLeaves"
                      value={formData.remainingLeaves}
                      onChange={handleChange}
                      min="0"
                      max={formData.totalLeaves}
                      className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column - Employee Details */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">Employee Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`
                        block w-full pl-10 pr-4 py-2 rounded-md border 
                        ${errors.name 
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                      `}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        block w-full pl-10 pr-4 py-2 rounded-md border 
                        ${errors.email 
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                      `}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`
                        block w-full pl-10 pr-4 py-2 rounded-md border 
                        ${errors.phone 
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                      `}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                  )}
                </div>
                
                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Designation */}
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Designation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className={`
                        block w-full pl-10 pr-4 py-2 rounded-md border 
                        ${errors.designation 
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                      `}
                    >
                      <option value="">Select a designation</option>
                      {filteredDesignations.map((des) => (
                        <option key={des.id} value={des.name}>{des.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.designation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.designation}</p>
                  )}
                </div>
                
                {/* Join Date */}
                <div>
                  <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Join Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="joinDate"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status.id} value={status.name}>{status.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main St, Anytown, CA 12345"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => navigate('/employee')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  icon={<Save size={16} />}
                >
                  Save Employee
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;