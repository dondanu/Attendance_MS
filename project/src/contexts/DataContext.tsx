import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

// Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joinDate: string;
  status: string;
  photo: string;
  address: string;
  daysPresent: number;
  totalLeaves: number;
  remainingLeaves: number;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  timeIn: string;
  timeOut: string;
  breakTime: string;
  status: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  type: string;
}

export interface Designation {
  id: string;
  name: string;
  department: string;
  description: string;
}

export interface Status {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface DataContextType {
  employees: Employee[];
  attendances: Attendance[];
  leaveRecords: LeaveRecord[];
  designations: Designation[];
  statuses: Status[];
  departments: string[];
  
  // CRUD operations
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addAttendance: (attendance: Omit<Attendance, "id">) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  deleteAttendance: (id: string) => void;
  
  addLeaveRecord: (leave: Omit<LeaveRecord, "id">) => void;
  updateLeaveRecord: (id: string, leave: Partial<LeaveRecord>) => void;
  deleteLeaveRecord: (id: string) => void;
  
  addDesignation: (designation: Omit<Designation, "id">) => void;
  updateDesignation: (id: string, designation: Partial<Designation>) => void;
  deleteDesignation: (id: string) => void;
  
  addStatus: (status: Omit<Status, "id">) => void;
  updateStatus: (id: string, status: Partial<Status>) => void;
  deleteStatus: (id: string) => void;
  
  getEmployeeById: (id: string) => Employee | undefined;
  getAttendancesByEmployeeId: (employeeId: string) => Attendance[];
  getLeavesByEmployeeId: (employeeId: string) => LeaveRecord[];
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    department: 'Engineering',
    designation: 'Senior Developer',
    joinDate: '2022-02-15',
    status: 'Active',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    address: '123 Main St, Anytown, CA 12345',
    daysPresent: 220,
    totalLeaves: 24,
    remainingLeaves: 14
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    department: 'Marketing',
    designation: 'Marketing Manager',
    joinDate: '2021-08-10',
    status: 'Active',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    address: '456 Oak Ave, Somewhere, NY 54321',
    daysPresent: 210,
    totalLeaves: 24,
    remainingLeaves: 8
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '(555) 456-7890',
    department: 'Finance',
    designation: 'Financial Analyst',
    joinDate: '2022-05-20',
    status: 'Active',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    address: '789 Pine St, Elsewhere, TX 67890',
    daysPresent: 195,
    totalLeaves: 24,
    remainingLeaves: 12
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '(555) 234-5678',
    department: 'Human Resources',
    designation: 'HR Specialist',
    joinDate: '2021-11-15',
    status: 'Active',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    address: '101 Maple Dr, Anywhere, FL 13579',
    daysPresent: 200,
    totalLeaves: 24,
    remainingLeaves: 10
  }
];

const mockAttendances: Attendance[] = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  const employeeIndex = i % mockEmployees.length;
  const employee = mockEmployees[employeeIndex];
  
  const statuses = ['Present', 'Late', 'Absent'];
  const statusIndex = Math.floor(Math.random() * 3);
  
  return {
    id: `att-${i + 1}`,
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    date: formattedDate,
    timeIn: statusIndex === 2 ? '' : `0${8 + (statusIndex === 1 ? 1 : 0)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    timeOut: statusIndex === 2 ? '' : `1${7 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    breakTime: statusIndex === 2 ? '00:00' : `00:${30 + Math.floor(Math.random() * 30)}`,
    status: statuses[statusIndex]
  };
});

const mockLeaveRecords: LeaveRecord[] = [
  {
    id: 'leave-1',
    employeeId: '1',
    startDate: '2023-04-10',
    endDate: '2023-04-12',
    reason: 'Family vacation',
    status: 'Approved',
    type: 'Annual Leave'
  },
  {
    id: 'leave-2',
    employeeId: '2',
    startDate: '2023-05-05',
    endDate: '2023-05-05',
    reason: 'Medical appointment',
    status: 'Approved',
    type: 'Sick Leave'
  },
  {
    id: 'leave-3',
    employeeId: '1',
    startDate: '2023-06-20',
    endDate: '2023-06-22',
    reason: 'Personal matters',
    status: 'Pending',
    type: 'Personal Leave'
  }
];

const mockDesignations: Designation[] = [
  { id: 'des-1', name: 'Junior Developer', department: 'Engineering', description: 'Entry-level software developer' },
  { id: 'des-2', name: 'Senior Developer', department: 'Engineering', description: 'Experienced software developer' },
  { id: 'des-3', name: 'Project Manager', department: 'Engineering', description: 'Manages software development projects' },
  { id: 'des-4', name: 'Marketing Specialist', department: 'Marketing', description: 'Specializes in marketing campaigns' },
  { id: 'des-5', name: 'Marketing Manager', department: 'Marketing', description: 'Manages marketing team and strategies' },
  { id: 'des-6', name: 'Financial Analyst', department: 'Finance', description: 'Analyzes financial data and reports' },
  { id: 'des-7', name: 'HR Specialist', department: 'Human Resources', description: 'Handles employee relations and recruitment' }
];

