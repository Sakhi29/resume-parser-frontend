"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();
  const isHomePage = pathName === "/";

  const { data } = useSession();
  const router = useRouter();
  const onGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };
  const onGoogleSignOut = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <header
      aria-label="Site Header"
      className="flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12 relative"
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Resume Logo"
            height={40}
            width={40}
          />
          <div className="ml-2 text-primary font-bold text-2xl">CareerAI</div>
        </Link>

        {/* Hamburger menu button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav
          aria-label="Site Nav Bar"
          className="hidden lg:flex items-center gap-2 text-sm font-medium"
        >
          {[
            ["/resume-builder", "Builder"],
            ["/resume-parser", "Parser"],
            ["/interview", "Interview"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
              href={href}
            >
              {text}
            </Link>
          ))}
          {!data ? (
            <button
              className="btn-primary px-1.5 py-2 rounded-md lg:px-4"
              onClick={onGoogleSignIn}
            >
              SignIn
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="px-2 py-1 rounded-md flex items-center gap-2">
                  <Image
                    className="rounded-full"
                    src={data.user?.image || ""}
                    height={30}
                    width={30}
                    alt="user"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onGoogleSignOut}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 lg:hidden">
            <nav className="flex flex-col p-4">
              {[
                ["/resume-builder", "Builder"],
                ["/resume-parser", "Parser"],
                ["/interview", "Interview"],
              ].map(([href, text]) => (
                <Link
                  key={text}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100"
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {text}
                </Link>
              ))}
              {!data ? (
                <button
                  className="btn-primary m-4 px-4 py-2 rounded-md text-center"
                  onClick={onGoogleSignIn}
                >
                  SignIn
                </button>
              ) : (
                <button
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 text-left"
                  onClick={onGoogleSignOut}
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
