const multer = require("multer")
const {GridFsStorage} = require ("multer-gridfs-storage")
const dotenv = require("dotenv")
dotenv.config();

const storage = GridFsStorage({
  url: `${process.env.MONGO_DB}`,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png" , "image/jpg" , "image/jpeg"];

    if(match.indexOf(file.mimeType) === -1){
        return `${Date.now()}-file-${file.originalname}`;
    }

    return {
        bucketName: "photos",
        filename: `${Date.now()}-file-${file.originalname}`
    }
  }
});

module.exports = multer({storage});