"use client";
import React, { useState, useEffect } from "react";
import WebCamera from "@/components/WebCamera";
import { Image } from "lucide-react";

export default function Page() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("interviewQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
    setIsLoading(false);
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      localStorage.removeItem("interviewQuestions");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-primary">Loading questions...</div>
        <Image
          src="/Webinar-rafiki.svg"
          alt="resume"
          height={200}
          width={200}
        />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-red-500">
          No questions found. Please return to the previous page.
        </div>
      </div>
    );
  }

  return (
    <div className="border-dashed border-2 border-gray-400 p-4 rounded-md mx-auto w-full max-w-6xl my-10">
      <div className="relative container mx-auto px-4 py-8">
        {/* Webcam Interface */}
        <div className="absolute top-4 right-4 w-[350px] h-[200px] shadow-md rounded-lg overflow-hidden">
          <WebCamera />
        </div>

        {/* Main Content Area with Questions */}
        <div className="flex flex-col justify-stretch">
          {!isCompleted ? (
            <div className="w-full max-w-2xl p-6">
              <div className="mb-4">
                <span className="text-primary font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-8">
                {questions[currentQuestionIndex]}
              </h2>
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="btn-primary px-6 py-2 rounded-full"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Finish"
                    : "Next Question"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary">
                Interview Completed!
              </h2>
              <p className="mt-4 text-gray-600">
                Thank you for completing the interview. Your responses have been
                recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
