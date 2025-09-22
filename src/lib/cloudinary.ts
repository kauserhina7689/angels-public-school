"use server";
// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
  secure: true,
});
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
}

// export async function uploadCloudinary(file: File) {
//   try {
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const uploadRes = await new Promise<CloudinaryUploadResponse>(
//       (resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ resource_type: "auto" }, (error, result) => {
//             if (error) return reject(error);
//             resolve({
//               public_id: result!.public_id,
//               secure_url: result!.secure_url,
//               resource_type: result!.resource_type as "image" | "video" | "raw",
//             });
//           })
//           .end(buffer);
//       }
//     );
//     return uploadRes;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
export async function uploadCloudinary(file: File) {
  try {
    console.log("Uploading file ", file.name);

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      dataURI,
      {
        resource_type: "auto",
        timeout: 120000, // 120 seconds
      }
    );

    console.log("file uploaded", { public_id, secure_url });
    return {
      public_id: public_id,
      secure_url: secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}

/**
 * Deletes a file from Cloudinary by its public ID.
 * @param publicId - Cloudinary public_id (e.g. "folder/filename")
 * @returns Promise<boolean>
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw error;
  }
}

// export default cloudinary;
