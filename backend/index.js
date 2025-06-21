import express from "express";
import "dotenv/config";

import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./db/ConnectMongoDB.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./lib/socket.js";
// imports End

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "10mb" })); // Allow up to 10MB JSON
app.use(express.urlencoded({ extended: true })); //to parse from data(urlencoded)
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes Setup
app.get("/", (req, res) => {
  res.send("API is Working");
});

// Running App
const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
