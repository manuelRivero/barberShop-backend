import Gallery from "../../models/gallery";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cloudinary from "../../helpers/imageUpload/index";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { files, uid } = req;

  const gallery = new Gallery();
  try {
    const imageUrl = await cloudinary.uploader.upload(
      // @ts-ignore
      files?.image.tempFilePath,
      { folder: "barbers-gallery" }
    );
    gallery.barber = new mongoose.Types.ObjectId(uid)
    gallery.url = imageUrl.secure_url
    gallery.assetId = imageUrl.secure_url
    gallery.publicId = imageUrl.public_id

  } catch (err) {
    console.log("error al subir la imagen", err);

  }

  try {
    await gallery.save();
    res.json({ ok: true });

    console.log("gallery", gallery);
  } catch (error) {}
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id} = req.params;
  const { uid } = req;
  const {imageForDeletion} = req.body
  console.log("id", id)
  console.log("imageForDeletion", imageForDeletion)
  try {
    const imageUrl = await cloudinary.uploader.destroy(imageForDeletion);
    const deletedImage = await Gallery.findOneAndRemove({
      _id: new mongoose.Types.ObjectId(id),
    });

    res.json({ ok: true });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ ok: false });
  }
};

export const getImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { uid } = req;
  const images = await Gallery.aggregate([
    { $match: { barber: new mongoose.Types.ObjectId(uid) } },
  ]);

  res.json({ data: images });
};
