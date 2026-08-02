import imageCompression from "browser-image-compression";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export async function uploadTitlePage(file: File): Promise<string> {
  // 1) Browser mein compress karein (free tier storage bachane ke liye)
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.3, // ~300KB max
    maxWidthOrHeight: 800, // cover ke liye kaafi
    useWebWorker: true,
    fileType: "image/webp", // WebP = chhota size, behtar quality
  });

  // 2) Cloudinary par upload
  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    throw new Error("Image upload fail ho gaya. Dobara koshish karein.");
  }

  const data = await res.json();
  return data.secure_url as string; // ye URL Supabase mein save hoga
}
