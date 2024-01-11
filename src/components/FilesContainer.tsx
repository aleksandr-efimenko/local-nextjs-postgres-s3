import { useState } from "react";
import { FileItem } from "./FileItem";

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
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteFile(id: string) {
    setIsDeleting(true);
    try {
      await fetch(`/api/files/delete/${id}`, {
        method: "DELETE",
      });
      await fetchFiles();
    } catch (error) {
      console.error(error);
      alert("Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="w-[40rem] overflow-auto">
      <h1 className="text-xl ">
        Last {files.length} uploaded file{files.length > 1 && "s"}
      </h1>
      <ul className="h-96 overflow-auto">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onDelete={deleteFile}
            isLoading={isDeleting}
          />
        ))}
      </ul>
    </div>
  );
}