const mockStatuses: Status[] = [
  { id: 'status-1', name: 'Active', description: 'Currently employed', color: '#22c55e' },
  { id: 'status-2', name: 'On Leave', description: 'Temporarily on leave', color: '#f59e0b' },
  { id: 'status-3', name: 'Terminated', description: 'No longer employed', color: '#ef4444' },
  { id: 'status-4', name: 'Suspended', description: 'Temporarily suspended', color: '#6366f1' }
];

const mockDepartments = ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Sales', 'Customer Support'];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendances, setAttendances] = useState<Attendance[]>(mockAttendances);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(mockLeaveRecords);
  const [designations, setDesignations] = useState<Designation[]>(mockDesignations);
  const [statuses, setStatuses] = useState<Status[]>(mockStatuses);
  const [departments] = useState<string[]>(mockDepartments);

  // CRUD operations for employees
  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, employee: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employee } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    // Also delete related records
    setAttendances(prev => prev.filter(att => att.employeeId !== id));
    setLeaveRecords(prev => prev.filter(leave => leave.employeeId !== id));
  };

  // CRUD operations for attendances
  const addAttendance = (attendance: Omit<Attendance, "id">) => {
    const newAttendance = {
      ...attendance,
      id: `att-${Date.now()}`
    };
    setAttendances(prev => [...prev, newAttendance]);
  };

  const updateAttendance = (id: string, attendance: Partial<Attendance>) => {
    setAttendances(prev => prev.map(att => att.id === id ? { ...att, ...attendance } : att));
  };

  const deleteAttendance = (id: string) => {
    setAttendances(prev => prev.filter(att => att.id !== id));
  };

  // CRUD operations for leave records
  const addLeaveRecord = (leave: Omit<LeaveRecord, "id">) => {
    const newLeave = {
      ...leave,
      id: `leave-${Date.now()}`
    };
    setLeaveRecords(prev => [...prev, newLeave]);
  };

  const updateLeaveRecord = (id: string, leave: Partial<LeaveRecord>) => {
    setLeaveRecords(prev => prev.map(l => l.id === id ? { ...l, ...leave } : l));
  };

  const deleteLeaveRecord = (id: string) => {
    setLeaveRecords(prev => prev.filter(l => l.id !== id));
  };

  // CRUD operations for designations
  const addDesignation = (designation: Omit<Designation, "id">) => {
    const newDesignation = {
      ...designation,
      id: `des-${Date.now()}`
    };
    setDesignations(prev => [...prev, newDesignation]);
  };

  const updateDesignation = (id: string, designation: Partial<Designation>) => {
    setDesignations(prev => prev.map(des => des.id === id ? { ...des, ...designation } : des));
  };

  const deleteDesignation = (id: string) => {
    setDesignations(prev => prev.filter(des => des.id !== id));
  };

  // CRUD operations for statuses
  const addStatus = (status: Omit<Status, "id">) => {
    const newStatus = {
      ...status,
      id: `status-${Date.now()}`
    };
    setStatuses(prev => [...prev, newStatus]);
  };

  const updateStatus = (id: string, status: Partial<Status>) => {
    setStatuses(prev => prev.map(s => s.id === id ? { ...s, ...status } : s));
  };

  const deleteStatus = (id: string) => {
    setStatuses(prev => prev.filter(s => s.id !== id));
  };

  // Helper functions
  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const getAttendancesByEmployeeId = (employeeId: string) => {
    return attendances.filter(att => att.employeeId === employeeId);
  };

  const getLeavesByEmployeeId = (employeeId: string) => {
    return leaveRecords.filter(leave => leave.employeeId === employeeId);
  };

  return (
    <DataContext.Provider value={{
      employees,
      attendances,
      leaveRecords,
      designations,
      statuses,
      departments,
      
      addEmployee,
      updateEmployee,
      deleteEmployee,
      
      addAttendance,
      updateAttendance,
      deleteAttendance,
      
      addLeaveRecord,
      updateLeaveRecord,
      deleteLeaveRecord,
      
      addDesignation,
      updateDesignation,
      deleteDesignation,
      
      addStatus,
      updateStatus,
      deleteStatus,
      
      getEmployeeById,
      getAttendancesByEmployeeId,
      getLeavesByEmployeeId
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};