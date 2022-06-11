import { ValidationError } from 'express-validator';

export default class HttpException extends Error {
  public status: number;

  public message: string;

  public data: ValidationError[] | string | null;

  constructor(status: number, message: string, data?: ValidationError[] | string | null) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data || null;
  }
}
