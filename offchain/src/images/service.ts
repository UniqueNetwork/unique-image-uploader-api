import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { join as pathJoin, basename, dirname } from 'path'
import { createHash } from 'crypto'
import { fromBuffer as fileTypeFromBuffer } from 'file-type'

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { MimeValidateResult, SimpleStringResult, UploadResult } from './dto';
import { Image, UploadLog } from './entity';
import * as constants from '../constants';


@Injectable()
export class ImageService {
  constructor(
    @Inject('IMAGE_REPOSITORY')
    private repository: Repository<Image>,
    @Inject('CONFIG')
    private config
  ) {}

  async all() {
    return await this.repository.find();
  }

  sha256HashFromBuffer(buffer): SimpleStringResult {
    const hash = createHash('sha256');
    try {
      hash.update(buffer);
      return {success: true, result: hash.digest('hex')};
    }
    catch (e) {
      return {success: false};
    }
  }

  async checkImageMimeType(imageBuffer, config): Promise<MimeValidateResult> {
    let typeResult;
    try {
      typeResult = await fileTypeFromBuffer(imageBuffer);
    }
    catch (e) {
      return {success: false};
    }

    if(!typeResult) return {success: false};

    const isAllowed = config.allowedImageTypes.indexOf(typeResult.mime) >= 0;

    return {success: isAllowed, ext: typeResult.ext, mimeType: typeResult.mime};
  }

  constructUploadPath(fileName: string, config): string {
    const base = basename(fileName), len = base.length;
    const dirPath = pathJoin(config.uploadsDir, base.slice(0, 2), base.slice(len > 2 ? 2 : 0, len > 2 ? 4 : 2));
    return pathJoin(dirPath, fileName);
  }

  saveBufferToFs(buffer, fileName: string, config): SimpleStringResult {
    const filePath = this.constructUploadPath(fileName, config);
    try {
      mkdirSync(dirname(filePath), {recursive: true});

      if(!existsSync(filePath)) {
        writeFileSync(filePath, buffer);
      }
    }
    catch (e) {
      return {success: false};
    }
    return {success: true, result: filePath};
  }

  async uploadFile(file, collectionId: number, log: LogService, ip?: string, userAgent?: string): Promise<UploadResult> {
    if(isNaN(collectionId) || collectionId < 0) return {success: false, error: constants.dataErrors.ERR_INVALID_PAYLOAD};
    if(!file) return {success: false, error: constants.dataErrors.ERR_INVALID_PAYLOAD};

    const config = this.config, fileHash = this.sha256HashFromBuffer(file.buffer);

    if(!fileHash.success) return {success: false, error: constants.fileErrors.ERR_INTERNAL_ERROR};

    const dbCheck = await this.repository.createQueryBuilder('image').where(
      'image.collection_id = :id AND image.hash = :hash AND image.token_id IS NULL', {id: collectionId, hash: fileHash.result}
    ).getOne();
    if(dbCheck) return {success: false, error: constants.dataErrors.ERR_DUPLICATE};

    const mimeResult = await this.checkImageMimeType(file.buffer, config);
    if(!mimeResult.success) return {success: false, error: constants.fileErrors.ERR_INVALID_FILE_TYPE};

    const fsResult = this.saveBufferToFs(file.buffer, `${fileHash.result}.${mimeResult.ext}`, config);
    if(!fsResult.success) return {success: false, error: constants.fileErrors.ERR_INTERNAL_ERROR};

    const image = this.repository.create({collection_id: collectionId, hash: fileHash.result, tmp_address: fsResult.result});
    await this.repository.save(image);
    await log.logUpload(fsResult.result, 'image', ip, userAgent);
    return {success: true, hash: image.hash};
  }
}

@Injectable()
export class LogService {
  constructor(
    @Inject('UPLOAD_LOG_REPOSITORY')
    private repository: Repository<UploadLog>
  ) {}

  async logUpload(file_path: string, entity_type: "image" = 'image', ip?: string, userAgent?: string): Promise<UploadLog> {
    const log = this.repository.create({file_path, entity_type, ip_address: ip, user_agent: userAgent});
    await this.repository.save(log);
    return log;
  }
}