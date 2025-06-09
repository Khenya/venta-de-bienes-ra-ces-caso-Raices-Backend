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

router.get('/maps', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 1; 
    const skip = (page - 1) * limit;

    const total = await MapModel.countDocuments();
    const maps = await MapModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({
      maps,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;