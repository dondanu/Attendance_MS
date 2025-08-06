import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  BarChart4, 
  ListFilter, 
  FileText,
  Calendar,
  ChevronDown,
  Building
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AttendanceReport = () => {
  const navigate = useNavigate();
  const { attendances, departments } = useData();
  
  // Filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'detail' | 'statistics'>('detail');
  
  // Filter attendances based on criteria
  const filteredAttendances = attendances.filter(att => {
    return (
      (startDate === '' || att.date >= startDate) &&
      (endDate === '' || att.date <= endDate) &&
      (departmentFilter === '' || att.department === departmentFilter) &&
      (statusFilter === '' || att.status === statusFilter)
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate work hours for each attendance record
  const calculateWorkHours = (timeIn: string, timeOut: string, breakTime: string) => {
    if (!timeIn || !timeOut) return 0;
    
    const [breakHours, breakMinutes] = breakTime.split(':').map(Number);
    const breakTimeInMinutes = (breakHours * 60) + breakMinutes;
    
    const timeInDate = new Date(`2000-01-01T${timeIn}`);
    const timeOutDate = new Date(`2000-01-01T${timeOut}`);
    
    // If time out is before time in, assume it's the next day
    if (timeOutDate < timeInDate) {
      timeOutDate.setDate(timeOutDate.getDate() + 1);
    }
    
    const diffMs = timeOutDate.getTime() - timeInDate.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    
    // Subtract break time
    const workMinutes = diffMinutes - breakTimeInMinutes;
    
    // Convert to hours with 1 decimal place
    return Math.max(0, parseFloat((workMinutes / 60).toFixed(1)));
  };
  
  // Prepare data for statistics
  const prepareStatisticsData = () => {
    // Status distribution
    const statusCounts = {
      Present: filteredAttendances.filter(att => att.status === 'Present').length,
      Late: filteredAttendances.filter(att => att.status === 'Late').length,
      Absent: filteredAttendances.filter(att => att.status === 'Absent').length
    };
    
    const statusData = [
      { name: 'Present', value: statusCounts.Present },
      { name: 'Late', value: statusCounts.Late },
      { name: 'Absent', value: statusCounts.Absent }
    ];
    
    // Department distribution
    const departmentMap = new Map<string, number>();
    
    filteredAttendances.forEach(att => {
      const current = departmentMap.get(att.department) || 0;
      departmentMap.set(att.department, current + 1);
    });
    
    const departmentData = Array.from(departmentMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    return {
      statusData,
      departmentData
    };
  };
  
  const statisticsData = prepareStatisticsData();
  
  // Colors for charts
  const STATUS_COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  const DEPARTMENT_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316', '#FBBF24'];
  
  // Clear all filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setDepartmentFilter('');
    setStatusFilter('');
  };
  
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Report</h1>
          <p className="text-gray-600 dark:text-gray-400">View detailed attendance statistics and reports</p>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-4 lg:space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Department */}
            <div>
              <label htmlFor="departmentFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building size={16} className="text-gray-400" />
                </div>
                <select
                  id="departmentFilter"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="block w-full pl-10 pr-8 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ListFilter size={16} className="text-gray-400" />
                </div>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-10 pr-8 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download size={16} />}
            >
              Export
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Printer size={16} />}
            >
              Print
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Report Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-3 px-6 border-b-2 font-medium text-sm focus:outline-none ${
            activeTab === 'detail'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('detail')}
        >
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            Detail Report
          </div>
        </button>
        <button
          className={`py-3 px-6 border-b-2 font-medium text-sm focus:outline-none ${
            activeTab === 'statistics'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('statistics')}
        >
          <div className="flex items-center">
            <BarChart4 size={16} className="mr-2" />
            Statistics
          </div>
        </button>
      </div>
      
      {/* Report Content */}
      {activeTab === 'detail' ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Check-In
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Check-Out
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Work Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAttendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {attendance.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {attendance.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(attendance.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {attendance.timeIn || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {attendance.timeOut || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        attendance.status === 'Present' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : attendance.status === 'Late'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {attendance.status !== 'Absent' 
                        ? `${calculateWorkHours(attendance.timeIn, attendance.timeOut, attendance.breakTime)}h` 
                        : '—'}
                    </td>
                  </tr>
                ))}
                
                {filteredAttendances.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <FileText size={48} className="mb-3 opacity-40" />
                        <p className="text-lg font-medium">No records found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredAttendances.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredAttendances.length} records
            </div>
          )}
        </Card>
      ) : (
        // Statistics Tab
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card title="Attendance Status Distribution">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statisticsData.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statisticsData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Summary</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Present</p>
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">{statisticsData.statusData[0].value}</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Late</p>
                  <p className="text-lg font-medium text-yellow-600 dark:text-yellow-400">{statisticsData.statusData[1].value}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Absent</p>
                  <p className="text-lg font-medium text-red-600 dark:text-red-400">{statisticsData.statusData[2].value}</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Department Distribution */}
          <Card title="Attendance by Department">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statisticsData.departmentData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Records" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Department Statistics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total departments: {statisticsData.departmentData.length}
              </p>
              {statisticsData.departmentData.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Department with most records: {statisticsData.departmentData.sort((a, b) => b.value - a.value)[0].name}
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;