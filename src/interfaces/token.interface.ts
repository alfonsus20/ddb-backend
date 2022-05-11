import User from "../models/user.model";

export interface TokenPayload {
  user: User;
}
