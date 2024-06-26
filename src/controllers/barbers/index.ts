import { OnlineUser } from "./../../types/express/index.d";
import { NextFunction, Request, Response } from "express";
import user from "../../models/user";
import mongoose, { set } from "mongoose";
import { io } from "../..";
import { redisClient } from "../../socket";
import bcript from "bcryptjs";

export const getBarbers = {
  do: async (req: Request, res: Response) => {
    const { uid } = req;
    const { isAdmin } = req.query;
    let match: any = {};

    if (!isAdmin) {
      match = { isActive: true };
    }
    const barbers = await user.aggregate([
      {
        $match: {
          $and: [
            { $or: [{ role: "barber" }, { role: "admin-barber" }] },
            match,
          ],
          _id: { $ne: new mongoose.Types.ObjectId(uid) },
        },
      },
    ]);
    console.log("barbers", barbers);
    res.json({
      ok: true,
      barbers,
    });
  },
};

export const getBarberDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const barber = await user.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $project: {
        name: 1,
        lastname: 1,
        email: 1,
        role: 1,
        bio: 1,
        commission: 1,
        avatar: 1,
        isActive: 1,
      },
    },
  ]);
  console.log("barbers", barber);
  res.json({
    ok: true,
    barber,
  });
};

export const disableBarber = async (req: Request, res: Response) => {
  const { barber } = req.body;
  const targetBarber = await user.findById(new mongoose.Types.ObjectId(barber));

  if (!targetBarber) {
    return res
      .status(400)
      .json({ ok: false, message: "Barbero no encontrado" });
  } else {
    targetBarber.isActive = !targetBarber.isActive;
    console.log("Save barber active:", targetBarber.isActive);

    await targetBarber.save();

    const onlineUsers = await redisClient.get("online-users");
    if (onlineUsers) {
      const parsedOnlineUsers = JSON.parse(onlineUsers);
      const targetOnlineBarber = parsedOnlineUsers.find(
        (user: OnlineUser) => user.userId === targetBarber._id.toString()
      );
      console.log("targetOnlineBarber", targetOnlineBarber);

      if (targetOnlineBarber) {
        io.to(targetOnlineBarber.socketId).emit("status-change", {
          status: targetBarber.isActive,
        });
      }
    }

    return res.status(200).json({ ok: true });
  }
};

export const createBarber = async (req: Request, res: Response) => {
  const { name, lastname, email, password, commission } = req.body;
  const barber = new user({
    name,
    lastname,
    email,
    password,
    commission,
    role: "barber",
    isActive: true,
  });

  const salt = bcript.genSaltSync();
  barber.password = bcript.hashSync(password, salt);

  await barber.save();
  console.log("barber", barber);
  res.json({
    ok: true,
    barber,
  });
};

export const editBarber = async (req: Request, res: Response) => {
  const { id, name, lastname, email, password, commission } = req.body;
  const targetBarber = await user.findById(id);

  if (!targetBarber) {
    return res.status(404).json({
      ok: false,
      error: "No se encontró el barbero",
    });
  }

  targetBarber.name = name;
  targetBarber.lastname = lastname;
  targetBarber.email = email;
  targetBarber.password = password;
  targetBarber.commission = commission;

  try {
    await targetBarber.save();
    console.log("barber", targetBarber);
    return res.json({
      ok: true,
      targetBarber,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ ok: false });
  }
};
