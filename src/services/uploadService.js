const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuid } = require('uuid');

class UploadService {
  constructor(config) {
    this.config = config;
    this.bucket = config.get('AWS_BUCKET_NAME');
    this.s3 = new S3Client({
      region: config.get('AWS_REGION'),
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadToS3(file) {
    const key = `maps/${uuid()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await this.s3.send(command);

    return {
      Location: `https://${this.bucket}.s3.${this.config.get('AWS_REGION')}.amazonaws.com/${key}`,
    };
  }
}

module.exports = UploadService;