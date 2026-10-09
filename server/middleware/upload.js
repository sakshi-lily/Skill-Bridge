import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|svg|pdf|doc|docx|txt|zip|rar|tar|gz|json|md/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimeRegex = /(image\/.*|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.*|text\/.*|application\/zip|application\/x-zip-compressed|application\/octet-stream|application\/json)/;
  const mimetype = mimeRegex.test(file.mimetype);

  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('File upload blocked: Only documents, images, text, and archive formats are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter,
});
