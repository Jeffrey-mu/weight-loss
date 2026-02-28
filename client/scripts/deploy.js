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

let client;

function initClient() {
  if (client) return client;
  client = new OSS({
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
  });
  return client;
}

const distPath = path.resolve(__dirname, '../dist');

function normalizeSiteUrl(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const noTrailingSlash = trimmed.replace(/\/+$/, '');
  if (noTrailingSlash.startsWith('http://') || noTrailingSlash.startsWith('https://')) {
    return noTrailingSlash;
  }
  return `https://${noTrailingSlash}`;
}

function writeTextFile(targetPath, content) {
  fs.writeFileSync(targetPath, content, 'utf8');
}

function prepareSeoFiles() {
  if (!fs.existsSync(distPath)) {
    console.error(`Directory not found: ${distPath}`);
    console.error('Please run "npm run build" first.');
    process.exit(1);
  }

  const siteUrl = normalizeSiteUrl(process.env.SITE_URL || process.env.VITE_SITE_URL);
  const robotsLines = ['User-agent: *', 'Allow: /', 'Disallow: /api/', 'Disallow: /diet', 'Disallow: /exercise'];
  if (siteUrl) robotsLines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
  writeTextFile(path.join(distPath, 'robots.txt'), `${robotsLines.join('\n')}\n`);

  if (!siteUrl) {
    console.warn('Warning: SITE_URL not set, skipping sitemap.xml generation.');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const routes = [
    { path: '/login', changefreq: 'monthly', priority: '0.8' },
    { path: '/register', changefreq: 'monthly', priority: '0.8' },
  ];

  const urls = routes
    .map(
      (r) =>
        `  <url>\n` +
        `    <loc>${siteUrl}${r.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n');

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;

  writeTextFile(path.join(distPath, 'sitemap.xml'), sitemap);
}

async function uploadFile(filePath, ossPath) {
  try {
    const ossClient = initClient();
    await ossClient.put(ossPath, filePath);
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
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('--generate-only');

  console.log(dryRun ? 'Starting SEO generation (Dry Run)...' : 'Starting deployment to Ali OSS...');
  try {
    prepareSeoFiles();
    if (!dryRun) {
      await uploadDirectory(distPath, '');
    }
    console.log(dryRun ? 'SEO files generated successfully!' : 'Deployment successful!');
  } catch (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  }
}

deploy();
