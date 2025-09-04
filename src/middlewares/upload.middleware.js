const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_BASE = path.join(process.cwd(), "uploads", "hostels");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // ensure directory exists
      fs.mkdirSync(UPLOAD_BASE, { recursive: true });
      cb(null, UPLOAD_BASE);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });
module.exports = upload;
