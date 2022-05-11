export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  majority: string;
  entryYear: number;
  graduationYear?: number;
  thesisURL?: string;
  profileImageURL?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
}
