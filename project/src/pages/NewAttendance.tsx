import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save, Clock, Calendar, User, Briefcase, AlertCircle } from 'lucide-react';

const NewAttendance = () => {
  const navigate = useNavigate();
  const { employees, departments, addAttendance } = useData();
  
  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    timeIn: '',
    timeOut: '',
    breakTime: '00:30',
    status: 'Present',
  });
  
  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Please select an employee';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (formData.status !== 'Absent') {
      if (!formData.timeIn) {
        newErrors.timeIn = 'Please enter time in';
      }
      
      if (!formData.timeOut) {
        newErrors.timeOut = 'Please enter time out';
      }
      
      if (formData.timeIn && formData.timeOut) {
        const timeIn = new Date(`2000-01-01T${formData.timeIn}`);
        const timeOut = new Date(`2000-01-01T${formData.timeOut}`);
        
        if (timeOut <= timeIn) {
          newErrors.timeOut = 'Time out must be after time in';
        }
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Find the selected employee to get their name and department
    const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
    
    if (!selectedEmployee) {
      setErrors({ employeeId: 'Invalid employee selected' });
      return;
    }
    
    // Create attendance record
    const newAttendance = {
      employeeId: formData.employeeId,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      date: formData.date,
      timeIn: formData.status === 'Absent' ? '' : formData.timeIn,
      timeOut: formData.status === 'Absent' ? '' : formData.timeOut,
      breakTime: formData.status === 'Absent' ? '00:00' : formData.breakTime,
      status: formData.status,
    };
    
    // Add attendance record
    addAttendance(newAttendance);
    
    // Navigate back to attendance management
    navigate('/attendance');
  };
  
  // Find selected employee
  const selectedEmployee = formData.employeeId 
    ? employees.find(emp => emp.id === formData.employeeId) 
    : null;
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/attendance')}
          className="mr-4 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400">Record a new attendance entry</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Employee Selection */}
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Employee
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className={`
                        block w-full pl-10 pr-10 py-2 rounded-md border 
                        ${errors.employeeId 
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                        bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                      `}
                    >
                      <option value="">Select an employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.department}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.employeeId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeId}</p>
                  )}
                </div>
                
                {/* Date Selection */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`
                        block w-full pl-10 pr-4 py-2 rounded-md border 
                        ${errors.date 
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                        bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                      `}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
                  )}
                </div>
                
                {/* Status Selection */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AlertCircle size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>
                
                {formData.status !== 'Absent' && (
                  <>
                    {/* Time In */}
                    <div>
                      <label htmlFor="timeIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Time In
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="time"
                          id="timeIn"
                          name="timeIn"
                          value={formData.timeIn}
                          onChange={handleChange}
                          className={`
                            block w-full pl-10 pr-4 py-2 rounded-md border 
                            ${errors.timeIn 
                              ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                            bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                          `}
                        />
                      </div>
                      {errors.timeIn && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.timeIn}</p>
                      )}
                    </div>
                    
                    {/* Time Out */}
                    <div>
                      <label htmlFor="timeOut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Time Out
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="time"
                          id="timeOut"
                          name="timeOut"
                          value={formData.timeOut}
                          onChange={handleChange}
                          className={`
                            block w-full pl-10 pr-4 py-2 rounded-md border 
                            ${errors.timeOut 
                              ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
                            bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                          `}
                        />
                      </div>
                      {errors.timeOut && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.timeOut}</p>
                      )}
                    </div>
                    
                    {/* Break Time */}
                    <div>
                      <label htmlFor="breakTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Break Time (HH:MM)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="time"
                          id="breakTime"
                          name="breakTime"
                          value={formData.breakTime}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => navigate('/attendance')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    icon={<Save size={16} />}
                  >
                    Save Record
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
        
        {/* Employee Information Card */}
        <div>
          <Card className="sticky top-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Employee Information</h3>
            
            {selectedEmployee ? (
              <div>
                <div className="flex items-center mb-6">
                  <img 
                    src={selectedEmployee.photo} 
                    alt={selectedEmployee.name} 
                    className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-blue-500"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white">{selectedEmployee.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEmployee.designation}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Briefcase size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedEmployee.department}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Attendance Stats:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Present</p>
                        <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{selectedEmployee.daysPresent}</p>
                      </div>
                      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Leaves</p>
                        <p className="text-lg font-medium text-yellow-600 dark:text-yellow-400">{selectedEmployee.totalLeaves}</p>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
                        <p className="text-lg font-medium text-green-600 dark:text-green-400">{selectedEmployee.remainingLeaves}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <User size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select an employee to see their information
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewAttendance;