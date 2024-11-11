const grid = require("gridfs-stream");
const mongoose = require("mongoose");

const url = "http://localhost:5000";

const conn = mongoose.connection;

let gfs, gridFsBucket;
conn.once("open", () => {
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "fs",
  });

  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection;
});

const setImage = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });

    const readStream = gridFsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const uploadFileChat = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageURL = `${url}/file/${req.file.filename}`;

  return res.status(200).json(imageURL);
};

module.exports = { uploadFileChat, setImage };
