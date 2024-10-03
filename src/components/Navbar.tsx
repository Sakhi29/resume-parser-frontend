"use client";
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

export const NavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";

  const { data } = useSession();
  const router = useRouter();
  const onGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/resume-builder" });
  };
  const onGoogleSignOut = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <header
      aria-label="Site Header"
      className={`flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12 bg-dot`}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Resume Logo"
            // className="object-contain"
            height={40}
            width={40}
          />
          <div className="ml-2 text-primary font-bold text-2xl">CareerAI</div>
        </Link>

        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
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
                <div className=" px-2 py-1 rounded-md flex items-center gap-2">
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
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
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
      </div>
    </header>
  );
};
