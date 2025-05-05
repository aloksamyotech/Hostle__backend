import fs from "fs";
import multer from "multer";
import path from "path";

const fileHandler = () => {
  //access storage for customize file name
  const uploadDir = path.join(process.cwd(), "uploads", "images");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  //file filtering and field filter
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "text/csv" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      console.log("File type is valid");
      cb(null, true);
    } else {
      console.log("invalid");
      cb({
        status: 400,
        message: "Only .jpg, .jpeg, .png, .csv files are supported!",
      });
    }
  };
  const upload = multer({
    //dest: "./uploads/",
    storage: storage,
    limits: {
      fileSize: 50 * 1024 * 1024, //50MB
    },
    fileFilter: fileFilter,
  }).fields([
    { name: "hostelphoto", maxCount: 1 },
    { name: "aadharphoto", maxCount: 1 },
    { name: "roomPhotos", maxCount: 3 },
    { name: "studentPhoto", maxCount: 1 },
    { name: "aadharPhoto", maxCount: 1 },
    { name: "billPhoto", maxCount: 1 },
    // { name: "csv", maxCount: 1 },
    // { name: "image", maxCount: 1 },
    // { name: "dealImage", maxCount: 1 },
    // { name: "companyImage", maxCount: 1 },
  ]);
  return upload;
};

export default fileHandler;
