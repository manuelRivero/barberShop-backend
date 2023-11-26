import { Application } from "express";
import http from "http";
const { Server } = require("socket.io");

const onlineBarbers : any = []

export const io = (app: Application) => {
  const httpServer = http.createServer(app);

  httpServer.listen(4000, () => {
    console.log("server running on port 4000");
  });

  return new Server(httpServer, { cors: { origin: "*" } });
};

export const ioEvents = (io: any) => {
  io.on("connection", (socket: any) => {
    socket.on("log-in", (user:any)=>{
      onlineBarbers.push({userId:user._id, socketId: socket.id})
    })

    socket.on("set-turn", ({barber, turnData}:any)=>{
      const targetBarber = onlineBarbers.find((e:any) => e.userId === barber._id);
      if(targetBarber){
        io.to(socket.id).emit('private', {data: turnData});
      }
    })

  });
};
