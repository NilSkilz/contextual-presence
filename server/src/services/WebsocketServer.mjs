import { Server } from "socket.io";

const init = (httpServer) => {
  console.log("Initialising own websocket server");
  const io = new Server(httpServer, {
    // options
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("WebSocket connected");
    // ...
  });

  return io;
};

export default init;
