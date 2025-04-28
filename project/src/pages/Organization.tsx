import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Tag, 
  BadgeCheck, 
  BadgeX
} from 'lucide-react';

const Organization = () => {
  const navigate = useNavigate();
  
  // Organization module cards
  const modules = [
    {
      id: 'designation',
      title: 'Designation Management',
      description: 'Manage job titles and positions in your organization',
      icon: <Briefcase size={48} className="text-blue-500 dark:text-blue-400" />,
      action: () => navigate('/organization/designation'),
      color: 'blue'
    },
    {
      id: 'status',
      title: 'Status Management',
      description: 'Define and manage employee statuses in your system',
      icon: <Tag size={48} className="text-purple-500 dark:text-purple-400" />,
      action: () => navigate('/organization/status'),
      color: 'purple'
    }
  ];
  
  // Statistics
  const statistics = [
    {
      title: 'Departments',
      value: 7,
      icon: <Building2 size={24} />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      title: 'Employees',
      value: 124,
      icon: <Users size={24} />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      title: 'Designations',
      value: 18,
      icon: <Briefcase size={24} />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      title: 'Active',
      value: 112,
      icon: <BadgeCheck size={24} />,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
    },
    {
      title: 'Inactive',
      value: 12,
      icon: <BadgeX size={24} />,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Organization</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your organization structure and settings</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statistics.map((stat) => (
          <Card key={stat.title} className="border-t-4 border-blue-500">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="mr-6">
                {module.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {module.description}
                </p>
                <Button
                  variant={module.color as any}
                  onClick={module.action}
                >
                  Manage {module.title.split(' ')[0]}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Organization Structure */}
      <Card className="mt-6" title="Organization Structure">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-blue-700 dark:text-blue-400">Executive Leadership</p>
                <p className="text-sm text-blue-600 dark:text-blue-500">CEO, CTO, CFO</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/30">
              <div className="text-center">
                <p className="text-lg font-medium text-green-700 dark:text-green-400">Engineering</p>
                <p className="text-sm text-green-600 dark:text-green-500">35 employees</p>
              </div>
            </div>
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/30">
              <div className="text-center">
                <p className="text-lg font-medium text-purple-700 dark:text-purple-400">Marketing</p>
                <p className="text-sm text-purple-600 dark:text-purple-500">18 employees</p>
              </div>
            </div>
            <div className="flex-1 p-4 bg-yellow-50 dark:bg-yellow-900/30">
              <div className="text-center">
                <p className="text-lg font-medium text-yellow-700 dark:text-yellow-400">Finance</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">12 employees</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/30">
              <div className="text-center">
                <p className="text-lg font-medium text-red-700 dark:text-red-400">Human Resources</p>
                <p className="text-sm text-red-600 dark:text-red-500">8 employees</p>
              </div>
            </div>
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/30">
              <div className="text-center">
                <p className="text-lg font-medium text-indigo-700 dark:text-indigo-400">Operations</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-500">22 employees</p>
              </div>
            </div>
            <div className="flex-1 p-4 bg-teal-50 dark:bg-teal-900/30">
              <div className="text-center">
                <p className="text-lg font-medium text-teal-700 dark:text-teal-400">Customer Support</p>
                <p className="text-sm text-teal-600 dark:text-teal-500">29 employees</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Organization;