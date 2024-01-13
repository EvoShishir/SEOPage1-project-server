// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const cors = require("cors");

const app = express();
const port = 3001;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(cors());

app.post("/upload", upload.array("attachments"), (req, res) => {
  console.log("Files uploaded successfully!");
  res.sendStatus(200);
});

app.get("/files", async (req, res) => {
  try {
    const files = await fs.readdir("uploads/");
    res.json({ files });
  } catch (error) {
    console.error("Error getting file list:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Serve individual files
app.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
