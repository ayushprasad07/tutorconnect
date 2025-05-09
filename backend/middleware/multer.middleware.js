const multer = require('multer');


// Define storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Initialize multer
const upload = multer({ storage: storage });

module.exports = { upload };
