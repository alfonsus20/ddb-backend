import { CommonQuery } from "./index.interface";

export interface UserPayload {
  name: string;
  majority: string;
  entryYear: number;
  graduationYear?: number;
  thesisTitle?: string;
  thesisURL?: string;
  profileImageURL?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  isGraduated?: boolean;
}

export interface UserQuery extends CommonQuery {
  name?: string;
  isGraduated?: boolean;
  isVerified?: boolean;
}
