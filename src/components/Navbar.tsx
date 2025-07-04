"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import GoogleAvatar from "./GoogleAvatar";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debug: Log session info to check user profile data
  useEffect(() => {
    if (session?.user) {
      console.log("User session data:", {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        // Full session for debugging
        fullSession: session,
      });
    }
  }, [session]);

  return (
    <nav className="w-full bg-gradient-to-r from-white to-blue-50 shadow-lg sticky top-0 z-50 backdrop-filter backdrop-blur-lg bg-opacity-90 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-24 w-24 flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                <img
                  src="/massmailer.svg"
                  alt="Mass Mailer Logo"
                  className="h-32 w-32 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium relative group"
              >
                <span className="text-gray-800 group-hover:text-[#7478E1] transition-colors duration-200">
                  Home
                </span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#7478E1] to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded duration-300"></span>
              </Link>
              {session && (
                <Link
                  href="/compose"
                  className="px-3 py-2 rounded-md text-sm font-medium relative group ml-2"
                >
                  <span className="text-gray-800 group-hover:text-[#7478E1] transition-colors duration-200">
                    Compose Email
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#7478E1] to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded duration-300"></span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#7478E1] hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={showMobileMenu ? "true" : "false"}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="animate-pulse flex items-center space-x-2">
                <div className="h-9 w-9 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full"></div>
                <div className="h-4 w-20 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-md"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {/* User Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <GoogleAvatar
                      user={session.user!}
                      size={40}
                      className="h-10 w-10 ring-2 ring-white ring-offset-1 shadow-md group-hover:shadow-lg group-hover:ring-blue-200 transition-all duration-200"
                    />
                    <div className="hidden sm:flex sm:items-center">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#7478E1] transition-colors duration-200">
                        {session.user?.name?.split(" ")[0] ||
                          session.user?.email?.split("@")[0]}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`ml-1 w-4 h-4 text-gray-500 group-hover:text-[#7478E1] transition-transform duration-300 ${
                          showProfileMenu ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl py-1 z-10 border border-blue-50 transform transition-all duration-300 opacity-100 scale-100 origin-top-right">
                      <div className="px-4 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <div className="flex items-center space-x-3">
                          <GoogleAvatar
                            user={session.user!}
                            size={48}
                            className="ring-2 ring-white shadow-lg"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {session.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {session.user?.email}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                              <span className="text-xs text-green-600">
                                Connected to Gmail
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/compose"
                          className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-blue-100 mr-3 group-hover:bg-blue-200 transition-colors duration-150">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-[#7478E1]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium">
                              Compose New Email
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Create and send emails
                            </p>
                          </div>
                        </Link>

                        <a
                          href="https://myaccount.google.com/profile"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 group"
                        >
                          <div className="p-1.5 rounded-lg bg-gray-100 mr-3 group-hover:bg-gray-200 transition-colors duration-150">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-gray-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium">Google Profile</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Manage your Google account
                            </p>
                          </div>
                        </a>
                      </div>

                      <div className="border-t border-blue-50 mt-1 pt-1 pb-1">
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                        >
                          <div className="p-1.5 rounded-lg bg-red-50 mr-3 group-hover:bg-red-100 transition-colors duration-150">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-red-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium">Sign Out</span>
                            <p className="text-xs text-red-400 mt-0.5">
                              End your session
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 flex items-center gap-2.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="18"
                  height="18"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          showMobileMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm transition-opacity ${
            showMobileMenu ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowMobileMenu(false)}
        ></div>

        {/* Menu panel */}
        <div
          className={`absolute top-0 right-0 w-full max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            showMobileMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={() => setShowMobileMenu(false)}
              className="text-gray-500 hover:text-[#7478E1] focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User info if logged in */}
          {session && (
            <div className="px-5 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <GoogleAvatar
                  user={session.user!}
                  size={48}
                  className="ring-2 ring-white shadow-md"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="px-2 pt-6 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-4 py-3 rounded-lg text-gray-900 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 transition-colors duration-200"
              onClick={() => setShowMobileMenu(false)}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Home
              </div>
            </Link>

            {session && (
              <Link
                href="/compose"
                className="block px-4 py-3 rounded-lg text-gray-900 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 transition-colors duration-200"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  Compose Email
                </div>
              </Link>
            )}
          </div>

          {/* Mobile auth section */}
          {status !== "loading" && !session && (
            <div className="px-5 py-6 border-t border-gray-100 mt-4">
              <button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-2.5 bg-white text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="20"
                  height="20"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Sign in to access all features
              </button>
            </div>
          )}

          {/* Sign out option for mobile when logged in */}
          {session && (
            <div className="px-5 py-4 border-t border-gray-100 mt-auto absolute bottom-0 w-full">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
