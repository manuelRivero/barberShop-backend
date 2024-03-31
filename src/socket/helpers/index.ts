import { OnlineUser, SocketUser } from "../../types/express";

export async function findTargetUser(
  userId: string,
  redisClient: any
): Promise<OnlineUser | undefined>{

    const onlineUsers = await redisClient.get("online-users");
    if (onlineUsers) {
      const parsedOnlineUsers = JSON.parse(onlineUsers);
      return parsedOnlineUsers.find((user: OnlineUser) => user.userId === userId);
    }
}

export async function handleLogin(
  { user }: { user: SocketUser },
  socket: any,
  redisClient: any
): Promise<void> {

  console.log("log-in");
  const onlineUsers = await redisClient.get("online-users");
  if (onlineUsers) {
    const parsedOnlineUsers = JSON.parse(onlineUsers);

    // Add a delay to ensure the socket.on("log-in") event finishes processing before moving on
    await new Promise((resolve) => setTimeout(resolve, 0));

    const newUserList = parsedOnlineUsers.filter(
      (barber: OnlineUser) => barber.userId !== user._id
    );

    newUserList.push({ userId: user._id, socketId: socket.id });
    await redisClient.set("online-users", JSON.stringify(newUserList));
    console.log("log in online-users from disk", newUserList)
  } else {
    await redisClient.set(
      "online-users",
      JSON.stringify([{ userId: user._id, socketId: socket.id }])
    );
    console.log("log in online-users new user", { userId: user._id, socketId: socket.id })

  }
}

export async function handleLogout( user:SocketUser, redisClient:any) {
    const onlineUsers = await redisClient.get("online-users");
    if (onlineUsers) {
      const parsedOnlineUsers = JSON.parse(onlineUsers);
      
      const newList = parsedOnlineUsers.filter((e: OnlineUser) => e.userId !== user._id);
      await redisClient.set(
        "online-users",
        JSON.stringify(newList)
      );
      console.log("logout online users", newList)
    }
}
