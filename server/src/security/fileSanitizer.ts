import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';

export interface SanitizedFileResult {
  originalFilename: string;
  sanitizedFilename: string;
  sanitizedFilePath: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  isImage: boolean;
  isPdf: boolean;
}

// Magic bytes definitions
const MAGIC_BYTES = {
  PNG: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  JPEG: [0xff, 0xd8, 0xff],
  WEBP: [0x52, 0x49, 0x46, 0x46], // 'RIFF'
  PDF: [0x25, 0x50, 0x44, 0x46], // '%PDF'
};

function checkMagicBytes(buffer: Buffer, pattern: number[]): boolean {
  if (buffer.length < pattern.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (buffer[i] !== pattern[i]) return false;
  }
  return true;
}

/**
 * Validates magic bytes against allowed formats (PNG, JPEG, WebP, PDF).
 */
export function detectMimeTypeFromBytes(buffer: Buffer): string | null {
  if (checkMagicBytes(buffer, MAGIC_BYTES.PNG)) return 'image/png';
  if (checkMagicBytes(buffer, MAGIC_BYTES.JPEG)) return 'image/jpeg';
  if (checkMagicBytes(buffer, MAGIC_BYTES.WEBP)) return 'image/webp';
  if (checkMagicBytes(buffer, MAGIC_BYTES.PDF)) return 'application/pdf';
  return null;
}

/**
 * Strips EXIF metadata, re-encodes images to clean WebP, or validates clean PDF.
 */
export async function sanitizeAndSaveFile(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<SanitizedFileResult> {
  const detectedMime = detectMimeTypeFromBytes(fileBuffer);
  if (!detectedMime) {
    throw new Error('Security Violation: Disallowed or corrupted file format. Only JPEG, PNG, WebP, and PDF are permitted.');
  }

  const isImage = detectedMime.startsWith('image/');
  const isPdf = detectedMime === 'application/pdf';
  const fileId = uuidv4();

  let finalBuffer: Buffer;
  let finalExtension: string;
  let finalMime: string;

  if (isImage) {
    // Re-encode image to clean WebP, stripping all EXIF metadata
    finalExtension = '.webp';
    finalMime = 'image/webp';
    finalBuffer = await sharp(fileBuffer)
      .rotate() // Auto-correct rotation based on orientation tag before stripping
      .webp({ quality: 85, effort: 4 })
      .toBuffer();
  } else if (isPdf) {
    finalExtension = '.pdf';
    finalMime = 'application/pdf';
    // Store original PDF bytes after verifying header
    finalBuffer = fileBuffer;
  } else {
    throw new Error('Unsupported file category.');
  }

  const sanitizedFilename = `${fileId}${finalExtension}`;
  const sanitizedFilePath = path.join(config.uploadDir, sanitizedFilename);

  // Write file to disk
  await fs.writeFile(sanitizedFilePath, finalBuffer);

  // Compute SHA-256 checksum
  const checksumSha256 = crypto.createHash('sha256').update(finalBuffer).digest('hex');

  return {
    originalFilename,
    sanitizedFilename,
    sanitizedFilePath,
    mimeType: finalMime,
    sizeBytes: finalBuffer.length,
    checksumSha256,
    isImage,
    isPdf,
  };
}
