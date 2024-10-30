"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateQuestions } from "@/api/helper";
import { toast } from "sonner";

interface ButtonState {
  className: string;
  text: string;
  loadingSpinner?: React.ReactNode;
}

interface ButtonStates {
  default: ButtonState;
  loading: ButtonState;
}

interface ErrorContent {
  message: string;
  buttonText: string;
  buttonClassName: string;
}

interface Props {
  buttonStates: ButtonStates;
  errorContent: ErrorContent;
}

interface QuestionResponse {
  questions: string[];
}

export default function StartInterviewButton({ buttonStates, errorContent }: Props) {
  const { data }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerateQuestions = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await generateQuestions(data?.user?.id);
      
      if (!response || !("questions" in response)) {
        throw new Error("Invalid response format");
      }

      const { questions } = response as QuestionResponse;

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("No questions received");
      }

      localStorage.setItem("interviewQuestions", JSON.stringify(questions));
      router.push(`/interview/${data?.user?.id}`);
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        <div>
          <div>{errorContent.message}</div>
          <button
            onClick={() => router.push("/resume-parser")}
            className={errorContent.buttonClassName}
          >
            {errorContent.buttonText}
          </button>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentState = isLoading ? buttonStates.loading : buttonStates.default;

  return (
    <button
      onClick={handleGenerateQuestions}
      disabled={isLoading}
      className={currentState.className}
    >
      {isLoading ? (
        <span className="flex items-center">
          {currentState.loadingSpinner}
          {currentState.text}
        </span>
      ) : (
        currentState.text
      )}
    </button>
  );
}