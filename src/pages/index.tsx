import Head from "next/head";
import { UploadFilesS3PresignedUrl } from "~/components/UploadFilesForm/UploadFilesS3PresignedUrl";
import { FilesContainer } from "~/components/FilesContainer";
import { useState, useEffect } from "react";
import { type FileProps } from "~/utils/types";
import { UploadFilesRoute } from "~/components/UploadFilesForm/UploadFilesRoute";

export type fileUploadMode = "s3PresignedUrl" | "NextjsAPIEndpoint";

export default function Home() {
  const [files, setFiles] = useState<FileProps[]>([]);
  const [uploadMode, setUploadMode] =
    useState<fileUploadMode>("s3PresignedUrl");

  const fetchFiles = async () => {
    const response = await fetch("/api/files");
    const body = (await response.json()) as FileProps[];
    // set isDeleting to false for all files after fetching
    setFiles(body.map((file) => ({ ...file, isDeleting: false })));
  };

  // fetch files on the first render
  useEffect(() => {
    fetchFiles().catch(console.error);
  }, []);

  // determine if we should download using presigned url or Nextjs API endpoint
  const downloadUsingPresignedUrl = uploadMode === "s3PresignedUrl";
  // handle mode change between s3PresignedUrl and NextjsAPIEndpoint
  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUploadMode(event.target.value as fileUploadMode);
  };

  return (
    <>
      <Head>
        <title>File Uploads with Next.js, Prisma, and PostgreSQL</title>
        <meta
          name="description"
          content="File Uploads with Next.js, Prisma, and PostgreSQL "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center gap-5 font-mono">
        <div className="container flex flex-col gap-5 px-3">
          <ModeSwitchMenu
            uploadMode={uploadMode}
            handleModeChange={handleModeChange}
          />
          {uploadMode === "s3PresignedUrl" ? (
            <UploadFilesS3PresignedUrl onUploadSuccess={fetchFiles} />
          ) : (
            <UploadFilesRoute onUploadSuccess={fetchFiles} />
          )}
          <FilesContainer
            files={files}
            fetchFiles={fetchFiles}
            setFiles={setFiles}
            downloadUsingPresignedUrl={downloadUsingPresignedUrl}
          />
        </div>
      </main>
    </>
  );
}

export type ModeSwitchMenuProps = {
  uploadMode: fileUploadMode;
  handleModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};
function ModeSwitchMenu({ uploadMode, handleModeChange }: ModeSwitchMenuProps) {
  return (
    <ul className="flex items-center justify-center gap-2">
      <li>
        <label htmlFor="uploadMode">Upload Mode:</label>
      </li>
      <li>
        <select
          className="rounded-md border-2 border-gray-300"
          id="uploadMode"
          value={uploadMode}
          onChange={handleModeChange}
        >
          <option value="s3PresignedUrl">S3 Presigned Url</option>
          <option value="NextjsAPIEndpoint">Next.js API Endpoint</option>
        </select>
      </li>
    </ul>
  );
}
