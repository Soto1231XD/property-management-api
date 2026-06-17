import {
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new InternalServerErrorException('No se recibió ningún archivo');
    }

    if (this.hasCloudinaryConfig()) {
      const uploadedFile = await this.uploadToCloudinary(file);

      return {
        filename: uploadedFile.public_id,
        originalName: file.originalname,
        url: uploadedFile.secure_url,
      };
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(
      file.originalname,
    )}`;
    const uploadsDirectory = join(process.cwd(), 'uploads');

    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(join(uploadsDirectory, filename), file.buffer);

    return {
      filename,
      originalName: file.originalname,
      url: `/uploads/${filename}`,
    };
  }

  private hasCloudinaryConfig() {
    return Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
    );
  }

  private uploadToCloudinary(file: Express.Multer.File) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'property-management',
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('No se pudo subir el archivo'));
            return;
          }

          resolve(result);
        },
      );

      stream.end(file.buffer);
    });
  }
}
