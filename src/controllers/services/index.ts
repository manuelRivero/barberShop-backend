import cloudinary from "../../helpers/imageUpload/index";
import { NextFunction, Request, Response } from "express";
import Service from "../../models/services";
import mongoose from "mongoose";
import { UploadedFile } from "express-fileupload";

export const createService = {
  check: async (req: Request, res: Response, next: NextFunction) => {},
  do: async (req: Request, res: Response, next: NextFunction) => {
    const { role, uid } = req;
    const { duration, price, description, name } = req.body;
    const images: UploadedFile | UploadedFile[] | undefined = req.files?.image;

    if (!images) {
      return res.status(400).send("No files were uploaded.");
    }

    const service = new Service({
      duration,
      price,
      description,
      name,
      barber: uid,
    });

    const imagesArray: UploadedFile[] = Array.isArray(images)
      ? images
      : [images];

    if (images) {
      const uploadPromises = imagesArray?.map(async (element) => {
        return cloudinary.uploader.upload(
          // @ts-ignore
          element.tempFilePath,
          { folder: "services" }
        );
      });

      try {
        const uploadResponses = await Promise.all(uploadPromises);
        uploadResponses.forEach((element: any) => {
          service.images.push({
            url: element.secure_url,
            publicId: element.public_id,
          });
        });
      } catch {
        return res.status(500).json({
          ok: false,
          error: "Error al subir la imagen, el servicio no se guardo.",
        });
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
    const { duration, price, description, name, id, imageForDelete } = req.body;
    const images: UploadedFile | UploadedFile[] | undefined = req.files?.image;

    const targetService = await Service.findById(id);
    console.log("files.image", files?.image);

    if (!targetService) {
      return res.status(404).json({
        ok: false,
        error: "No se encontró el servicio",
      });
    }

    if (images) {
      const imagesArray: UploadedFile[] = Array.isArray(images)
        ? images
        : [images];
      const uploadPromises = imagesArray?.map(async (element) => {
        return cloudinary.uploader.upload(
          // @ts-ignore
          element.tempFilePath,
          { folder: "services" }
        );
      });

      try {
        const uploadResponses = await Promise.all(uploadPromises);
        uploadResponses.forEach((element: any) => {
          targetService.images.push({
            url: element.secure_url,
            publicId: element.public_id,
          });
        });
      } catch {
        return res.status(500).json({
          ok: false,
          error: "Error al subir la imagen, el servicio no se guardo.",
        });
      }
    }
    if (imageForDelete){
      console.log("imagesForDelete", imageForDelete)

      const deletePromises = imageForDelete?.map( (element: any) => {
        targetService.images = targetService.images.filter( e => e.publicId !== element)
        return cloudinary.uploader.destroy(element);
        
      })

      await Promise.all(deletePromises);
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
