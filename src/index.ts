import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import http from "http";
import { dbConnection } from "./db/index";
import dotenv from "dotenv";
import authRoutes from "./routes/auth/index";
import turnsRoutes from "./routes/turns/index";
import servicesRoutes from "./routes/services/index";
import barbersRoutes from "./routes/barbers/index";
import statsRoutes from "./routes/stats/index";
import reviewsRoutes from "./routes/reviews/index";
import galleryRoutes from "./routes/gallery/index";


import { errorHandler } from "./middleware/errorHandler/error-handler";
import cookieParser from "cookie-parser";
const { Server } = require("socket.io");

let onlineBarbers: any = [];




const app: Application = express();

dotenv.config();
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

const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket: any) => {

  socket.on("set-turn", ({ barber, turnData }: any) => {
    console.log("online barbers", onlineBarbers)
    const targetBarber = onlineBarbers.find(
      (e: any) => e.userId === barber._id
    );
    console.log("target barber", targetBarber)
    if (targetBarber) {
      io.to(targetBarber.socketId).emit("add-turn", { data: turnData });
    }
    
  });
  

  socket.on("log-in", ({user}: any) => {
    console.log("log-in");
    const newBarverList = onlineBarbers.filter((e:any) => e.userId !== user._id)
    newBarverList.push({ userId: user._id, socketId: socket.id });
    onlineBarbers = newBarverList
  });

  socket.on("remove-online-barber", ({user}:any) => {
    onlineBarbers = onlineBarbers.filter( (e:any) => e.userId !== user._id)
    console.log("online barbers", onlineBarbers)
  });
});


httpServer.listen(4000)