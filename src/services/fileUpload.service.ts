// import 'dotenv/config';
// import { v2 as cloudinary } from 'cloudinary';
// import streamifier from 'streamifier';

// const CLOUDINARY_ENABLED = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

// if (CLOUDINARY_ENABLED) {
//   const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;
//   const api_key = process.env.CLOUDINARY_API_KEY!;
//   const api_secret = process.env.CLOUDINARY_API_SECRET!;
//   cloudinary.config({
//     cloud_name,
//     api_key,
//     api_secret,
//     secure: true,
//   });
// }

// export type UploadedFileResult = {
//   url: string;
//   public_id?: string;
// };

// export class FileUploadService {
//   isCloudEnabled() {
//     return CLOUDINARY_ENABLED;
//   }

//   async uploadBufferToCloudinary(buffer: Buffer, filename: string, folder: string, resourceType: 'image' | 'raw'): Promise<UploadedFileResult> {
//     if (!CLOUDINARY_ENABLED) throw new Error('Cloudinary not configured');

//     const uploadOptions: Record<string, any> = {
//       folder,
//       resource_type: resourceType,
//       use_filename: true,
//       unique_filename: true,
//       overwrite: false,
//     };

//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
//         if (error || !result) return reject(error || new Error('No result from Cloudinary'));
//         resolve({ url: result.secure_url, public_id: result.public_id });
//       });

//       streamifier.createReadStream(buffer).pipe(uploadStream);
//     });
//   }
// }
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const CLOUDINARY_ENABLED = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
  });
}

export type UploadedFileResult = {
  url: string;
  public_id?: string;
  original_filename?: string; // השם המקורי להצגה
};

function normalizePublicId(filename: string, prefix = '') {
  const dot = filename.lastIndexOf('.');
  const base = (dot > -1 ? filename.slice(0, dot) : filename)
    .normalize('NFKC')
    .replace(/[^\w\-\/: ]/g, '') // רק ASCII/ספרות/קווים/נקודתיים/רווחים
    .trim()
    .replace(/\s+/g, '_');
  const safe = base || 'file';
  const suffix = Date.now(); // ייחודיות
  return prefix ? `${prefix}_${safe}_${suffix}` : `${safe}_${suffix}`;
}

export class FileUploadService {
  isCloudEnabled() { return CLOUDINARY_ENABLED; }

  async uploadBufferToCloudinary(buffer: Buffer, filename: string, folder: string, resourceType: 'image' | 'raw'): Promise<UploadedFileResult> {
    if (!CLOUDINARY_ENABLED) throw new Error('Cloudinary not configured');

    const public_id = normalizePublicId(filename); // אפשר להעביר id_number כ-prefix מהקריאה החיצונית
    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: resourceType,
      public_id,              // שם שמותר לאחסון
      use_filename: false,    // אנחנו שולטים ב-public_id
      unique_filename: false, // יש לנו suffix לזיהוי; אין צורך ב-random
      overwrite: false,
      filename_override: filename,           // מציג שם מקורי בעברית
      context: { originalName: filename },   // גיבוי לשם המקורי
    };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error || !result) return reject(error || new Error('No result from Cloudinary'));
        const anyResult = result as any;
        const originalNameFromContext = anyResult?.context?.custom?.originalName || anyResult?.context?.originalName;
        const originalName = originalNameFromContext || anyResult.original_filename || filename;
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          original_filename: originalName,
        });
      });
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}