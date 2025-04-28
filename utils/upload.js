import multer from 'multer';

const storageProfile = multer.diskStorage({
    destination : function(req, file, cb){
        const uploadDir = 'uploads/Profiles'
        cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
export const Image = multer({storage : storageProfile}).single('photo');

const storageForBill = multer.diskStorage({
  destination : function(req, file, cb){
      const uploadDir = 'uploads/bills'
      cb(null,uploadDir);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});
export const ExpenseBillImg = multer({storage : storageForBill}).single('billPhoto');

const storageForPayment = multer.diskStorage({
  destination : function(req, file, cb){
      const uploadDir = 'uploads/payment'
      cb(null,uploadDir);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});
export const PaymentImg = multer({storage : storageForPayment}).single('paymentAttachment');

// const storageHostelImg = multer.diskStorage({
//     destination : function(req, file, cb){
//         const uploadDir = 'uploads/HostelImages'
//         cb(null,uploadDir);
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });
// export const HostelImage = multer({storage : storageHostelImg}).array('photo', 10);

const storageRoomImg = multer.diskStorage({
    destination : function(req, file, cb){
        const uploadDir = 'uploads/RoomImages'
        cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
export const RoomImage = multer({storage : storageRoomImg}).array('roomPhotos', 10);


const storageForAadharImg = multer.diskStorage({
    destination : function(req, file, cb){
        const uploadDir = 'uploads/students'
        cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const StudnetAadharImg = multer({storage : storageForAadharImg}).single('aadharcardphoto');;

const storageForProfile = multer.diskStorage({
    destination : function(req, file, cb){
        const uploadDir = 'uploads/students'
        cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const StudentImages = multer({storage : storageForProfile}).single('studentphoto');


// Define storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'hostelphoto') {
      cb(null, 'uploads/hostels');
    } else if (file.fieldname === 'aadharphoto') {
      cb(null, 'uploads/customers');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const combinedUpload = upload.fields([
  { name: 'hostelphoto', maxCount: 1 },
  { name: 'aadharphoto', maxCount: 1 }
]);

export default combinedUpload;

// Storage configuration for student photo and aadhar card photo
const storagestudent = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = 'uploads/students';
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  // Multer middleware to handle both fields
  export const uploadStudent = multer({ storage: storagestudent }).fields([
    { name: 'studentphoto', maxCount: 1 },
    { name: 'aadharcardphoto', maxCount: 1 },
  ]);









