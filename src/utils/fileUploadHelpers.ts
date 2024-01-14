import { type PresignedUrlProp } from "~/pages/api/files/upload/presignedUrl";

export const MAX_FILE_SIZE_NEXTJS_ROUTE = 4;
export const MAX_FILE_SIZE_S3_ENDPOINT = 100;
export const FILE_NUMBER_LIMIT = 10;

/**
 *
 * @param file file to check
 * @returns true if file size is less than MAX_FILE_SIZE
 */
export function limitFileSize(file: File, maxSizeMB: number) {
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`File ${file.name} is too big. Max file size is ${maxSizeMB} MB`);
    return false;
  }
  return true;
}

/**
 *
 * @param files array of files
 * @returns true if all files are valid
 */
export function validateFiles(files: File[], maxSizeMB: number): boolean {
  // check if any file is too big
  const isFileSizeValid = files.every((file) => limitFileSize(file, maxSizeMB));
  if (!isFileSizeValid) return false;

  if (files.length > FILE_NUMBER_LIMIT) {
    alert(`You can upload up to ${FILE_NUMBER_LIMIT} files at once`);
    return false;
  }

  return true;
}

/**
 *
 * @param files array of files
 * @returns FormData object
 */
export function createFormData(files: File[]): FormData {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });
  return formData;
}

/**
 * Gets presigned urls for uploading files to S3
 * @param formData form data with files to upload
 * @returns
 */
export const getPresignedUrls = async (formData: FormData) => {
  const response = await fetch("/api/files/upload/presignedUrl", {
    method: "POST",
    body: formData,
  });
  return (await response.json()) as PresignedUrlProp[];
};

/**
 * Uploads file to S3 directly using presigned url
 * @param presignedUrl presigned url for uploading
 * @param file  file to upload
 * @returns  response from S3
 */
export const uploadToS3 = async (
  presignedUrl: PresignedUrlProp,
  file: File,
) => {
  const response = await fetch(presignedUrl.url, {
    method: "PUT",
    body: file,
  });
  return response;
};

/**
 * Saves file info in DB
 * @param presignedUrls presigned urls for uploading
 * @returns
 */
export const saveFileInfoInDB = async (presignedUrls: PresignedUrlProp[]) => {
  return await fetch("/api/files/upload/saveFileInfo", {
    method: "POST",
    body: JSON.stringify(presignedUrls),
  });
};

/**
 * Uploads files to S3 and saves file info in DB
 * @param files files to upload
 * @param presignedUrls  presigned urls for uploading
 * @param onUploadSuccess callback to execute after successful upload
 * @returns
 */
export const handleUpload = async (
  files: File[],
  presignedUrls: PresignedUrlProp[],
  onUploadSuccess: () => void,
) => {
  const uploadToS3Response = await Promise.all(
    presignedUrls.map((presignedUrl) => {
      const file = files.find(
        (file) =>
          file.name === presignedUrl.originalFileName &&
          file.size === presignedUrl.fileSize,
      );
      if (!file) {
        throw new Error("File not found");
      }
      return uploadToS3(presignedUrl, file);
    }),
  );

  if (uploadToS3Response.some((res) => res.status !== 200)) {
    alert("Upload failed");
    return;
  }

  await saveFileInfoInDB(presignedUrls);
  onUploadSuccess();
};

/**
 *
 * @param bytes size of file
 * @param decimals number of decimals to show
 * @returns formatted string
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];

  // get index of size to use from sizes array
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // return formatted string
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
