const { Router } = require('express');
const multer = require('multer');
const UploadService = require('../services/uploadService');
const UploadController = require('../controllers/uploadController');
const { ConfigService } = require('@nestjs/config');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

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

const s3 = new S3Client({
  region: configService.get('AWS_REGION'),
  credentials: {
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
  },
});
const bucket = configService.get('AWS_BUCKET_NAME');

router.get('/maps', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 1; 
    const prefix = 'maps/';

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const data = await s3.send(command);
    const allKeys = (data.Contents || []).map(obj =>
      `https://${bucket}.s3.${configService.get('AWS_REGION')}.amazonaws.com/${obj.Key}`
    );

    const totalPages = Math.ceil(allKeys.length / limit);
    const paginated = allKeys.slice((page - 1) * limit, page * limit);

    res.json({
      maps: paginated,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error('Error al obtener mapas de S3:', err);
    res.status(500).json({ error: 'Error al obtener mapas desde S3' });
  }
});

module.exports = router;