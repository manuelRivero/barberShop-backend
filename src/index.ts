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
import { OnlineUsers, SocketUsers } from "./types/express";
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



let onlineUsers: OnlineUsers[] = [];

function findTargetUser(id: string): OnlineUsers | undefined {
  return onlineUsers.find((barber: OnlineUsers) => barber.userId === id);
}


async function handleLogin({ user }: { user: SocketUsers }, socket:any): Promise<void> {
  console.log("log-in");

  // Add a delay to ensure the socket.on("log-in") event finishes processing before moving on
  await new Promise(resolve => setTimeout(resolve, 0));

  const newUserList = onlineUsers.filter((e: OnlineUsers) => e.userId !== user._id);
  newUserList.push({ userId: user._id, socketId: socket.id });
  onlineUsers = newUserList;
}

io.on("connection", (socket: any) => {
  socket.on("set-turn", (data: { barber: SocketUsers; turnData: any }) => {
    const targetBarber = findTargetUser(data.barber._id);
    if (targetBarber) {
      io.to(targetBarber.socketId).emit("add-turn", { data: data.turnData });
    }
  });

  socket.on("cancel-turn", (data: { id: string}) => {
    const targetUser = findTargetUser(data.id);
    console.log("targetUser cancel turn", targetUser)
    if (targetUser) {
      io.to(targetUser.socketId).emit("canceled-turn");
    }
  });

  socket.on("log-in", async (data: { user: SocketUsers}) => {
    await handleLogin(data, socket);
  });

  socket.on("remove-online-user", (data: { user: SocketUsers}) => {
    onlineUsers = onlineUsers.filter((user: OnlineUsers) => user.userId !== data.user._id);
  });
});


httpServer.listen(4000)