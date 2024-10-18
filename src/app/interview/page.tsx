"use client";
import Image from "next/image";
import React, { useState } from "react";
import interviewImage from "/public/Artboard 59@4x.png";
import { FlexboxSpacer } from "@/components/FlexboxSpacer";
import { Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateQuestions } from "@/api/helper";

interface QuestionResponse {
  questions: string[];
}

export default function page() {
  const { data }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerateQuestions = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await generateQuestions(data?.user?.id);
      console.log("Generated response:", response); // Debug log

      // Check if response exists and has questions property
      if (!response || !("questions" in response)) {
        throw new Error("Invalid response format");
      }

      const { questions } = response as QuestionResponse;

      // Check if questions is an array with items
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("No questions received");
      }

      // Store questions in localStorage
      localStorage.setItem("interviewQuestions", JSON.stringify(questions));

      // Navigate to interview page
      router.push(`/interview/${data?.user?.id}`);
    } catch (error) {
      console.error("Error details:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate questions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-screen-2xl px-8 text-gray-900 lg:flex flex-row">
        <div className="lg:flex lg:px-16 lg:justify-center lg:items-center">
          <div className="flex flex-col gap-6">
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
              <button
                onClick={handleGenerateQuestions}
                disabled={isLoading}
                className={`btn-primary px-1.5 py-2 rounded-full lg:px-4 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Start Interview"
                )}
              </button>
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
    </>
  );
}
