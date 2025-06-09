const { Router } = require('express');
const multer = require('multer');
const UploadService = require('../services/uploadService');
const UploadController = require('../controllers/uploadController');
const { ConfigService } = require('@nestjs/config');

const router = Router();
const upload = multer();

const configService = new ConfigService(); 
const uploadService = new UploadService(configService);
const uploadController = new UploadController(uploadService);

router.post('/map', upload.single('file'), async (req, res, next) => {
  try {
    const result = await uploadController.uploadMap(req.file);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;