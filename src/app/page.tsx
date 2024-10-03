import React from "react";
import { NavBar } from "@/components/Navbar";
import "./globals.css";
import { Hero } from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-screen-2xl bg-dot px-8 text-gray-900 lg:px-124">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
