import Head from "next/head";
import { UploadFilesForm } from "~/components/UploadFilesForm/UploadFilesS3PresignedUrl";
import { FilesContainer } from "~/components/FilesContainer";
import { useState, useEffect } from "react";
import { type FileProps } from "~/utils/types";

export default function Home() {
  const [files, setFiles] = useState<FileProps[]>([]);

  const fetchFiles = async () => {
    const response = await fetch("/api/files");
    const body = (await response.json()) as FileProps[];
    // set isDeleting to false for all files after fetching
    setFiles(body.map((file) => ({ ...file, isDeleting: false })));
  };

  useEffect(() => {
    fetchFiles().catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <title>File Uploads with Next.js, Prisma, and PostgreSQL</title>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>
        <meta
          name="description"
          content="File Uploads with Next.js, Prisma, and PostgreSQL "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center gap-5 font-mono">
        <div className="container flex flex-col gap-5 px-3">
          <UploadFilesForm onUploadSuccess={fetchFiles} />
          <FilesContainer
            files={files}
            fetchFiles={fetchFiles}
            setFiles={setFiles}
          />
        </div>
      </main>
    </>
  );
}
