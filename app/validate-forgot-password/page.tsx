"use client";

import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Zod schema for OTP validation
const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

const OtpVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Second API Request Mutation (OTP Verification)
  const verifyOtpMutation = useMutation({
    mutationFn: async (values: { otpcode: string }) => {
      try {
        // Retrieve token
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Missing authentication context");
        }

        const response = await axios.post(
          "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/ldapotp/dash/confirm/dashops",
          {
            otpcode: values.otpcode,
          },
          {
            headers: {
              sourceapp: "ldapportal",
              otpfor: "login",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Store second token
        localStorage.setItem("secondToken", response.data.token);

        return response.data;
      } catch (error) {
        console.error("OTP Verification Error:", error);

        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              `OTP Verification failed: ${
                error.response?.status || "Unknown error"
              }`
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Navigate to Login Page
      router.push("/login");
    },
    onError: (error: Error) => {
      setOtpError(error.message);
    },
  });

  // OTP Input Handling Methods
  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: otp.join(""),
    },
    validationSchema: toFormikValidationSchema(OtpSchema),
    onSubmit: (values) => {
      // Reset previous errors
      setOtpError(null);
      // Trigger Second API Request Mutation
      verifyOtpMutation.mutate({ otpcode: values.otp });
    },
  });

  // Update formik values when OTP changes
  useEffect(() => {
    formik.setFieldValue("otp", otp.join(""));
  }, [otp]);

  return (
    <div className="flex h-screen bg-gray-100 px-20 py-10 shadow">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col w-1/2 bg-blue-900 text-white items-center justify-center p-8 gap-4 rounded-bl-lg rounded-tl-lg ">
        <p className="text-lg ">Welcome to</p>
        <h2 className="text-3xl font-bold">Dashen Super App Dashboard</h2>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white p-8 rounded-br-lg rounded-tr-lg">
        <Image
          src="/logos/dashen-logo.png"
          alt="Dashen Bank"
          width={80}
          height={80}
          className="mb-4"
        />

        <h2 className="text-xl font-semibold">OTP Verification</h2>
        <p className="text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your registered contact
        </p>

        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm">
          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-10 h-12 text-center border rounded focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>

          {formik.touched.otp && formik.errors.otp && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {formik.errors.otp}
            </p>
          )}

          {otpError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              <p>{otpError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
