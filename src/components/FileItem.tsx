import { type FileProps } from "./FilesContainer";

type FileItemProps = {
  file: FileProps;
  onDelete: (id: string) => void;
  isLoading: boolean;
};

export function FileItem({ file, onDelete, isLoading }: FileItemProps) {
  return (
    <li className="flex items-center justify-between gap-2 border-b py-2 text-sm">
      <a
        href={`/api/files/download/${file.id}`}
        className="truncate text-blue-500 hover:text-blue-600 hover:underline  "
      >
        {file.originalName}
      </a>
      <div className="flex  items-center gap-2">
        <span className="w-32 ">{formatBytes(file.size)}</span>

        <button
          className="flex w-full  flex-1 cursor-pointer items-center justify-center
           rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={() => onDelete(file.id)}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}

/**
 *
 * @param bytes size of file
 * @param decimals number of decimals to show
 * @returns formatted string
 */
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];

  // get index of size to use from sizes array
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // return formatted string
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
