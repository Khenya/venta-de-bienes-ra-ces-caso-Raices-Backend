const { extname } = require('path');
const { BadRequestException } = require('@nestjs/common');

class UploadController {
  constructor(uploadService) {
    this.uploadService = uploadService;
  }

  async uploadMap(file) {
    if (!file || !['.png', '.jpg', '.jpeg'].includes(extname(file.originalname).toLowerCase())) {
      throw new BadRequestException('Solo se permiten archivos PNG o JPG');
    }

    const result = await this.uploadService.uploadToS3(file);
    return { url: result.Location };
  }
}

module.exports = UploadController;