/* eslint-env node */
import OSS from 'ali-oss';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
});

const distPath = path.resolve(__dirname, '../dist');

async function uploadFile(filePath, ossPath) {
  try {
    await client.put(ossPath, filePath);
    console.log(`Uploaded: ${ossPath}`);
  } catch (err) {
    console.error(`Failed to upload: ${ossPath}`, err);
  }
}

async function uploadDirectory(dirPath, ossDir) {
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    console.error('Please run "npm run build" first.');
    process.exit(1);
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const ossPath = ossDir ? `${ossDir}/${file}` : file;
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await uploadDirectory(filePath, ossPath);
    } else {
      await uploadFile(filePath, ossPath);
    }
  }
}

async function deploy() {
  console.log('Starting deployment to Ali OSS...');
  try {
    await uploadDirectory(distPath, '');
    console.log('Deployment successful!');
  } catch (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  }
}

deploy();
