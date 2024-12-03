"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ResumeDropzone, ResumeDropzoneRef } from "@/components/ResumeDropzone";

export default function Page() {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dropzoneRef = useRef<ResumeDropzoneRef>(null);

  const handleUpload = async () => {
    if (dropzoneRef.current) {
      await dropzoneRef.current.upload();
    }
  };

  return (
    <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 text-gray-900">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Upload Section */}
        <div className="flex flex-col space-y-6 max-w-xl mx-auto lg:mx-0">
          <h1 className="text-gray-800 text-base sm:text-lg font-normal">
            We offer precise resume parsing, providing actionable insights for
            improvement, and generate tailored mock interview questions.
          </h1>
          <h2 className="text-primary text-2xl sm:text-3xl font-bold">
            Upload your resume here for parsing
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal">
            Or if, you don&apos;t have one yet, use our{" "}
            <Link
              href="/resume-builder"
              className="text-primary hover:text-primary/80 underline underline-offset-2"
            >
              resume builder
            </Link>
          </p>
          <ResumeDropzone 
            ref={dropzoneRef}
            onFileSelect={setPdfPreview}
            setIsUploading={setIsUploading}
          />
        </div>

        {/* Right Column - Preview Section */}
        <div className="w-full max-w-3xl mx-auto lg:mx-0">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 h-[400px] sm:h-[500px] lg:h-[600px] w-full">
            {pdfPreview ? (
              <div className="flex flex-col h-full">
                <iframe
                  src={pdfPreview}
                  className="w-full flex-1"
                  title="Resume Preview"
                />
                <button
                  className={`btn-primary w-full mt-4 ${
                    isUploading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload to Start Interview"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <Image
                  src="/resume-parser2.svg"
                  alt="resume preview"
                  height={150}
                  width={150}
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                />
                <p className="text-gray-500 text-center text-sm sm:text-base">
                  Once you upload your resume you can preview it here.....
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
