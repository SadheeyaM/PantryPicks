const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const path = require("path");

const AWS_REGION = process.env.AWS_REGION;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL || `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;
const S3_CATEGORY_PREFIX = process.env.S3_CATEGORY_PREFIX || "categories";
const S3_PRODUCT_PREFIX = process.env.S3_PRODUCT_PREFIX || "product";

if (!AWS_REGION || !S3_BUCKET_NAME) {
  throw new Error("AWS_REGION and S3_BUCKET_NAME must be set for upload service");
}

const s3Client = new S3Client({ region: AWS_REGION });

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const sanitizeFileName = (fileName) => {
  const baseName = path.basename(String(fileName || "image")).replace(/[^a-zA-Z0-9._-]/g, "-");
  return baseName || "image";
};

const createImagePresign = async ({ fileName, contentType, prefix }) => {
  if (!allowedImageTypes.has(contentType)) {
    const error = new Error("Only image uploads are allowed");
    error.statusCode = 400;
    throw error;
  }

  const safeFileName = sanitizeFileName(fileName);
  const objectKey = `${prefix}/${Date.now()}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: objectKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  const fileUrl = `${S3_PUBLIC_BASE_URL}/${objectKey}`;

  return {
    uploadUrl,
    fileUrl,
    key: objectKey,
  };
};

const extractObjectKey = (fileUrlOrKey) => {
  if (!fileUrlOrKey) {
    return "";
  }

  const raw = String(fileUrlOrKey).trim();
  if (!raw) {
    return "";
  }

  if (!/^https?:\/\//i.test(raw)) {
    return raw.replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(raw);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch (_) {
    return "";
  }
};

const createImageReadUrl = async ({ fileUrl, expiresIn = 900 }) => {
  const key = extractObjectKey(fileUrl);

  if (!key) {
    return "";
  }

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

const createCategoryImagePresign = async ({ fileName, contentType }) => {
  return createImagePresign({ fileName, contentType, prefix: S3_CATEGORY_PREFIX });
};

const createProductImagePresign = async ({ fileName, contentType }) => {
  return createImagePresign({ fileName, contentType, prefix: S3_PRODUCT_PREFIX });
};

module.exports = {
  createCategoryImagePresign,
  createProductImagePresign,
  createImageReadUrl,
};
