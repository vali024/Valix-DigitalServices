import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getAllPortfolioItems, 
  getPortfolioItemById, 
  createPortfolioItem, 
  updatePortfolioItem, 
  deletePortfolioItem 
} from '../controllers/portfolioController.js';
import adminAuth from '../middleware/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filter for image and video files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    // Videos
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime'
  ];
  
  const allowedExtensions = /\.(jpeg|jpg|png|webp|gif|mp4|avi|mov|wmv|flv|webm)$/i;
  
  const mimetypeValid = allowedMimeTypes.includes(file.mimetype);
  const extValid = allowedExtensions.test(file.originalname);

  if (mimetypeValid && extValid) {
    return cb(null, true);
  }
  
  cb(new Error('Only image files (JPEG, PNG, WebP, GIF) and video files (MP4, AVI, MOV, WMV, WebM) are allowed!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50000000 } // 50MB limit for videos
});

// Public routes
router.get('/', getAllPortfolioItems);
router.get('/:id', getPortfolioItemById);

// Admin routes (protected)
router.post('/', adminAuth, upload.single('image'), createPortfolioItem);
router.put('/:id', adminAuth, upload.single('image'), updatePortfolioItem);
router.delete('/:id', adminAuth, deletePortfolioItem);

export default router;
