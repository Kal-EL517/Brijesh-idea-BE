import { Response } from "express";

export class ResponseUtil {
  static success(message: string, data: any = {}, statusCode = 200) {
    return { statusCode,success: true, message, data };
  }
  static error(res: Response, message: string, error: any = {}, statusCode = 500) {
    return { statusCode,success: false, message, error };
  }
}
