import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const CLOUDINARY_ENABLED = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (CLOUDINARY_ENABLED) {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;
  const api_key = process.env.CLOUDINARY_API_KEY!;
  const api_secret = process.env.CLOUDINARY_API_SECRET!;
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
}

export type UploadedFileResult = {
  url: string;
  public_id?: string;
};

export class FileUploadService {
  isCloudEnabled() {
    return CLOUDINARY_ENABLED;
  }

  async uploadBufferToCloudinary(buffer: Buffer, filename: string, folder: string, resourceType: 'image' | 'raw'): Promise<UploadedFileResult> {
    if (!CLOUDINARY_ENABLED) throw new Error('Cloudinary not configured');

    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error || !result) return reject(error || new Error('No result from Cloudinary'));
        resolve({ url: result.secure_url, public_id: result.public_id });
      });

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}
