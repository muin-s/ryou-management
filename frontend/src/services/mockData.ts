// Mock data for the Hostel Issue Management System
// TODO: Replace with actual backend API calls

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'repairer';
  phone?: string;
  roomNo?: string;
  hostelBlock?: string;
}

export interface IssueCategory {
  id: string;
  name: string;
}

export interface Issue {
  id: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  categoryId: string;
  title: string;
  description: string;
  attachments: string[];
  postedDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedRepairerId?: string;
  upvotes: number;
  voters: string[];
  resolvedAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  postedByAdminId: string;
  postedDate: string;
  expiryDate?: string;
  isPublic: boolean;
}

export const categories: IssueCategory[] = [
  { id: '1', name: 'Room Cleaning' },
  { id: '2', name: 'Water Complaint' },
  { id: '3', name: 'Internet' },
  { id: '4', name: 'Furniture' },
  { id: '5', name: 'Electronics' },
  { id: '6', name: 'Washroom' },
  { id: '7', name: 'Others' },
];

export const users: User[] = [
  {
    id: 's1',
    name: 'John Doe',
    email: 'john@student.com',
    password: 'student123',
    role: 'student',
    phone: '9876543210',
    roomNo: '101',
    hostelBlock: 'A',
  },
  {
    id: 's2',
    name: 'Jane Smith',
    email: 'jane@student.com',
    password: 'student123',
    role: 'student',
    phone: '9876543211',
    roomNo: '205',
    hostelBlock: 'B',
  },
  {
    id: 's3',
    name: 'Bob Wilson',
    email: 'bob@student.com',
    password: 'student123',
    role: 'student',
    phone: '9876543212',
    roomNo: '303',
    hostelBlock: 'A',
  },
  {
    id: 'a1',
    name: 'Admin One',
    email: 'admin@hostel.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'a2',
    name: 'Admin Two',
    email: 'admin2@hostel.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'r1',
    name: 'Repairer Mike',
    email: 'mike@repairer.com',
    password: 'repairer123',
    role: 'repairer',
    phone: '9876543213',
  },
  {
    id: 'r2',
    name: 'Repairer Tom',
    email: 'tom@repairer.com',
    password: 'repairer123',
    role: 'repairer',
    phone: '9876543214',
  },
];

export const issues: Issue[] = [
  {
    id: 'i1',
    studentId: 's1',
    studentName: 'John Doe',
    roomNo: '101',
    categoryId: '2',
    title: 'No water supply in bathroom',
    description: 'There has been no water supply in the bathroom since morning. Please fix this urgently.',
    attachments: [],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress',
    assignedRepairerId: 'r1',
    upvotes: 15,
    voters: ['s2', 's3'],
  },
  {
    id: 'i2',
    studentId: 's2',
    studentName: 'Jane Smith',
    roomNo: '205',
    categoryId: '3',
    title: 'WiFi not working',
    description: 'Internet connection has been down for the last 3 days in Block B.',
    attachments: [],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    upvotes: 23,
    voters: ['s1', 's3'],
  },
  {
    id: 'i3',
    studentId: 's3',
    studentName: 'Bob Wilson',
    roomNo: '303',
    categoryId: '4',
    title: 'Broken chair',
    description: 'The study chair in my room is broken and needs replacement.',
    attachments: [],
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    assignedRepairerId: 'r2',
    upvotes: 5,
    voters: ['s1'],
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'i4',
    studentId: 's1',
    studentName: 'John Doe',
    roomNo: '101',
    categoryId: '1',
    title: 'Room needs cleaning',
    description: 'Room has not been cleaned for over a week.',
    attachments: [],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    upvotes: 3,
    voters: [],
  },
  {
    id: 'i5',
    studentId: 's2',
    studentName: 'Jane Smith',
    roomNo: '205',
    categoryId: '5',
    title: 'Fan not working',
    description: 'The ceiling fan is not working properly. Makes strange noise.',
    attachments: [],
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress',
    assignedRepairerId: 'r1',
    upvotes: 8,
    voters: ['s3'],
  },
  {
    id: 'i6',
    studentId: 's3',
    studentName: 'Bob Wilson',
    roomNo: '303',
    categoryId: '6',
    title: 'Washroom drain clogged',
    description: 'Washroom drain is clogged and water is not draining properly.',
    attachments: [],
    postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    assignedRepairerId: 'r2',
    upvotes: 12,
    voters: ['s1', 's2'],
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const notices: Notice[] = [
  {
    id: 'n1',
    title: 'Hostel Maintenance Schedule',
    content: 'Regular maintenance will be conducted every Sunday from 8 AM to 12 PM. Please cooperate.',
    postedByAdminId: 'a1',
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
  },
  {
    id: 'n2',
    title: 'Water Supply Interruption',
    content: 'Water supply will be interrupted on Saturday between 10 AM to 2 PM due to tank cleaning.',
    postedByAdminId: 'a1',
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
  },
  {
    id: 'n3',
    title: 'New WiFi Router Installation',
    content: 'New high-speed WiFi routers will be installed in all blocks next week to improve internet connectivity.',
    postedByAdminId: 'a2',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
  },
];
