"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center">
          <p className="text-xs font-normal text-[#7478E1] mb-4 border border-[#7478E1] rounded-full inline-block px-3 py-1 bg-[#7478E1]/20">
            Simplifying Lives
          </p>
          <Image
            src="/massmailer.svg"
            alt="Mass Mailer Logo
            "
            width={250}
            height={250}
            className="mx-auto mb-6"
          />
          <p className="mt-3 max-w-md mx-auto text-sm text-[#7478E1]/80  md:mt-5 md:text-sm md:max-w-3xl">
            Designed specifically to help you send mass emails with an ease of a
            click.
          </p>

          {session ? (
            <div className="mt-10 space-y-6 text-center">
              <p className="text-md text-gray-700 mb-6 ">
                Welcome back,{" "}
                <span className="text-blue-600">
                  {session.user?.name || session.user?.email}!
                </span>
              </p>
              <Link
                href="/compose"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#7478E1] rounded-full shadow-md hover:bg-[#5f5bbd] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start Composing
              </Link>
            </div>
          ) : (
            <div className="mt-10">
              <p className="text-md text-gray-700 mb-6">
                Sign in with your Google account to get started
              </p>
              <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-blue-100 max-w-2xl mx-auto transition-all duration-300 hover:shadow-xl">
                <h3 className="flex items-center text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Features You'll Love
                </h3>

                <ul className="space-y-4 text-sm text-gray-700">
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-lg">✔</span>
                    End-to-end encryption & privacy-focused
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-lg">✔</span>
                    Powerful rich-text email editor
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-lg">✔</span>
                    Personalized content using recipient names
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-lg">✔</span>
                    Bulk sending made effortless
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-lg">✔</span>
                    Seamless & secure Gmail integration
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
