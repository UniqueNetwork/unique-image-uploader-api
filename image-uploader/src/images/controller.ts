import { Controller, Post, Res, UploadedFile, UseInterceptors, Body, HttpStatus, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

import { UploadResult } from './dto';
import { ImageService } from './service';


@Controller()
export class ImageController {
  constructor(
    @Inject('CONFIG') private readonly config,
    private readonly imageService: ImageService
  ) {}

  @Post('/api/images/upload/')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: UploadResult })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @Body() body, @Res({ passthrough: true }) response): Promise<UploadResult> {
    const uploadResult = await this.imageService.uploadFile(file);
    if(uploadResult.success) response.status(HttpStatus.CREATED);
    else response.status(HttpStatus.BAD_REQUEST);
    return uploadResult;
  }
}
