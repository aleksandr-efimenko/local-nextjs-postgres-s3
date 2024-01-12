import { type FileProps } from "./FilesContainer";
import { LoadSpinner } from "./LoadSpinner";
import { formatBytes } from "~/utils/formatBytes";

type FileItemProps = {
  file: FileProps;
  fetchFiles: () => Promise<void>;
  setFiles: (
    files: FileProps[] | ((files: FileProps[]) => FileProps[]),
  ) => void;
};

export function FileItem({ file, fetchFiles, setFiles }: FileItemProps) {
  async function deleteFile(id: string) {
    setFiles((files: FileProps[]) =>
      files.map((file: FileProps) =>
        file.id === id ? { ...file, isDeleting: true } : file,
      ),
    );
    try {
      await fetch(`/api/files/delete/${id}`, {
        method: "DELETE",
      });
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

  return (
    <li className="relative flex items-center justify-between gap-2 border-b py-2 text-sm">
      <a
        href={`/api/files/download/${file.id}`}
        className="truncate text-blue-500 hover:text-blue-600 hover:underline  "
      >
        {file.originalName}
      </a>

      <div className=" flex items-center gap-2">
        <span className="w-32 ">{formatBytes(file.size)}</span>

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
