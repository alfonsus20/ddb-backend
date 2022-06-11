export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  name: string;
  majority: string;
  entryYear: number;
}

export interface UpdateUserDto {
  name?: string;
  majority?: string;
  entryYear?: number;
  graduationYear?: number;
  thesisURL?: string;
  thesisTitle?: string;
  isGraduated ?: boolean;
  profileImageURL?: string;
}
