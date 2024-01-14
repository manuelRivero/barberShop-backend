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
import { OnlineBarber, SocketBarber } from "./types/express";
const { Server } = require("socket.io");




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



let onlineBarbers: OnlineBarber[] = [];

function findTargetBarber(barberId: string): OnlineBarber | undefined {
  return onlineBarbers.find((barber: OnlineBarber) => barber.userId === barberId);
}

async function handleLogin({ user }: { user: SocketBarber }, socket:any): Promise<void> {
  console.log("log-in");

  // Add a delay to ensure the socket.on("log-in") event finishes processing before moving on
  await new Promise(resolve => setTimeout(resolve, 0));

  const newBarberList = onlineBarbers.filter((barber: OnlineBarber) => barber.userId !== user._id);
  newBarberList.push({ userId: user._id, socketId: socket.id });
  onlineBarbers = newBarberList;
  console.log("online-barbers", onlineBarbers)
}

io.on("connection", (socket: any) => {
  socket.on("set-turn", (data: { barber: SocketBarber; turnData: any }) => {
    const targetBarber = findTargetBarber(data.barber._id);
    if (targetBarber) {
      io.to(targetBarber.socketId).emit("add-turn", { data: data.turnData });
    }
  });

  socket.on("log-in", async (data: { user: SocketBarber}) => {
    await handleLogin(data, socket);
  });

  socket.on("remove-online-barber", (data: { user: SocketBarber}) => {
    onlineBarbers = onlineBarbers.filter((barber: OnlineBarber) => barber.userId !== data.user._id);
    console.log("online barbers", onlineBarbers);
  });
});


httpServer.listen(4000)