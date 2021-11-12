import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { fromBuffer as fileTypeFromBuffer } from 'file-type'
import { create } from 'ipfs-http-client';


import { Injectable, Inject } from '@nestjs/common';

import { MimeValidateResult, SimpleStringResult, UploadResult } from './dto';
import * as constants from '../constants';


@Injectable()
export class ImageService {
  constructor(
    @Inject('CONFIG')
    private config
  ) {}

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

  async saveBufferToIPFS(buffer, config): Promise<SimpleStringResult> {
    try {
      const client = create({
        url: config.ipfsUrl,
        agent: new (config.ipfsUrl.startsWith('https') ? HttpsAgent : HttpAgent)()
      });
      const uploaded = await client.add({
        content: buffer
      });
      return {success: true, result: uploaded.cid.toString()}
    }
    catch (e) {
      return {success: false}
    }
  }

  async uploadFile(file): Promise<UploadResult> {
    if(!file) return {success: false, error: constants.dataErrors.ERR_INVALID_PAYLOAD};

    const mimeResult = await this.checkImageMimeType(file.buffer, this.config);
    if(!mimeResult.success) return {success: false, error: constants.fileErrors.ERR_INVALID_FILE_TYPE};

    const ipfsResult = await this.saveBufferToIPFS(file.buffer,  this.config);
    if(!ipfsResult.success) return {success: false, error: constants.fileErrors.ERR_INTERNAL_ERROR};

    return {success: true, address: ipfsResult.result};
  }
}
