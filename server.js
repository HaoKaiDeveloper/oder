require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const connectDB = require("./connect/connectDB");

const authMiddleware = require("./middleware/authenticate");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const imgRoute = require("./routes/image");
const orderRoute = require("./routes/order");

app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/img", authMiddleware, imgRoute);
app.use("/order", orderRoute);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

connectDB(process.env.MONGO_URL);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("send_neworder", (data) => {
    socket.to(data.storeId).emit("receive_neworder", data);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server started on ${PORT}`));
