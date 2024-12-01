"use client";
import React, { useState, useEffect } from "react";
import WebCamera from "@/components/WebCamera";
import Image from "next/image";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useRouter } from "next/navigation";

interface InterviewType {
  question: string;
  answer: string;
}

const dummyQuestions = [
  "1. Can you explain the difference between HTML, CSS, and JavaScript?",
  "2. What are some new features introduced in HTML5?",
  "3. Describe the CSS box model and how it affects element layout on a web page.",
  "4. How does Flexbox differ from CSS Grid, and when would you use each?",
  "5. Explain the concept of closures in JavaScript and provide an example use case.",
  "6. What is the DOM, and how does JavaScript interact with it?",
  "7. Can you explain the purpose of asynchronous programming in JavaScript? How do promises and async/await help?",
  "8. What are RESTful APIs, and how would you use one in a web application?",
  "9. How does client-side routing work in a single-page application (SPA)?",
  "10. Explain the difference between SQL and NoSQL databases. What are some use cases for each?",
];

export default function Page() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<InterviewType[]>([]);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const router = useRouter();

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const storedQuestions = localStorage.getItem("interviewQuestions");
    if (!storedQuestions) {
      setQuestions(dummyQuestions);
    }
    setIsLoading(false);
  }, []);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch("/api/gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses: answers }),
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
      } else {
        throw new Error("Evaluation failed");
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setEvaluation("Failed to generate evaluation. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    const responseToLLM = {
      question: questions[currentQuestionIndex],
      answer: transcript,
    };
    setAnswers((prev) => [...prev, responseToLLM]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      localStorage.removeItem("interviewQuestions");
    }

    resetTranscript();
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
        {!isCompleted && (
          <div className="absolute top-4 right-4 w-[350px] h-[200px] shadow-md rounded-lg overflow-hidden">
            <WebCamera />
          </div>
        )}

        {/* Main Content Area with Questions or Evaluation */}
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
              <button
                onClick={() => {
                  SpeechRecognition.startListening({ continuous: true });
                }}
                className="btn-primary px-6 py-2 rounded-full mr-2"
              >
                start recording
              </button>
              <button
                onClick={() => {
                  SpeechRecognition.stopListening();
                }}
                className="btn-primary px-6 py-2 rounded-full"
              >
                stop recording
              </button>
              <p>transcript: {transcript}</p>
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
            <div className="w-full">
              {!evaluation ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    Interview Completed!
                  </h2>
                  <p className="mt-4 text-gray-600 mb-6">
                    Thank you for completing the interview. Click below to get
                    your evaluation.
                  </p>
                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating}
                    className="btn-primary px-6 py-2 rounded-full"
                  >
                    {isEvaluating
                      ? "Generating Evaluation..."
                      : "Get Evaluation"}
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    Interview Evaluation
                  </h2>
                  <div className="whitespace-pre-wrap text-gray-800">
                    {evaluation}
                  </div>
                  <button
                    onClick={() => router.push("/interview")}
                    disabled={isEvaluating}
                    className="btn-primary px-6 py-2 rounded-full"
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
