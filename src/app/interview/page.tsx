"use client";
import Image from "next/image";
import React from "react";
import interviewImage from "/public/Artboard 59@4x.png";
import { FlexboxSpacer } from "@/components/FlexboxSpacer";
import { Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function page() {
  const { data }: any = useSession();
  return (
    <>
      <main className="mx-auto max-w-screen-2xl bg-dot px-8 text-gray-900 lg:flex flex-row">
        <div className="lg:flex lg:px-16 lg:justify-center lg:items-center">
          <div className="flex flex-col gap-6">
            {/* <h1 className="text-gray-800 pb-2 text-md font-normal lg:text-lg lg:mt-0">
              We offer precise resume parsing, providing actionable insights for
              improvement, and generate tailored mock interview questions.
            </h1> */}
            <h2 className="text-primary pb-2 text-2xl font-bold lg:text-3xl">
              You're all set!
            </h2>
            <h2 className="text-gray-600 pb-2 text-2xl font-bold lg:text-3xl lg:mt-0">
              Click{" "}
              <span className="text-primary pb-2 text-2xl font-bold lg:text-3xl">
                'Start Interview'
              </span>{" "}
              to practice with tailored questions.
            </h2>
            <div className="bg-gray-200 p-3 rounded-md border-[1.5px] border-gray-400">
              <h1 className="text-gray-600 pb-2 text-xs !leading-relaxed font-normal lg:text-sm lg:mt-0">
                <span className="flex items-center font-bold">
                  <Lightbulb className="mr-1" />
                  Important: Mock Interview Process
                </span>
                <br />
                - Your interview will consist of 10 questions tailored to your
                resume.
                <br />- Please answer each question as you would in a real
                interview. <br />
                - After completing all questions, you will receive:
                <br />
                &emsp;1. Detailed feedback on your responses <br />
                &emsp;2. Suggestions for improvement <br />
                &emsp;3. Tips to enhance your performance in real-world
                interviews.
                <br />
                This mock interview is designed to help you prepare and gain
                confidence. Good luck!
              </h1>
            </div>
            <div className="flex justify-center items-center">
              <Link
                href={`interview/${data?.user?.id}`}
                className="btn-primary px-1.5 py-2 rounded-full lg:px-4"
              >
                Start Interview
              </Link>
            </div>

            <FlexboxSpacer
              maxWidth={75}
              minWidth={0}
              className="hidden lg:block"
            />
          </div>
        </div>
        <div>
          <FlexboxSpacer
            maxWidth={100}
            minWidth={50}
            className="hidden lg:block"
          />
          <div className="relative aspect-[600/800] h-[600px] w-[800px]">
            <Image
              src={interviewImage}
              fill={true}
              alt="interview"
              className=""
            />
          </div>
        </div>
      </main>
      {/* <main className="bg-dot text-gray-900">
        <div className="flex-row justify-center items-center">
          <div>
            <p></p>
          </div>
        </div>
      </main> */}
    </>
  );
}
