// src/services/storage.service.ts
import fs from "fs";
import path from "path";
import { ENV } from "../env";
import type { UploadedFile } from "express-fileupload";

export function ensureUploadDir() {
  if (!fs.existsSync(ENV.UPLOAD_DIR))
    fs.mkdirSync(ENV.UPLOAD_DIR, { recursive: true });
}

export async function saveUploadedFile(file: UploadedFile): Promise<string> {
  ensureUploadDir();
  const fname = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const full = path.join(ENV.UPLOAD_DIR, fname);
  await file.mv(full);
  // 실서비스라면 S3/Cloud Storage URL 반환
  return `file://${path.resolve(full)}`; // 데모용
}
