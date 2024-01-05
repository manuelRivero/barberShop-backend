import { NextFunction, Request, Response } from "express";
import Review from "../../models/reviews";
import mongoose from "mongoose";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    const {barber, score, comment} = req.body;
     const { uid } = req;
console.log("data", barber, score, comment)

  try {
    const data = new Review({
        barber,
        score,
        comment,
        user:uid
    })
    await data.save()
    res.json(data);
  } catch (error) {
    res.json({ error: "No se pudo crear la calificación" });
  }
};

export const getReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
      const {barber, page} = req.query;
      const parsedPage = parseInt(page ? (page as string) : "0");
      const pageSize = 5

  
    try {
      const data = await Review.aggregate([
        {$match:{
            barber: new mongoose.Types.ObjectId(barber as string)
        }},
        {$lookup:{
            from:"users",
            localField:"barber",
            foreignField:"_id",
            as:"barberData"
        }},
        {$lookup:{
            from:"users",
            localField:"user",
            foreignField:"_id",
            as:"userData"
        }},
        { $facet    : {
            metadata: [ { $count: "total" }, { $addFields: { page: parsedPage   }} ],
            data: [ { $sort: {createdAt: -1} }, { $limit: parsedPage * pageSize} ] // add projection here wish you re-shape the docs
        } },
        {$addFields:{
            metadata:{
                totalPages: { $ceil: { $divide: [ { $arrayElemAt: [ "$metadata.total",  0 ] }, pageSize]} }
            }
        }}
      ])
      res.json({data:data[0].data, metadata:data[0].metadata});
    } catch (error) {
      res.json({ error: "No se pudo obtener la información" });
    }
  };
  
