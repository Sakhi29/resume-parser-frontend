import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FlexboxSpacer } from "./FlexboxSpacer";
import Link from "next/link";
import Image from "next/image";
import { getS3URL, uploadFile } from "@/api/helper";

interface FileWithPreview extends File {
  preview: string;
}

function ResumeDropzone() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleUpload = async () => {
    try {
      const url = await getS3URL(`${files[0].name}`);
      if (url) {
        const uploadToS3 = await uploadFile(files[0], url);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <iframe
        src={file.preview}
        title={file.name}
        width="760px"
        height="550px"
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <main className="mx-auto max-w-screen-2xl bg-dot px-8 text-gray-900 lg:flex flex-row">
      <div className="lg:flex lg:px-16 lg:justify-center lg:items-center">
        <div className="flex flex-col gap-5">
          <h1 className="text-gray-800 pb-2 text-md font-normal lg:text-lg lg:mt-0">
            We offer precise resume parsing, providing actionable insights for
            improvement, and generate tailored mock interview questions.
          </h1>
          <h2 className="text-primary pb-2 text-2xl font-bold lg:text-3xl">
            Upload your resume here for parsing
          </h2>
          <h1 className="text-gray-600 pb-2 text-md font-normal lg:text-lg lg:mt-0">
            Or if, you don&apos;t have one yet, use our{" "}
            <Link
              href="/resume-builder"
              className="underline underline-offset-2"
            >
              resume builder
            </Link>
          </h1>
          <FlexboxSpacer
            maxWidth={75}
            minWidth={0}
            className="hidden lg:block"
          />
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-400 p-4 rounded-md mt-7"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the PDF files here...</p>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <p>
                  Drag and drop some PDF files here, or click to select PDF
                  files
                </p>
                <button className="btn-primary mt-6 lg:mt-10 lg:mb-2">
                  Browse Files <span aria-hidden="true"></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <FlexboxSpacer
          maxWidth={100}
          minWidth={50}
          className="hidden lg:block"
        />
        <div>
          {files.length > 0 ? (
            <div>
              {/* <button className="button" onClick={handleUpload}>
                Upload
              </button> */}
              <div className="border-dashed border-2 mt-4 border-gray-400 flex justify-center flex-col items-center rounded-md h-fit w-[800px] p-2">
                {thumbs}
                <div className="flex justify-end w-full">
                  <button
                    className="btn-primary mt-2 mr-3"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-dashed border-2 mt-4 border-gray-400 p-4 rounded-md h-[600px] w-[800px]">
              <div className="flex flex-col justify-center items-center mt-40">
                <Image
                  src="/resume-parser2.svg"
                  alt="resume"
                  height={200}
                  width={200}
                />
                Once You upload your resume you can preview it here.....
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
export default ResumeDropzone;
