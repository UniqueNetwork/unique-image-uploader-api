import { Controller, Post, UploadedFile, UseInterceptors, Body, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';

import { UploadResult } from './dto';
import { ImageService, LogService } from './service';


@Controller()
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly logService: LogService,
  ) {}

  @Post('/api/images/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        collection_id: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        }
      }
    }
  })
  @ApiResponse({ status: 201, type: UploadResult })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @Body() body, @RealIP() ip: string, @Headers() headers): Promise<UploadResult> {
    return (
      await this.imageService.uploadFile(file, parseInt(body.collection_id), this.logService, ip, headers['user-agent'])
    );
  }
}
