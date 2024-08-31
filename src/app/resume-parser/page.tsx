"use client";
import React from "react";
import ResumeDropzone from "@/app/components/ResumeDropzone";
import { FlexboxSpacer } from "@/app/components/FlexboxSpacer";

export default function page() {
  return (
    <>
      <main className="bg-dot pb-32 text-gray-900">
        <ResumeDropzone />
      </main>
    </>
  );
}
