// socketHandler.js
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import { createClient } from "redis";
import { SocketUser } from "../types/express";
import { findTargetUser, handleLogin, handleLogout } from "./helpers";

export const redisClient = createClient({
    password: `${process.env.REDIS_PASSWORD}`,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12778
    }
});

(async () => {
  // Connect to redis server
  
})();

redisClient.on("error", (err) => console.log("Redis Client Error", err));


export const socketHandler = (server: Server): SocketIOServer => {
  const io = new SocketIOServer(server);

  io.on("connection", async (socket: Socket): Promise<void> => {
      await redisClient.connect();

    socket.on(
      "set-turn",
      async (data: { barber: SocketUser; turnData: any }) => {
        const targetBarber = await findTargetUser(data.barber._id, redisClient);
        if (targetBarber) {
          io.to(targetBarber.socketId).emit("add-turn", {
            data: data.turnData,
          });
        }
      }
    );

    socket.on("log-in", async (data: { user: SocketUser }) => {
      await handleLogin(data, socket, redisClient);
    });

    socket.on("remove-online-user", (data: { user: SocketUser }) => {
      handleLogout(data.user, redisClient);
    });
  });

  io.on("disconnect", async () => {
    await redisClient.quit();

  })

  return io;
};

(async () => {
  // disconnect to redis server
  await redisClient.quit();

})();