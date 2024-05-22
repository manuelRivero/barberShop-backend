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
    port: 12778,
  },
});

(async () => {
  // Connect to redis server
  await redisClient.connect();
})();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const socketHandler = (server: Server): SocketIOServer => {
  const io = new SocketIOServer(server);

  io.on("connection", async (socket: Socket): Promise<void> => {
    socket.on(
      "set-turn",
      async (data: { barber: SocketUser; turnData: any, userData:any }) => {
        const targetBarber = await findTargetUser(data.barber._id, redisClient);
        if (targetBarber) {
          io.to(targetBarber.socketId).emit("add-turn", {
            data: data.turnData,
            user: data.userData
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

    socket.on("canceled-turn", async (data: { id: string }) => {
      console.log("socket de cancelacion", data);
      const targetUser = await findTargetUser(data.id, redisClient);
      if (targetUser) {
        io.to(targetUser.socketId).emit("cancel-turn", {
          data: data.id,
        });
      }
    });

    socket.on("phone-changed", async (data: { turnData: any }) => {
      console.log("socket de cambio de telefono", data);
    });

    socket.on(
      "cancelation",
      async (data: { id: string; turnId: string; date: string; user: any }) => {
        console.log("socket de cancelacion por el usuario", data);
        const targetUser = await findTargetUser(data.id, redisClient);
        if (targetUser) {
          io.to(targetUser.socketId).emit("cancel-by-user", {
            data: { turnId: data.turnId, date: data.date, user: data.user },
          });
        }
      }
    );
    socket.on(
      "phone-request",
      async (data: { id: string }) => {
        const targetUser = await findTargetUser(data.id, redisClient);
        if (targetUser) {
          io.to(targetUser.socketId).emit("phone-requested");
        }
      }
    );
  });


  io.on("disconnect", async () => {
    await redisClient.quit();
  });

  return io;
};
