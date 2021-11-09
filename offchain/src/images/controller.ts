import * as fs from 'fs';
import * as path from 'path';

import { Controller, Post, Get, Res, UploadedFile, UseInterceptors, Body, Headers, HttpStatus, Inject, Param, Response, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';

import { UploadResult } from './dto';
import { ImageService, LogService } from './service';
import { Image } from "./entity";


@Controller()
export class ImageController {
  constructor(
    @Inject('CONFIG') private readonly config,
    private readonly imageService: ImageService,
    private readonly logService: LogService,
  ) {}

  @Get('/images/:collection/cover-image/')
  async getCollectionCoverImage(@Param('collection') collection: bigint, @Response({ passthrough: true }) res): Promise<StreamableFile> {
    // TODO: just placeholder
    res.set({'Content-Type': 'image/svg+xml'})
    const stream = fs.createReadStream(path.join(this.config.projectDir, '..', 'static', 'no-image.svg'));
    return new StreamableFile(stream);
  }

  @Get('/images/:collection/token/:token/')
  async getTokenImage(@Param('collection') collection: bigint, @Param('token') token: bigint, @Response({ passthrough: true }) res): Promise<StreamableFile> {
    // TODO: just placeholder
    res.set({'Content-Type': 'image/svg+xml'})
    const stream = fs.createReadStream(path.join(this.config.projectDir, '..', 'static', 'no-image.svg'));
    return new StreamableFile(stream);
  }

  @Post('/api/images/upload/')
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
  @ApiResponse({ status: HttpStatus.CREATED, type: UploadResult })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @Body() body, @RealIP() ip: string, @Headers() headers, @Res({ passthrough: true }) response): Promise<UploadResult> {
    const uploadResult = await this.imageService.uploadFile(file, parseInt(body.collection_id), this.logService, ip, headers['user-agent']);
    if(uploadResult.success) response.status(HttpStatus.CREATED);
    else response.status(HttpStatus.BAD_REQUEST);
    return uploadResult;
  }

  @Get('/api/images/')
  async allImages(): Promise<Image[]> {
    return await this.imageService.all();
  }
}
