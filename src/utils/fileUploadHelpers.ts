export const MAX_FILE_SIZE = 4;
export const FILE_NUMBER_LIMIT = 10;

/**
 *
 * @param file file to check
 * @returns true if file size is less than MAX_FILE_SIZE
 */
export function limitFileSize(file: File) {
  if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
    alert(`File ${file.name} is too big. Max file size is ${MAX_FILE_SIZE} MB`);
    return false;
  }
  return true;
}

/**
 *
 * @param files array of files
 * @returns true if all files are valid
 */
export function validateFiles(files: File[]): boolean {
  if (!files.every(limitFileSize)) {
    return false;
  }

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
