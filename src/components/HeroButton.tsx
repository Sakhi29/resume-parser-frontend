"use client";

import { useRouter } from "next/navigation";

export const HeroButton = () => {
  const router = useRouter();

  return (
    <button
      className="btn-primary mt-6 lg:mt-14"
      onClick={() => router.push("/resume-builder")}
    >
      Create Resume<span aria-hidden="true">→</span>
    </button>
  );
};