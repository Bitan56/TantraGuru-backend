import { Readable } from 'node:stream';
import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = (fileBuffer) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    // Graceful fallback when Cloudinary credentials are not set
    const base64 = fileBuffer ? `data:image/jpeg;base64,${fileBuffer.toString('base64')}` : 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=600';
    return Promise.resolve({
      url: base64,
      key: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
        resource_type: 'image',
      },
      (error, result) => {
        if (result) {
          resolve({
            url: result.secure_url,
            key: result.public_id,
          });
        } else {
          reject(error);
        }
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (storageKey) => {
  if (!storageKey || storageKey.startsWith('mock_') || !process.env.CLOUDINARY_CLOUD_NAME) {
    return null;
  }
  return cloudinary.uploader.destroy(storageKey);
};