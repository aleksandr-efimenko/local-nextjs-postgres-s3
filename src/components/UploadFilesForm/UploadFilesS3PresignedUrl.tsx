import { useState, useRef } from "react";
import {
  validateFiles,
  MAX_FILE_SIZE_S3_ENDPOINT,
  handleUpload,
  getPresignedUrls,
} from "~/utils/fileUploadHelpers";
import { UploadFilesFormUI } from "./UploadFilesFormUI";
import { type ShortFileProp } from "~/utils/types";

type UploadFilesFormProps = {
  onUploadSuccess: () => void;
};

export function UploadFilesS3PresignedUrl({
  onUploadSuccess,
}: UploadFilesFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadToServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // check if files are selected
    if (!fileInputRef.current?.files?.length) {
      alert("Please, select file you want to upload");
      return;
    }
    // get File[] from FileList
    const files = Object.values(fileInputRef.current.files);
    // validate files
    const filesInfo: ShortFileProp[] = files.map((file) => ({
      originalFileName: file.name,
      fileSize: file.size,
    }));

    const filesValidationResult = validateFiles(
      filesInfo,
      MAX_FILE_SIZE_S3_ENDPOINT,
    );
    if (filesValidationResult) {
      alert(filesValidationResult);
      return;
    }
    setIsLoading(true);

    const presignedUrls = await getPresignedUrls(filesInfo);
    if (!presignedUrls?.length) {
      alert("Something went wrong, please try again later");
      return;
    }

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
