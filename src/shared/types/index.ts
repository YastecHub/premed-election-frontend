export type VerificationStatus = 'unverified' | 'verified' | 'pending_manual_review' | 'rejected' | 'pending';
export type ElectionStatus = 'not_started' | 'active' | 'paused' | 'ended';
export type AdminRole = 'super_admin' | 'moderator';

// Domain entities
export interface User {
  _id: string;
  matricNumber: string;
  fullName: string;
  email: string;
  department: string;
  verificationStatus: VerificationStatus;
  hasVoted: boolean;
  ocrConfidenceScore: number;
  uploadedDocumentUrl?: string;
  rejectionReason?: string;
  createdAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Candidate {
  _id: string;
  name: string;
  categoryId: string;
  category?: Category;
  department: string;
  photoUrl: string;
  manifesto: string;
  voteCount: number;
  isActive: boolean;
  color: string;
}

export interface Admin {
  _id: string;
  username: string;
  role: AdminRole;
}

// API response types
export interface VerificationResult {
  success: boolean;
  confidence: number;
  extractedData?: {
    matricMatch: boolean;
    nameMatch: boolean;
    deptMatch: boolean;
  };
  reason?: string;
}

export interface VoteResult {
  success: boolean;
  message: string;
  code?: string;
}

export interface ElectionState {
  status: ElectionStatus;
  endTime?: Date;
  isActive: boolean;
  isPaused: boolean;
}

export interface CandidateRanking {
  candidate: Candidate;
  rank: number;
  percentage: number;
  status: 'leading' | 'second' | 'third' | 'other';
}

// Form types
export interface RegistrationForm {
  matricNumber: string;
  fullName: string;
  department: string;
  email: string;
}

export interface AccessCodeForm {
  fullName: string;
  code: string;
}

export interface AdminLoginForm {
  username: string;
  password: string;
}

export interface CategoryForm {
  name: string;
  description?: string;
}

export interface CandidateForm {
  name: string;
  categoryId: string;
  department: string;
  manifesto: string;
  color: string;
  photo?: File;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Error types
export interface ApiError extends Error {
  code?: string;
  status?: number;
}