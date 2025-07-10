// backend/src/routes/uploads.ts
import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a file.' });
  }
  res.status(200).send({ 
    message: 'File uploaded successfully', 
    file: `/uploads/${req.file.filename}`
  });
});

export default router;
