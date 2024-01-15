import { useState, useRef } from "react";
import { validateFiles, createFormData } from "~/utils/fileUploadHelpers";
import { MAX_FILE_SIZE_NEXTJS_ROUTE } from "~/utils/fileUploadHelpers";
import { UploadFilesFormUI } from "./UploadFilesFormUI";

type UploadFilesFormProps = {
  onUploadSuccess: () => void;
};

export function UploadFilesRoute({ onUploadSuccess }: UploadFilesFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadToServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileInputRef.current?.files?.length) {
      alert("Please, select file you want to upload");
      return;
    }
    const files = Object.values(fileInputRef.current?.files);
    const filesInfo = files.map((file) => ({
      originalFileName: file.name,
      fileSize: file.size,
    }));

    const filesValidationResult = validateFiles(
      filesInfo,
      MAX_FILE_SIZE_NEXTJS_ROUTE,
    );
    if (filesValidationResult) {
      alert(filesValidationResult);
      return;
    }

    setIsLoading(true);

    const formData = createFormData(files);
    const response = await fetch("/api/files/upload/smallFiles", {
      method: "POST",
      body: formData,
    });
    const body = (await response.json()) as {
      status: "ok" | "fail";
      message: string;
    };
    if (body.status === "ok") {
      onUploadSuccess();
    } else {
      alert(body.message);
    }
    setIsLoading(false);
  };

  return (
    <UploadFilesFormUI
      isLoading={isLoading}
      fileInputRef={fileInputRef}
      uploadToServer={uploadToServer}
      maxFileSize={MAX_FILE_SIZE_NEXTJS_ROUTE}
    />
  );
}
