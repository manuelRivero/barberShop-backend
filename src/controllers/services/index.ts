import cloudinary from "../../helpers/imageUpload/index";
import { NextFunction, Request, Response } from "express";
import Service from "../../models/services";
import mongoose from "mongoose";

export const createService = {
  check: async (req: Request, res: Response, next: NextFunction) => {},
  do: async (req: Request, res: Response, next: NextFunction) => {
    const { role, uid, files } = req;
    const { duration, price, description, name } = req.body;

    const service = new Service({
      duration,
      price,
      description,
      name,
      barber: uid,
    });
    console.log("files.image", files?.image)
    try {
      const imageUrl = await cloudinary.uploader.upload(
        // @ts-ignore
        files.image.tempFilePath,
        { folder: "services" }
      );
      service.image = imageUrl.secure_url;
      service.imageName = imageUrl.display_name
    } catch {
      return res.status(500).json({
        ok: false,
        error: "Error al subir la imagen, el servicio no se guardo.",
      });
    }

    await service.save();
    console.log("service", service)
    res.json({
      ok: true,
      service,
    });
  },
};

export const getServices = {
  do: async (req: Request, res: Response) => {
    console.log("service controller")
    const { role, uid } = req;
    const { page = "0" } = req.query;
    const pageSize: number = 10;
    const parsedPage = parseInt(page ? (page as string) : "0");

    const services = await Service.find({ barber: new mongoose.Types.ObjectId(uid) })
      .skip(parsedPage * pageSize)
      .limit(pageSize);
      console.log("services", services)
    res.json({
      ok: true,
      services,
    });
  },
};

