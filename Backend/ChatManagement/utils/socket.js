const { Server } = require("socket.io");

let io;

exports.initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  console.log("WebSocket server initialized");

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join conversation rooms
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation room: ${conversationId}`);
    });

    // Notify room on new message
    socket.on("newMessage", ({ conversationId, message }) => {
      // Attach conversationId to the message object before emitting
      const messageWithConversation = { ...message, conversationId };
      io.to(conversationId).emit("newMessage", messageWithConversation);
      console.log(
        `New message sent to room ${conversationId}:`,
        messageWithConversation
      );
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

exports.getIO = () => io;
