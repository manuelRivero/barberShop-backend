import express from "express";

declare global {
  namespace Express {
    interface Request {
      uid?: string;
      role?: string;
    }
  }
}


export interface OnlineBarber {
  userId: string;
  socketId: string;
}

export interface SocketBarber {
  _id: string;
}