import crypto from 'crypto';
import { config } from '../config.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Recommended for GCM
const TAG_LENGTH = 16;

/**
 * Returns the 32-byte master encryption key buffer.
 */
function getMasterKeyBuffer(keyHex = config.aesMasterKey): Buffer {
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('AES_MASTER_KEY must be a 64-character hex string (32 bytes).');
  }
  return Buffer.from(keyHex, 'hex');
}

export interface EncryptedResult {
  cipherText: string;
  iv: string;
  tag: string;
}

/**
 * Encrypts a sensitive string (e.g. AI provider API Key) using AES-256-GCM.
 */
export function encryptApiKey(plainText: string, masterKeyHex?: string): EncryptedResult {
  if (!plainText) {
    throw new Error('Cannot encrypt empty text.');
  }

  const keyBuffer = getMasterKeyBuffer(masterKeyHex);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return {
    cipherText: encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 */
export function decryptApiKey(
  cipherText: string,
  ivHex: string,
  tagHex: string,
  masterKeyHex?: string
): string {
  if (!cipherText || !ivHex || !tagHex) {
    throw new Error('Missing cipherText, IV, or Auth Tag for decryption.');
  }

  const keyBuffer = getMasterKeyBuffer(masterKeyHex);
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(cipherText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Masks an API key for safe display in UI and logs (e.g. sk-...1234).
 */
export function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  const prefix = key.slice(0, 3);
  const suffix = key.slice(-4);
  return `${prefix}...${suffix}`;
}

/**
 * Key Rotation Helper: re-encrypts ciphertext with a new master key.
 */
export function rotateEncryption(
  cipherText: string,
  ivHex: string,
  tagHex: string,
  oldMasterKeyHex: string,
  newMasterKeyHex: string
): EncryptedResult {
  const decrypted = decryptApiKey(cipherText, ivHex, tagHex, oldMasterKeyHex);
  return encryptApiKey(decrypted, newMasterKeyHex);
}
