import express from "express";

declare global {
  namespace Express {
    interface Request {
      uid?: string;
      role?: string;
    }
  }
}


export interface OnlineUser {
  userId: string;
  socketId: string;
}

export interface SocketUser {
  _id: string;
}