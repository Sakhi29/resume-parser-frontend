import "./globals.css";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-2xl bg-dot px-8 pb-32 text-gray-900 lg:px-124">
      <Hero />
    </main>
  );
}
