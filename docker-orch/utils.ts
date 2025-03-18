import { Response } from "express";
import { ApiResponse } from "./types";
export function formattedResponse<T>(status:number,data:T|null,message:string)
:ApiResponse<T>
{
    return {
        status,data,message
    }
};


export function sendResponse<T>(res: Response, statusCode:number, data:T|null, message:string) :Response {
  return res.status(statusCode).json({
    status: statusCode,
    data: data,
    message: message,
  });
}

  