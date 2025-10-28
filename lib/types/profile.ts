export interface LegalGuardian {
  _id?: string;
  firstname: string;
  lastname: string;
  idNumber: string;
  relationship: 'parent' | 'legal_guardian' | 'grandparent' | 'uncle' | 'aunt' | 'sibling' | 'other';
  phone: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  email: string;
  address: string;
  country: string;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface Profile {
  _id: string;
  user: string; // User ID reference
  firstname: string;
  lastname: string;
  idNumber: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthday: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  photo?: string;
  legalGuardian: LegalGuardian[];
  socialMedia: SocialMedia;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  age?: number;
  isMinor?: boolean;
  fullName?: string;
}

export interface ProfileFormData {
  firstname: string;
  lastname: string;
  idNumber: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthday: string;
  photo?: string;
  socialMedia: SocialMedia;
  legalGuardian: LegalGuardian[];
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: Profile;
  };
}

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
} 