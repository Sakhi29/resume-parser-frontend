import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FlexboxSpacer } from "@/components/FlexboxSpacer";
import { ResumeDropzone } from "@/components/ResumeDropzone";

export default function Page() {
  return (
    <main className="mx-auto max-w-screen-2xl px-8 text-gray-900 lg:flex flex-row">
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
          {/* ResumeDropzone will handle client-side state */}
          <ResumeDropzone />
        </div>
      </div>
      <div>
        <FlexboxSpacer
          maxWidth={100}
          minWidth={50}
          className="hidden lg:block"
        />
        <div>
          <div className="border-dashed border-2 mt-4 border-gray-400 p-4 rounded-md h-[600px] w-[800px]">
            <div className="flex flex-col justify-center items-center mt-40">
              <Image
                src="/resume-parser2.svg"
                alt="resume"
                height={200}
                width={200}
              />
              Once you upload your resume you can preview it here.....
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
