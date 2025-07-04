"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EmailComposer from "@/components/EmailComposer";
import { EmailData } from "@/types";
import Navbar from "@/components/Navbar";
import ReauthButton from "@/components/ReauthButton";
import CSVUploadModal from "@/components/CSVUploadModal";

export default function ComposePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [recipients, setRecipients] = useState<{ name: string; email: string }[]>(
    []
  );

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center px-4">
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-100"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
            </div>
          </div>
          <p className="text-blue-800 font-medium text-lg">
            Loading your workspace
          </p>
          <p className="text-blue-600/70 text-sm mt-1 animate-pulse">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center px-4">
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-100"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
          <p className="text-blue-800 font-medium text-lg">Redirecting you</p>
          <p className="text-blue-600/70 text-sm mt-1 animate-pulse">
            Taking you to the home page
          </p>
        </div>
      </div>
    );
  }

  const handleSendEmails = async (emailData: EmailData) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`${result.message}`);

        if (result.failed > 0 && result.errors) {
          const errorDetails = result.errors
            .map(
              (err: any) => `${err.recipient}: ${err.error || "Unknown error"}`
            )
            .join("\n");

          console.error("Some emails failed to send:", errorDetails);

          if (result.failed === 1 && result.errors[0]) {
            setMessage(
              (prev) =>
                `${prev}\n\nError detail: ${
                  result.errors[0].error || "Unknown error"
                }`
            );
          } else if (result.failed > 1) {
            setMessage(
              (prev) =>
                `${prev}\n\nSome emails failed. Check console for details.`
            );
          }
        }
      } else {
        setMessage(`Error: ${result.error || "Failed to send emails"}`);

        if (result.errors && Array.isArray(result.errors)) {
          console.error("Email sending errors:", result.errors);
        }

        if (response.status === 401) {
          setMessage(
            (prev) =>
              `${prev}\n\nPlease try signing out and back in to refresh your authorization.`
          );
        }
      }
    } catch (error: any) {
      setMessage(
        `Failed to send emails. Please try again. ${error.message || ""}`
      );
      console.error("Send email error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCSVData = (data: { name: string; email: string }[]) => {
    setRecipients(data);
    setShowCSVModal(false);
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              <span className="text-[#7478E1]">Compose Mass Email</span>
            </h1>
            <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
              Create and send personalized emails to multiple recipients with
              ease
            </p>
            <button
              onClick={() => setShowCSVModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#7478E1] hover:bg-[#5A5ED9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7478E1]"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload CSV Recipients
            </button>
          </div>

          {message && (
            <div
              className={`mb-8 p-5 rounded-lg shadow-md transition-all duration-300 ${
                message.includes("Error")
                  ? "bg-red-50 text-red-800 border-l-4 border-red-500"
                  : "bg-green-50 text-green-800 border-l-4 border-green-500"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {message.includes("Error") ? (
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="whitespace-pre-line text-base">{message}</div>

                  {(message.includes("sign") ||
                    message.includes("auth") ||
                    message.includes("token") ||
                    message.includes("email server")) && (
                    <div className="mt-4">
                      <ReauthButton
                        className="text-sm py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
                        showHelp={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <EmailComposer
              onSendEmails={handleSendEmails}
              isLoading={isLoading}
              preloadedRecipients={recipients}
            />
          </div>

          <CSVUploadModal
            isOpen={showCSVModal}
            onClose={() => setShowCSVModal(false)}
            onUpload={handleCSVData}
          />

          <style jsx global>{`
            .bg-pattern {
              background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z"
                fill="%23bfdbfe"
                fill-opacity="0.1"
                fill-rule="evenodd"
              />
              %3E%3C/svg%3E");
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
