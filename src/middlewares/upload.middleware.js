const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // choose subfolder based on route path (tiffins / hostels / others)
      const base = (req.baseUrl || req.originalUrl || "").toLowerCase();
      let sub = "others";
      if (base.includes("/tiffins")) sub = "tiffins";
      else if (base.includes("/hostels")) sub = "hostels";
      const dest = path.join(UPLOAD_ROOT, sub);
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({ storage });
module.exports = upload;
