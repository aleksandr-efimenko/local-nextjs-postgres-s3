import { FileItem } from "./FileItem";

export type FileProps = {
  id: string;
  originalName: string;
  size: number;
  isDeleting?: boolean;
};

export type FilesListProps = {
  files: FileProps[];
  fetchFiles: () => Promise<void>;
  setFiles: (
    files: FileProps[] | ((files: FileProps[]) => FileProps[]),
  ) => void;
};

export function FilesContainer({
  files,
  fetchFiles,
  setFiles,
}: FilesListProps) {
  if (files.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center ">
        <p className="text-xl">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="h-96">
      <h1 className="text-xl ">
        Last {files.length} uploaded file{files.length > 1 ? "s" : ""}
      </h1>
      <ul className="h-80 overflow-auto">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            fetchFiles={fetchFiles}
            setFiles={setFiles}
          />
        ))}
      </ul>
    </div>
  );
}
