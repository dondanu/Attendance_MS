import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
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
  Cell,
  LineChart,
  Line
} from 'recharts';

const Dashboard = () => {
  const { employees, attendances } = useData();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  
  // Generate some mock data for charts
  const today = new Date();
  
  // Get today's attendance stats
  const todayAttendances = attendances.filter(att => 
    att.date === today.toISOString().split('T')[0]
  );
  
  const presentCount = todayAttendances.filter(att => att.status === 'Present').length;
  const lateCount = todayAttendances.filter(att => att.status === 'Late').length;
  const absentCount = todayAttendances.filter(att => att.status === 'Absent').length;
  
  // Generate attendance trend data
  const getDaysInRange = (range: 'week' | 'month' | 'quarter') => {
    const days = [];
    const daysToShow = range === 'week' ? 7 : range === 'month' ? 30 : 90;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };
  
  const daysInRange = getDaysInRange(timeRange);
  const attendanceTrendData = daysInRange.map(day => {
    const dayAttendances = attendances.filter(att => att.date === day);
    const present = dayAttendances.filter(att => att.status === 'Present').length;
    const late = dayAttendances.filter(att => att.status === 'Late').length;
    const absent = dayAttendances.filter(att => att.status === 'Absent').length;
    
    return {
      date: day,
      Present: present,
      Late: late,
      Absent: absent
    };
  });
  
  // Generate productivity score data
  const productivityByHour = [
    { hour: '8 AM', productivity: 65 },
    { hour: '9 AM', productivity: 75 },
    { hour: '10 AM', productivity: 90 },
    { hour: '11 AM', productivity: 95 },
    { hour: '12 PM', productivity: 80 },
    { hour: '1 PM', productivity: 60 },
    { hour: '2 PM', productivity: 70 },
    { hour: '3 PM', productivity: 85 },
    { hour: '4 PM', productivity: 80 },
    { hour: '5 PM', productivity: 75 }
  ];
  
  // Generate shift distribution data
  const shiftDistribution = [
    { name: 'Morning', value: 45 },
    { name: 'Afternoon', value: 30 },
    { name: 'Evening', value: 15 },
    { name: 'Night', value: 10 }
  ];
  
  const SHIFT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];
  
  // Calculate average work hours
  const workHours = attendances
    .filter(att => att.timeIn && att.timeOut)
    .map(att => {
      const timeIn = new Date(`2023-01-01T${att.timeIn}`);
      const timeOut = new Date(`2023-01-01T${att.timeOut}`);
      const diffMs = timeOut.getTime() - timeIn.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours;
    });
  
  const avgWorkHours = workHours.length > 0 
    ? (workHours.reduce((a, b) => a + b, 0) / workHours.length).toFixed(1) 
    : 0;
  
  // Generate recent activity
  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'clocked in', time: '08:05 AM', status: 'present' },
    { id: 2, user: 'Jane Smith', action: 'clocked in', time: '09:10 AM', status: 'late' },
    { id: 3, user: 'Michael Johnson', action: 'requested leave', time: '10:15 AM', status: 'info' },
    { id: 4, user: 'Emily Davis', action: 'clocked out', time: '05:30 PM', status: 'present' },
    { id: 5, user: 'David Wilson', action: 'marked absent', time: 'Today', status: 'absent' },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your attendance management dashboard</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Employees</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{employees.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 dark:text-green-400 flex items-center">
            <TrendingUp size={16} className="mr-1" />
            <span>+12% from last month</span>
          </div>
        </Card>
        
        <Card className="border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Today's Attendance</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{presentCount + lateCount}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{Math.round(((presentCount + lateCount) / employees.length) * 100)}%</span> of total employees
          </div>
        </Card>
        
        <Card className="border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg. Work Hours</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{avgWorkHours}h</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
            <span>-0.5h from target</span>
          </div>
        </Card>
        
        <Card className="border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Productivity Score</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">78%</h3>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <BarChart3 size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 dark:text-green-400 flex items-center">
            <TrendingUp size={16} className="mr-1" />
            <span>+5% from last week</span>
          </div>
        </Card>
      </div>
      
      {/* Attendance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2" title="Attendance Trend">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Daily attendance statistics</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 text-xs rounded-md ${
                  timeRange === 'week' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 text-xs rounded-md ${
                  timeRange === 'month' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeRange('quarter')}
                className={`px-3 py-1 text-xs rounded-md ${
                  timeRange === 'quarter' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Quarter
              </button>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                  }}
                />
                <Legend />
                <Bar dataKey="Present" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Late" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Today's Status">
          <div className="flex flex-col h-72 justify-between">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Employee attendance status</h4>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Present</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{presentCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(presentCount / employees.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <AlertCircle size={16} className="text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Late</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{lateCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(lateCount / employees.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <XCircle size={16} className="text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Absent</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{absentCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(absentCount / employees.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-l-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-800">
                  Export
                </button>
                <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border-t border-b border-r border-blue-200 rounded-r-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-800">
                  Print
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Productivity and Shift Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Daily Productivity" className="lg:col-span-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Hourly productivity levels</h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={productivityByHour}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="productivity" 
                  stroke="#6366F1" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Shift Distribution">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Employees per shift</h4>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shiftDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {shiftDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SHIFT_COLORS[index % SHIFT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-4 flex animate-fadeIn">
                <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center mr-4
                  ${activity.status === 'present' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                    activity.status === 'late' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                    activity.status === 'absent' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
                `}>
                  {activity.status === 'present' ? <CheckCircle size={20} /> : 
                   activity.status === 'late' ? <AlertCircle size={20} /> : 
                   activity.status === 'absent' ? <XCircle size={20} /> : 
                   <Calendar size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {activity.action}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;