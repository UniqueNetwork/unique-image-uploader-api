export class UploadResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export class MimeValidateResult {
  success: boolean;
  ext?: string;
  mimeType?: string;
}

export class SimpleStringResult {
  success: boolean;
  result?: string;
}