import type { Metadata } from "next";
import "./globals.css";
import CustomProvider from "./CustomProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CareerAI",
  description:
    "Build, Upload, Practice: Your All-in-One Career Launchpad. From resume creation to interview simulation, we've got you covered",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CustomProvider>
          {/* <NavBar /> */}
          <Toaster richColors />
          {children}
          {/* <Footer /> */}
        </CustomProvider>
      </body>
    </html>
  );
}
