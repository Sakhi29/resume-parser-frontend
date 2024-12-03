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
    <div key={file.name} className="w-full">
      <iframe
        src={file.preview}
        title={file.name}
        className="w-full h-[300px] sm:h-[400px] lg:h-[500px]"
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
    <div className="w-full">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors duration-200 ease-in-out hover:border-primary/60 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4 py-8 px-4 text-center">
          {isDragActive ? (
            <p className="text-primary text-lg">Drop your PDF file here...</p>
          ) : (
            <>
              <p className="text-gray-600 text-sm sm:text-base">
                Drag and drop your PDF file here, or click to select
              </p>
              <button className="btn-primary mt-2">
                Browse Files
              </button>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            {thumbs}
          </div>
          <div className="flex justify-end">
            <button
              className={`btn-primary ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
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
