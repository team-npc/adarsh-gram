// User Types
export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  firebaseUid?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  location: UserLocation;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  loginType: 'internal' | 'google_oauth';
}

export type UserRole = 
  | 'system_admin' 
  | 'district_admin' 
  | 'block_officer' 
  | 'village_reporter' 
  | 'assessor' 
  | 'viewer';

export interface UserLocation {
  state: string;
  district: string;
  block?: string;
  village?: string;
}

// Village Types
export interface Village {
  id: string;
  name: string;
  state: string;
  district: string;
  block: string;
  pincode: string;
  totalPopulation: number;
  scPopulation: number;
  scPercentage: number;
  isEligible: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  registrationDate: Date;
  lastUpdated: Date;
  status: VillageStatus;
}

export type VillageStatus = 'registered' | 'under_assessment' | 'in_development' | 'adarsh_gram';

// Assessment Types
export interface Assessment {
  id: string;
  villageId: string;
  assessorId: string;
  focusArea: FocusArea;
  criteria: AssessmentCriteria[];
  overallScore: number;
  gapLevel: GapLevel;
  recommendations: string[];
  supportingDocuments: string[];
  assessmentDate: Date;
  status: AssessmentStatus;
}

export type FocusArea = 
  | 'education' 
  | 'healthcare' 
  | 'sanitation' 
  | 'connectivity' 
  | 'drinking_water' 
  | 'electricity' 
  | 'skill_development' 
  | 'livelihood';

export type GapLevel = 'critical' | 'moderate' | 'minor' | 'adequate';
export type AssessmentStatus = 'draft' | 'completed' | 'reviewed';

export interface AssessmentCriteria {
  id: string;
  criterion: string;
  score: number;
  maxScore: number;
  notes?: string;
}

// Project Types
export interface Project {
  id: string;
  villageId: string;
  name: string;
  focusArea: string;
  description: string;
  budget: number;
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  completionPercentage: number;
  milestones: Milestone[];
  status: ProjectStatus;
}

export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'delayed';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  isCompleted: boolean;
}

// Problem Report Types
export interface ProblemReport {
  id: string;
  reporterId: string;
  villageId: string;
  title: string;
  description: string;
  category: FocusArea;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  priority: Priority;
  status: ProblemStatus;
  attachments: string[];
  reportedDate: Date;
  lastUpdated: Date;
  assignedTo?: string;
  resolutionNotes?: string;
  canEdit: boolean;
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ProblemStatus = 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  location: UserLocation;
}

export interface GoogleAuthRequest {
  firebaseToken: string;
  userInfo: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: UserRole;
    location: UserLocation;
  };
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Password Reset Types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database Types
export interface DatabaseUser extends Omit<User, 'location'> {
  state: string;
  district: string;
  block?: string;
  village?: string;
}