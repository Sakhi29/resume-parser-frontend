import Image from "next/image";
import interviewImage from "/public/Artboard 59@4x.png";
import { FlexboxSpacer } from "@/components/FlexboxSpacer";
import { Lightbulb } from "lucide-react";
import StartInterviewButton from "@/components/StartInterviewButton";

const buttonStates = {
  default: {
    className: "btn-primary px-1.5 py-2 rounded-full lg:px-4",
    text: "Start Interview"
  },
  loading: {
    className: "btn-primary px-1.5 py-2 rounded-full lg:px-4 opacity-50 cursor-not-allowed",
    text: "Generating...",
    loadingSpinner: (
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
    )
  }
};

const errorContent = {
  message: "Please upload your resume for parsing",
  buttonText: "Go to Parser",
  buttonClassName: "mt-2 bg-primary px-2 py-1 rounded-md"
};

export default function page() {
  return (
    <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 text-gray-900">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Content */}
        <div className="flex flex-col space-y-6 max-w-xl mx-auto lg:mx-0">
          <h2 className="text-primary text-2xl sm:text-3xl font-bold">
            You&apos;re all set!
          </h2>
          <h2 className="text-gray-600 text-xl sm:text-2xl font-bold">
            Click{" "}
            <span className="text-primary">
              &apos;Start Interview&apos;
            </span>{" "}
            to practice with tailored questions.
          </h2>

          {/* Info Box */}
          <div className="bg-gray-100 p-4 sm:p-5 rounded-lg border border-gray-300">
            <h1 className="text-gray-700 text-sm sm:text-base !leading-relaxed">
              <span className="flex items-center font-bold text-gray-900 mb-2">
                <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                Important: Mock Interview Process
              </span>
              <ul className="space-y-2">
                <li>- Your interview will consist of 10 questions tailored to your resume.</li>
                <li>- Please answer each question as you would in a real interview.</li>
                <li>- After completing all questions, you will receive:</li>
                <li className="pl-6">1. Detailed feedback on your responses</li>
                <li className="pl-6">2. Suggestions for improvement</li>
                <li className="pl-6">3. Tips to enhance your performance in real-world interviews.</li>
              </ul>
              <p className="mt-3 text-gray-600 italic">
                This mock interview is designed to help you prepare and gain confidence. Good luck!
              </p>
            </h1>
          </div>

          {/* Button Container */}
          <div className="flex justify-center pt-4">
            <StartInterviewButton 
              buttonStates={buttonStates}
              errorContent={errorContent}
            />
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="w-full max-w-2xl mx-auto lg:mx-0">
          <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] w-full">
            <Image
              src={interviewImage}
              fill={true}
              alt="Interview preparation illustration"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}