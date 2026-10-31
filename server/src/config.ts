import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  aesMasterKey: process.env.AES_MASTER_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  jwtSecret: process.env.JWT_SECRET || 'deutschlab_dev_jwt_secret_strictly_unguessable_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  uploadDir: path.resolve(process.env.UPLOAD_DIR || './uploads'),
  backupDir: path.resolve(process.env.BACKUP_DIR || './backups'),
};

// Ensure directories exist
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}
