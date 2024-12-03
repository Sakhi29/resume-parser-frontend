"use client";

import React, { useState, useEffect } from "react";
import WebCamera from "@/components/WebCamera";
import Image from "next/image";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useRouter } from "next/navigation";

interface InterviewType {
  question: string;
  answer: string;
}

export default function Page() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<InterviewType[]>([]);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  const { transcript, resetTranscript } = useSpeechRecognition();

  const [currentTranscript, setCurrentTranscript] = useState("");

  useEffect(() => {
    if (transcript) {
      setCurrentTranscript(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("interviewQuestions");
    setQuestions(storedQuestions ? JSON.parse(storedQuestions) : []);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
      } else {
        throw new Error(data.error || "Evaluation failed");
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setEvaluation(
        "Sorry, we encountered an error while generating your evaluation. Please try again later or contact support if the problem persists."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (!currentTranscript.trim()) {
      alert("Please provide an answer before proceeding.");
      return;
    }

    const responseToLLM = {
      question: questions[currentQuestionIndex],
      answer: currentTranscript.trim(),
    };
    setAnswers(prev => [...prev, responseToLLM]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      localStorage.removeItem("interviewQuestions");
    }

    setCurrentTranscript("");
    resetTranscript();
  };

  const toggleRecording = () => {
    if (isRecording) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsRecording(!isRecording);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-primary font-medium">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Image
            src="/Webinar-rafiki.svg"
            alt="No questions"
            height={200}
            width={200}
            className="mx-auto mb-4"
          />
          <div className="text-red-500 font-medium">
            No questions found. Please return to the previous page.
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-4 btn-primary px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {!isCompleted ? (
          <div className="relative">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question and Controls */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                  {questions[currentQuestionIndex]}
                </h2>
                
                <div className="space-y-6">
                  {/* Transcript Display */}
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[150px]">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Your Answer:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {currentTranscript || "Start speaking to see your answer here..."}
                    </p>
                  </div>

                  {/* Recording Controls */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={toggleRecording}
                      className={`flex items-center px-6 py-2 rounded-lg transition-colors
                        ${isRecording 
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-primary hover:bg-primary/90 text-white"
                        }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-200 animate-pulse" : "bg-white"} mr-2`}></span>
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>
                    
                    <button
                      onClick={handleNext}
                      className="flex-1 sm:flex-none bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next Question"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Webcam Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-4 aspect-video">
                  <WebCamera />
                </div>
                
                {/* Interview Tips */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-3">Interview Tips</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Speak clearly and at a moderate pace</li>
                    <li>• Maintain eye contact with the camera</li>
                    <li>• Use specific examples in your answers</li>
                    <li>• Take a brief pause if you need to think</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            {!evaluation ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Interview Completed!
                </h2>
                <p className="text-gray-600 mb-8">
                  Thank you for completing the interview. Click below to get your evaluation.
                </p>
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="btn-primary px-8 py-3 rounded-lg text-white"
                >
                  {isEvaluating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Generating Evaluation...
                    </div>
                  ) : (
                    "Get Evaluation"
                  )}
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Interview Evaluation
                </h2>
                <div className="prose max-w-none mb-8">
                  <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-800">
                    {evaluation}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => router.push("/")}
                    className="btn-primary px-6 py-2 rounded-lg"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
