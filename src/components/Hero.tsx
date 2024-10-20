"use client";
import Link from "next/link";
import { FlexboxSpacer } from "./FlexboxSpacer";
import Image from "next/image";
import free from "/public/free.png";
import oneCol from "/public/agreement.png";
import accurate from "/public/accurate.png";
import interview from "/public/interview.png";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const STEPS = [
  { title: "Upload a resume pdf", text: "or create from scratch" },
  { title: "Preview new Resume design", text: "and make edits" },
  { title: "Download new resume", text: "and apply with confidence" },
];

const FEATURES = [
  {
    src: free,
    title: "Free Forever",
    text: "Career AI is a professional website which offers free, easy access for resume building, parsing, and mock interviews, all-in-one",
  },
  {
    src: oneCol,
    title: "One Column Resume",
    text: "Our resume builder uses the most widely accepted one-column template worldwide, optimized for maximum ATS compatibility",
  },
  {
    src: accurate,
    title: "Accurate Parsing",
    text: "We offer precise resume parsing, providing actionable insights for improvement, and generate tailored mock interview questions",
  },
  {
    src: interview,
    title: "AI-powered Mock Interview",
    text: "We empower students, job seekers, and interviewees with tailored questions based on their resumes to excel in interviews",
  },
];

export const Hero = () => {
  const router = useRouter();
  const { data } = useSession();
  const onGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/resume-builder",
    });
  };
  return (
    <>
      <section className="lg:flex lg:h-[750px] lg:justify-center">
        <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
        <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
          <h1 className="text-primary pb-2 text-4xl font-bold lg:text-5xl">
            Build, Upload, Practice:
            <br />
            Your All-in-One Career Launchpad
          </h1>
          <p className="mt-3 text-lg lg:mt-5 lg:text-xl">
            From resume creation to interview simulation, we&apos;ve got you
            covered
          </p>
          {/* <Link href="/resume-builder" className="btn-primary mt-6 lg:mt-14">
            Create Resume <span aria-hidden="true">→</span>
          </Link> */}
          {data && (
            <div className="space-x-4">
              <button
                className="btn-primary mt-6 lg:mt-14"
                onClick={() => router.push("/resume-builder")}
              >
                Create Resume<span aria-hidden="true">→</span>
              </button>
            </div>
          )}
          {!data && (
            <div>
              <button
                className="btn-primary mt-6 lg:mt-14"
                onClick={onGoogleSignIn}
              >
                Create Resume<span aria-hidden="true">→</span>
              </button>
            </div>
          )}
          <p className="mt-3 text-sm text-gray-600 lg:mt-20">
            Already have a resume? Test its ATS readability with the{" "}
            <Link
              href="/resume-parser"
              className="underline underline-offset-2"
            >
              resume parser
            </Link>
          </p>
        </div>
        <FlexboxSpacer
          maxWidth={100}
          minWidth={50}
          className="hidden lg:block"
        />
        <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
          <Image
            src="/Online resume-amico.svg"
            alt="resume"
            height={900}
            width={500}
          />
        </div>
      </section>
      <section className="mx-auto mt-8 rounded-2xl bg-red-50 bg-dot px-8 pb-12 pt-10 lg:mt-2">
        <h1 className="text-center text-3xl font-bold">How It Works</h1>
        <div className="mt-8 flex justify-center">
          <dl className="flex flex-col gap-y-10 lg:flex-row lg:justify-center lg:gap-x-20">
            {STEPS.map(({ title, text }, idx) => (
              <div className="relative self-start pl-14" key={idx}>
                <dt className="text-lg font-bold">
                  <div className="bg-primary absolute left-0 top-1 flex h-10 w-10 select-none items-center justify-center rounded-full p-[3.5px] opacity-80">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                      <div className="text-primary -mt-0.5 text-2xl">
                        {idx + 1}
                      </div>
                    </div>
                  </div>
                  {title}
                </dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="py-16 lg:py-36">
        <div className="mx-auto lg:max-w-4xl">
          <dl className="grid grid-cols-1 justify-items-center gap-y-8 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-16">
            {FEATURES.map(({ src, title, text }) => (
              <div className="px-2" key={title}>
                <div className="relative w-96 self-center pl-16">
                  <dt className="text-2xl font-bold">
                    <Image
                      src={src}
                      className="absolute left-0 top-1 h-12 w-12"
                      alt="Feature icon"
                    />
                    {title}
                  </dt>
                  <dd className="mt-2">{text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
};
