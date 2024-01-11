export type FileProps = {
  id: string;
  originalName: string;
  size: number;
};

export type FilesListProps = {
  files: FileProps[];
  fetchFiles: () => Promise<void>;
};

export function FilesContainer({ files, fetchFiles }: FilesListProps) {
  async function deleteFile(id: string) {
    await fetch(`/api/files/delete/${id}`, {
      method: "DELETE",
    });

    await fetchFiles();
  }
  return (
    <div className="w-2/3 overflow-auto">
      <h1 className="text-xl ">Last 5 files uploaded</h1>
      <ul>
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between gap-2 border-b py-2 text-sm"
          >
            <span className=" truncate">{file.originalName}</span>
            <div className="flex  items-center gap-2">
              <span className="w-32 ">{formatBytes(file.size)}</span>
              <a
                className="flex flex-1 cursor-pointer items-center justify-center
                rounded-md
               bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 "
                href={`/api/files/download/${file.id}`}
              >
                Download
              </a>

              <a
                className="flex w-full  flex-1 cursor-pointer items-center justify-center
               rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={() => deleteFile(file.id)}
              >
                Delete
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
