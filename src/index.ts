import './env';

import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import http from "http";
import { dbConnection } from "./db/index";
import authRoutes from "./routes/auth/index";
import turnsRoutes from "./routes/turns/index";
import servicesRoutes from "./routes/services/index";
import barbersRoutes from "./routes/barbers/index";
import statsRoutes from "./routes/stats/index";
import reviewsRoutes from "./routes/reviews/index";
import galleryRoutes from "./routes/gallery/index";

import { errorHandler } from "./middleware/errorHandler/error-handler";
import cookieParser from "cookie-parser";
import { redisClient, socketHandler } from "./socket";

const app: Application = express();

const corsOptions = {
  //To allow requests from client
  origin: "*",
  credentials: true,
  exposedHeaders: ["set-cookie"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
    preserveExtension: true,
    createParentPath: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/turns", turnsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/barbers", barbersRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/gallery", galleryRoutes);

app.use(errorHandler);

dbConnection();

const httpServer = http.createServer(app);


httpServer.listen(4000)

process.on("exit", function(){
  redisClient.quit();
});

export const io = socketHandler(httpServer)
