// import express from 'express';
// import mongoclient from 'mongodb'

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require('path');

const User = require("./models/User");

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static("uploads"));
// app.use(express.static("app"));


// Use native Node.js env variables
// const MONGO_URI = process.env.MONGO_URI;
let databaseName = "my-app-db"
const mongoUrlLocal = `mongodb://root:root@localhost:27017/${databaseName}?authSource=admin` // to run on local machine
// to run inside container we replace 'localhost' to mongodb because 'localhost' doesn't work between containers as 'localhost' inside container refers to itself.
const MONGO_URI = `mongodb://root:root@mongodb:27017/${databaseName}?authSource=admin` 

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ---------------- MULTER CONFIG ---------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

/* ---------------- CREATE USER ---------------- */

app.post("/users", upload.fields([
  { name: "photos", maxCount: 5 },
  { name: "videos", maxCount: 5 }
]), async (req, res) => {
  try {
    const photoPaths = req.files?.photos?.map(f => f.path) || [];
    const videoPaths = req.files?.videos?.map(f => f.path) || [];

    const newUser = await User.create({
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      address: req.body.address,
      location: req.body.location,
      photos: photoPaths,
      videos: videoPaths
    });

    res.json({ message: "User saved successfully", data: newUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- UPDATE USER ---------------- */

app.put("/users/:id", upload.fields([
  { name: "photos", maxCount: 5 },
  { name: "videos", maxCount: 5 }
]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update text fields
    user.name = req.body.name ?? user.name;
    user.mobile = req.body.mobile ?? user.mobile;
    user.email = req.body.email ?? user.email;
    user.address = req.body.address ?? user.address;
    user.location = req.body.location ?? user.location;

    // Replace files only if new ones uploaded
    if (req.files?.photos) {
      user.photos = req.files.photos.map(f => f.path);
    }

    if (req.files?.videos) {
      user.videos = req.files.videos.map(f => f.path);
    }

    await user.save();

    res.json({ message: "User updated successfully", data: user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET USERS ---------------- */

app.get("/users", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// app.get('/', (req, res)=>{
//     res.send("Welcome to Docker Compose")
// });


/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});