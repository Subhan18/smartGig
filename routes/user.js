const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const Video = require("../models/image");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
require("dotenv").config();

router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        status: "failed",
        message: "Invalid credentials : you must register",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({
        status: "failed",
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: user._id,
      },
      `${process.env.JWT_SECRET}`
    );
    return res.json({
      status: "success",
      data: {
        token,
      },
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Internal Error",
    });
  }
});

router.post("/register", async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });
    res.json({
      status: "success",
      message: "sign up successful",
    });
  } catch (e) {
    res.json({
      status: "failed",
      message: e.message,
    });
  }
});

// const upload = multer({
//   limits: {
//     fileSize: 2000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please upload an image"));
//     }
//     cb(undefined, true);
//   },
// });

// router.post(
//   "/upload",

//   upload.single("avatar"),
//   async (req, res) => {
//     var user = req.body;
//     req.user.avatar = req.file.buffer;
//     await req.user.save();
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// new

const Storage2 = multer.diskStorage({
  destination: "videos",
  filename: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4)$/)) {
      return cb(new Error("Please upload a video"));
    }
    cb(null, file.originalname);
  },
});

const upload2 = multer({
  limits: {
    fileSize: 10000000,
  },
  storage: Storage2,
}).single("testVideo");

router.post("/upload/video", auth, (req, res) => {
  upload2(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newVideo = new Video({
        video: {
          data: req.file.filename,
          contentType: "video/mp4",
        },
      });
      newVideo
        .save()
        .then(() => res.send("successfully uploaded"))
        .catch((err) => console.log(err));
    }
  });
});

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, file.originalname);
  },
});

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  storage: Storage,
}).single("testImage");

router.post("/upload", auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImg = new User({
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImg
        .save()
        .then(() => res.send("successfully uploaded"))
        .catch((err) => console.log(err));
    }
  });
});

module.exports = router;
