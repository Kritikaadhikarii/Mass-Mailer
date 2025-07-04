"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EmailComposer from "@/components/EmailComposer";
import { EmailData } from "@/types";
import Navbar from "@/components/Navbar";
import ReauthButton from "@/components/ReauthButton";

export default function ComposePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to home page...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Compose Mass Email
            </h1>
            <p className="mt-2 text-gray-600">
              Create and send personalized emails to multiple recipients
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.includes("Error")
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-green-50 text-green-800 border border-green-200"
              }`}
            >
              <div className="whitespace-pre-line">{message}</div>

              {(message.includes("sign") ||
                message.includes("auth") ||
                message.includes("token") ||
                message.includes("email server")) && (
                <div className="mt-4">
                  <ReauthButton className="text-sm py-1 px-3" showHelp={true} />
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border">
            <EmailComposer
              onSendEmails={handleSendEmails}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
