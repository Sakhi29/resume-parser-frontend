import Footer from "@/components/Footer";
import { NavBar } from "@/components/Navbar";

export default function TemplateCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <NavBar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
