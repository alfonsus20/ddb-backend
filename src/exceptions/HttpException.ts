import { ValidationError } from "express-validator";

export class HttpException extends Error {
  public status: number;
  public message: string;
  public data: ValidationError[];

  constructor(status: number, message: string, data?: ValidationError[]) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data || [];
  }
}
