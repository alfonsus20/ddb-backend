import { CommonQuery } from "./common.interface";

export interface UserQuery extends CommonQuery {
  name?: string;
  isGraduated?: boolean;
  isVerified?: boolean;
}
