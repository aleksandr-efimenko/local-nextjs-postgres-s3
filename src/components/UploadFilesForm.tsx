import { useState, useRef } from "react";
import { LoadSpinner } from "./LoadSpinner";
import Link from "next/link";
import { validateFiles, createFormData } from "~/utils/fileUploadHelpers";

type UploadFilesFormProps = {
  onUploadSuccess: () => void;
};

export function UploadFilesForm({ onUploadSuccess }: UploadFilesFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadToServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileInputRef.current?.files?.length) {
      alert("Please, select file you want to upload");
      return;
    }
    const files = Object.values(fileInputRef.current.files);
    if (!validateFiles(files)) {
      return;
    }

    setIsLoading(true);

    const formData = createFormData(files);
    const response = await fetch("/api/files/upload", {
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
    <form
      className="flex flex-col items-center justify-center gap-3"
      onSubmit={uploadToServer}
    >
      <h1 className="text-2xl">
        File upload example using Next.js, MinIO S3, Prisma and PostgreSQL
      </h1>
      <Link
        href="https://github.com/aleksandr-efimenko/local-nextjs-postgres-s3"
        className="text-blue-500 hover:text-blue-600 hover:underline"
      >
        GitHub repo
      </Link>
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <div className="flex h-16 gap-5">
          <input
            id="file"
            type="file"
            multiple
            className="rounded-md border bg-gray-100 p-2 py-5"
            required
            ref={fileInputRef}
          />
          <button
            disabled={isLoading}
            className="m-2 rounded-md bg-blue-500 px-5 py-2 text-white
            hover:bg-blue-600  disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Upload
          </button>
        </div>
      )}
    </form>
  );
}
