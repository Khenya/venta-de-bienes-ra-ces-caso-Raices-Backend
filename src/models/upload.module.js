import { Module } from '@nestjs/common';
import { UploadController } from '../controllers/uploadController';
import { UploadService } from '../services/uploadService';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}