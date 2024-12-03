import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/resume-builder", label: "Resume Builder" },
  { href: "/resume-parser", label: "Resume Parser" },
  { href: "/interview", label: "Mock Interviews" },
  { href: "/contact", label: "Contact Us" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com", Icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
];

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary/95 to-primary">
      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Upskill for a better future
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
              Transform Your Resume with AI
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/80">
              Utilize our advanced AI tools to build the perfect resume, analyze your
              strengths, and prepare for interviews with confidence.
            </p>
            <Link
              href="/resume-builder"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-pink-500 px-8 py-3 text-base font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation & Social Links */}
      <div className="border-t border-white/10 bg-primary/95">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Logo and Navigation Links */}
            <div className="space-y-8">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="CareerAI Logo"
                  width={32}
                  height={32}
                  className="brightness-0 invert"
                />
                <span className="text-lg font-bold text-white">CareerAI</span>
              </Link>
              
              {/* Navigation */}
              <nav className="flex flex-wrap gap-x-8 gap-y-4">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-start sm:items-end space-y-6">
              <div className="flex gap-6">
                {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              <p className="text-sm text-white/60">
                Contact us: support@careerai.com
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-center text-sm text-white/60">
              &copy; {new Date().getFullYear()} CareerAI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
