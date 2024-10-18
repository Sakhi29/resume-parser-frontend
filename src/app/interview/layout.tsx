import Footer from "@/components/Footer";
import { NavBar } from "@/components/Navbar";

export default function TemplateCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-dot">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
