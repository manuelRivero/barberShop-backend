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
    console.log("files.image", files?.image);

    if (files) {
      Object.values(files);
      for (let element of Object.values(files)) {
        try {
          const imageUrl = await cloudinary.uploader.upload(
            // @ts-ignore
            element.tempFilePath,
            { folder: "services" }
          );
          service.images.push(imageUrl.secure_url)
        } catch {
          return res.status(500).json({
            ok: false,
            error: "Error al subir la imagen, el servicio no se guardo.",
          });
        }
      }
    }
    await service.save();
    console.log("service", service);
    res.json({
      ok: true,
      service,
    });
  },
};

export const editService = {
  check: async (req: Request, res: Response, next: NextFunction) => {},
  do: async (req: Request, res: Response, next: NextFunction) => {
    const { role, uid, files } = req;
    const { duration, price, description, name, id } = req.body;

    const targetService = await Service.findById(id);
    console.log("files.image", files?.image);

    if (!targetService) {
      return res.status(404).json({
        ok: false,
        error: "No se encontró el servicio",
      });
    }

    if (files) {
      Object.values(files);
      for (let element of Object.values(files)) {
        try {
          const imageUrl = await cloudinary.uploader.upload(
            // @ts-ignore
            element.tempFilePath,
            { folder: "services" }
          );
          targetService.images.push(imageUrl.secure_url)
        } catch {
          return res.status(500).json({
            ok: false,
            error: "Error al subir la imagen, el servicio no se guardo.",
          });
        }
      }
    }
    targetService.name = name;
    targetService.duration = duration;
    targetService.price = price;
    targetService.description = description;

    try {
      await targetService.save();
      console.log("service", targetService);
      return res.json({
        ok: true,
        targetService,
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ ok: false });
    }
  },
};

export const getServices = {
  do: async (req: Request, res: Response) => {
    console.log("service controller");
    const { role, uid } = req;
    const { page = "0" } = req.query;
    const pageSize: number = 10;
    const parsedPage = parseInt(page ? (page as string) : "0");

    const services = await Service.find({
      barber: new mongoose.Types.ObjectId(uid),
    })
      .skip(parsedPage * pageSize)
      .limit(pageSize);
    console.log("services", services);
    res.json({
      ok: true,
      services,
    });
  },
};

export const getBarberServices = {
  do: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = "0" } = req.query;
    const pageSize: number = 10;
    const parsedPage = parseInt(page ? (page as string) : "0");

    const services = await Service.find({
      barber: new mongoose.Types.ObjectId(id),
    })
      .skip(parsedPage * pageSize)
      .limit(pageSize);
    res.json({
      ok: true,
      services,
    });
  },
};
