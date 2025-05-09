import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  Save,
  X
} from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getEmployeeById, 
    getAttendancesByEmployeeId, 
    getLeavesByEmployeeId,
    updateEmployee,
    deleteEmployee,
    departments,
    designations
  } = useData();
  
  // Get employee data
  const employee = getEmployeeById(id!);
  const attendances = getAttendancesByEmployeeId(id!);
  const leaveRecords = getLeavesByEmployeeId(id!);
  
  // If employee not found
  if (!employee) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <XCircle size={48} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Employee Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The employee you're looking for doesn't exist or has been removed.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/employee')}
        >
          Back to Employees
        </Button>
      </div>
    );
  }
  
  // State
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    address: employee.address,
    photo: employee.photo
  });
  
  // Filter designations based on selected department
  const filteredDesignations = designations.filter(
    des => des.department === formData.department
  );
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll just keep the current photo
      setFormData((prev) => ({ ...prev, photo: employee.photo }));
    }
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    updateEmployee(id!, formData);
    setIsEditing(false);
  };
  
  // Handle delete employee
  const handleDeleteEmployee = () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      deleteEmployee(id!);
      navigate('/employee');
    }
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'Present') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle size={12} className="mr-1" />
          Present
        </span>
      );
    } else if (status === 'Late') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <AlertCircle size={12} className="mr-1" />
          Late
        </span>
      );
    } else if (status === 'Absent') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle size={12} className="mr-1" />
          Absent
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {status}
        </span>
      );
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{employee.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{employee.designation} - {employee.department}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Employee Info */}
        <div>
          <Card>
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img 
                  src={employee.photo} 
                  alt={employee.name} 
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-500"
                />
                {isEditing && (
                  <label 
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                    <input 
                      type="file" 
                      id="photo-upload" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                ) : (
                  employee.name
                )}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {employee.designation}
              </p>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : employee.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail size={18} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-white">{employee.email}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone size={18} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-white">{employee.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Building size={18} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="block w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 dark:text-white">{employee.department}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Building size={18} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                  {isEditing ? (
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="block w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {filteredDesignations.map((des) => (
                        <option key={des.id} value={des.name}>{des.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 dark:text-white">{employee.designation}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="block w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-white">{employee.address}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Join Date</p>
                  <p className="text-gray-800 dark:text-white">{formatDate(employee.joinDate)}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Present</p>
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{employee.daysPresent}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-lg font-medium text-yellow-600 dark:text-yellow-400">{employee.totalLeaves}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">leaves</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">{employee.remainingLeaves}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">leaves</p>
              </div>
            </div>
            
            {isEditing ? (
              <div className="mt-6 flex space-x-3">
                <Button 
                  variant="primary" 
                  icon={<Save size={16} />} 
                  onClick={handleSaveChanges}
                  fullWidth
                >
                  Save Changes
                </Button>
                <Button 
                  variant="secondary" 
                  icon={<X size={16} />} 
                  onClick={() => setIsEditing(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex space-x-3">
                <Button 
                  variant="secondary" 
                  icon={<Edit2 size={16} />} 
                  onClick={() => setIsEditing(true)}
                  fullWidth
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="danger" 
                  icon={<Trash2 size={16} />} 
                  onClick={handleDeleteEmployee}
                  fullWidth
                >
                  Delete
                </Button>
              </div>
            )}
          </Card>
        </div>
        
        {/* Right Column - Attendance & Leave History */}
        <div className="lg:col-span-2">
          <Card>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 -mt-2 -mx-2">
              <button
                className={`py-3 px-6 border-b-2 font-medium text-sm focus:outline-none ${
                  activeTab === 'attendance'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('attendance')}
              >
                Attendance History
              </button>
              <button
                className={`py-3 px-6 border-b-2 font-medium text-sm focus:outline-none ${
                  activeTab === 'leave'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('leave')}
              >
                Leave History
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'attendance' ? (
              <>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Attendance Records
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Check-In
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Check-Out
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Break Time
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {attendances.length > 0 ? (
                        attendances.map((attendance) => (
                          <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(attendance.date)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {attendance.timeIn ? (
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1 text-gray-500 dark:text-gray-400" />
                                  {attendance.timeIn}
                                </div>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {attendance.timeOut ? (
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1 text-gray-500 dark:text-gray-400" />
                                  {attendance.timeOut}
                                </div>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {attendance.breakTime}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <StatusBadge status={attendance.status} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No attendance records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Leave Records
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Plus size={14} />}
                  >
                    Request Leave
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {leaveRecords.length > 0 ? (
                        leaveRecords.map((leave) => (
                          <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {leave.type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(leave.startDate)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(leave.endDate)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {leave.reason}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                leave.status === 'Approved' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : leave.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {leave.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No leave records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;