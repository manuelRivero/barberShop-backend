import express from "express";

declare global {
  namespace Express {
    interface Request {
      uid?: string;
      role?: string;
    }
  }
}


export interface OnlineUsers{
  userId: string;
  socketId: string;
}

export interface SocketUsers {
  _id: string;
}