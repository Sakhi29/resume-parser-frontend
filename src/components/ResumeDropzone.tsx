"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useDropzone } from "react-dropzone";
import { getS3URL, uploadFile } from "@/api/helper";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FileWithPreview extends File {
  preview: string;
}

interface ResumeDropzoneProps {
  onFileSelect: (preview: string) => void;
  setIsUploading: (isUploading: boolean) => void;
}

export interface ResumeDropzoneRef {
  upload: () => Promise<void>;
}

const ResumeDropzone = forwardRef<ResumeDropzoneRef, ResumeDropzoneProps>(
  ({ onFileSelect, setIsUploading }, ref) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const { data }: any = useSession();
    const router = useRouter();

    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setFiles(newFiles);
        if (newFiles[0]) {
          onFileSelect(newFiles[0].preview);
        }
      },
      [onFileSelect]
    );

    useEffect(() => {
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    const handleUpload = async () => {
      if (!files.length) {
        toast.error("Please select a file first");
        return;
      }

      setIsUploading(true);
      try {
        const url = await getS3URL(
          `uploads/${data?.user?.id}_${files[0].name}`
        );
        if (url) {
          await uploadFile(files[0], url);
          toast.success(
            <div>
              <div>File uploaded successfully!</div>
              <button
                onClick={() => router.push("/interview")}
                className="mt-2 bg-primary px-2 py-1 rounded-md text-white"
              >
                Go to Interview
              </button>
            </div>
          );
          router.push("/interview");
        }
      } catch (err) {
        toast.error("Unable to upload file!");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      upload: handleUpload,
    }));

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
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
                <button className="btn-primary mt-2">Browse Files</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ResumeDropzone;
