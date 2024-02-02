import { type FileProps } from "~/utils/types";
import { LoadSpinner } from "./LoadSpinner";
import { formatBytes } from "~/utils/fileUploadHelpers";

type FileItemProps = {
  file: FileProps;
  fetchFiles: () => Promise<void>;
  setFiles: (
    files: FileProps[] | ((files: FileProps[]) => FileProps[]),
  ) => void;
  downloadUsingPresignedUrl: boolean;
};

async function getPresignedUrl(file: FileProps) {
  const response = await fetch(`/api/files/download/presignedUrl/${file.id}`);
  return (await response.json()) as string;
}

export function FileItem({
  file,
  fetchFiles,
  setFiles,
  downloadUsingPresignedUrl,
}: FileItemProps) {
  async function deleteFile(id: string) {
    setFiles((files: FileProps[]) =>
      files.map((file: FileProps) =>
        file.id === id ? { ...file, isDeleting: true } : file,
      ),
    );
    try {
      // delete file request to the server
      await fetch(`/api/files/delete/${id}`, {
        method: "DELETE",
      });
      // fetch files after deleting
      await fetchFiles();
    } catch (error) {
      console.error(error);
      alert("Failed to delete file");
    } finally {
      setFiles((files: FileProps[]) =>
        files.map((file: FileProps) =>
          file.id === id ? { ...file, isDeleting: false } : file,
        ),
      );
    }
  }

  // Depending on the upload mode, we either download the file using the presigned url from S3 or the Nextjs API endpoint.
  const downloadFile = async (file: FileProps) => {
    if (downloadUsingPresignedUrl) {
      const presignedUrl = await getPresignedUrl(file);
      window.open(presignedUrl, "_blank");
    } else {
      window.open(`/api/files/download/smallFiles/${file.id}`, "_blank");
    }
  };

  return (
    <li className="relative flex items-center justify-between gap-2 border-b py-2 text-sm">
      <button
        className="truncate text-blue-500 hover:text-blue-600 hover:underline  "
        onClick={() => downloadFile(file)}
      >
        {file.originalFileName}
      </button>

      <div className=" flex items-center gap-2">
        <span className="w-32 ">{formatBytes(file.fileSize)}</span>

        <button
          className="flex w-full flex-1 cursor-pointer items-center justify-center
           rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600
           disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => deleteFile(file.id)}
          disabled={file.isDeleting}
        >
          Delete
        </button>
      </div>

      {file.isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-900 bg-opacity-20">
          <LoadSpinner size="small" />
        </div>
      )}
    </li>
  );
}
