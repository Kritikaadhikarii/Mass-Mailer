"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#8ED0FF_100%)]"></div>

      {/* Left side spark */}
      <div className="absolute left-[8%] top-1/3 animate-pulse delay-1000">
        <Image
          src="/spark.svg"
          alt="Spark"
          width={120}
          height={120}
          className="hover:rotate-360 transition-transform duration-700 cursor-pointer"
          style={{ transform: "rotate(0deg)" }}
        />
      </div>

      {/* Right side spark */}
      <div className="absolute right-[10%] top-2/3 animate-pulse delay-1000">
        <Image
          src="/spark.svg"
          alt="Spark"
          width={120}
          height={120}
          className="hover:rotate-360 transition-transform duration-700 cursor-pointer"
          style={{ transform: "rotate(0deg)" }}
        />
      </div>

      <main className="flex flex-col justify-center items-center">
        <div className="mt-[12%] text-center">
          <div className="flex justify-center items-center mb-4 text-[#8ED0FF] gap-2 border border-[#8ED0FF] rounded-full py-2 px-4 w-fit mx-auto">
            <p className="text-sm text-center">Welcome </p>
            <Sparkles size={14} />
          </div>
          <h1 className="text-4xl font-light text-gray-800">
            Hey <span>{session?.user?.name}!</span> Sending emails in bulk made
            easier!
          </h1>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700">Cool features you'll love:</p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 my-6 max-w-6xl mx-auto px-4">
            <div className="w-72 bg-white py-6 px-4 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <Image
                  src="/spark.svg"
                  alt="Security"
                  width={40}
                  height={40}
                  className="mb-4"
                />
                <h2 className="text-md font-regular text-[#8ED0FF] text-center">
                  Fully secured and protected.
                  <br />
                  <p className="text-sm font-light text-gray-600 text-center mt-4">
                    We've taken your data protection very seriously. None of
                    your data are stored in any of the databases.
                  </p>
                </h2>
              </div>
            </div>

            <div className="w-72 bg-white py-6 px-4 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <Image
                  src="/spark.svg"
                  alt="Bulk Email"
                  width={40}
                  height={40}
                  className="mb-4"
                />
                <h2 className="text-md font-regular text-[#8ED0FF] text-center">
                  Send emails in bulk instantly.
                  <br />
                  <p className="text-sm font-light text-gray-600 text-center mt-4">
                    Upload your CSV file and send personalized emails to
                    thousands of recipients with just one click.
                  </p>
                </h2>
              </div>
            </div>

            <div className="w-72 bg-white py-6 px-4 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <Image
                  src="/spark.svg"
                  alt="Easy Interface"
                  width={40}
                  height={40}
                  className="mb-4"
                />
                <h2 className="text-md font-regular text-[#8ED0FF] text-center">
                  Simple and intuitive interface.
                  <br />
                  <p className="text-sm font-light text-gray-600 text-center mt-4">
                    Clean, modern design that makes sending bulk emails
                    effortless. No technical knowledge required.
                  </p>
                </h2>
              </div>
            </div>

            <div className="w-72 bg-white py-6 px-4 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <Image
                  src="/spark.svg"
                  alt="Easy Interface"
                  width={40}
                  height={40}
                  className="mb-4"
                />
                <h2 className="text-md font-regular text-[#8ED0FF] text-center">
                  Get to add attachments
                  <br />
                  <p className="text-sm font-light text-gray-600 text-center mt-4">
                    You can add pdf attachments per email, making it easy to
                    send it along with your email.
                  </p>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
