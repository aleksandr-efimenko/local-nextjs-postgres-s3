import { useState, useRef } from "react";

export function UploadFilesForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const uploadToServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileInputRef.current?.files?.length) {
      alert("Please, select file you want to upload");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();

    Object.values(fileInputRef.current.files).forEach((file) => {
      formData.append("file", file);
    });

    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });
    const body = (await response.json()) as {
      status: "ok" | "fail";
      message: string;
    };

    setIsLoading(false);
  };
  return (
    <form
      className="flex flex-col items-center justify-center gap-2"
      onSubmit={uploadToServer}
    >
      <label htmlFor="file" className="text-2xl">
        Upload your file
      </label>
      <input
        id="file"
        type="file"
        multiple
        className="rounded-md border bg-gray-100 p-2"
        required
        ref={fileInputRef}
      />
      <button
        disabled={isLoading}
        className="m-2 rounded-md bg-blue-500 px-5 py-2 text-white
      hover:bg-blue-600 
      disabled:cursor-not-allowed
      disabled:bg-gray-400"
      >
        Upload
      </button>
    </form>
  );
}
