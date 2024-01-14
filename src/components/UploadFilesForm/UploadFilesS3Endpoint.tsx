import { useState, useRef } from "react";
import {
  validateFiles,
  createFormData,
  MAX_FILE_SIZE_S3_ENDPOINT,
  handleUpload,
  getPresignedUrls,
} from "~/utils/fileUploadHelpers";
import { UploadFilesFormUI } from "./UploadFilesFormUI";

type UploadFilesFormProps = {
  onUploadSuccess: () => void;
};

export function UploadFilesForm({ onUploadSuccess }: UploadFilesFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadToServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // check if files are selected
    if (!fileInputRef.current?.files?.length) {
      alert("Please, select file you want to upload");
      return;
    }
    const files = Object.values(fileInputRef.current.files);
    if (!validateFiles(files, MAX_FILE_SIZE_S3_ENDPOINT)) {
      return;
    }
    setIsLoading(true);

    // create form data to send to server and get presigned urls
    const formData = createFormData(files);
    const presignedUrls = await getPresignedUrls(formData);

    // upload files to s3 endpoint directly and save file info to db
    await handleUpload(files, presignedUrls, onUploadSuccess);

    setIsLoading(false);
  };

  return (
    <UploadFilesFormUI
      isLoading={isLoading}
      fileInputRef={fileInputRef}
      uploadToServer={uploadToServer}
      maxFileSize={MAX_FILE_SIZE_S3_ENDPOINT}
    />
  );
}
