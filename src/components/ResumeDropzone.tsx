"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getS3URL, uploadFile } from "@/api/helper";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FileWithPreview extends File {
  preview: string;
}

export const ResumeDropzone: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { data }: any = useSession();
  const router = useRouter();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const url = await getS3URL(`uploads/${data.user?.id}_${files[0].name}`);
      if (url) {
        const uploadToS3 = await uploadFile(files[0], url);
        toast.success(
          <div>
            <div>File uploaded successfully!</div>
            <button
              onClick={() => {
                router.push("/interview");
              }}
              className="mt-2 bg-primary px-2 py-1 rounded-md"
            >
              Go to Interview
            </button>
          </div>
        );
      }
    } catch (err) {
      toast.error("Unable to upload file!");
      console.log(err);
    } finally {
      setIsUploading(false);
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
    <div>
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
              Drag and drop some PDF files here, or click to select PDF files
            </p>
            <button className="btn-primary mt-6 lg:mt-10 lg:mb-2">
              Browse Files <span aria-hidden="true"></span>
            </button>
          </div>
        )}
      </div>
      {files.length > 0 && (
        <div className="border-dashed border-2 mt-4 border-gray-400 flex justify-center flex-col items-center rounded-md h-fit w-[800px] p-2">
          {thumbs}
          <div className="flex justify-end w-full">
            <button
              className={`btn-primary mt-2 mr-3 ${
                isUploading ? "cursor-not-allowed" : ""
              }`}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
