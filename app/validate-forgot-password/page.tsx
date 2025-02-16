"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { otpValidationSchema } from "@/utils/validation";
import OtpInput from "@/components/OtpInput";

export default function OtpVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const { otpVerificationMutation } = useAuth();

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const formik = useFormik({
    initialValues: { otp: otp.join("") },
    validationSchema: otpValidationSchema,
    onSubmit: (values) => {
      setOtpError(null);
      otpVerificationMutation.mutate(
        { otpcode: values.otp },
        {
          onSuccess: (data) => {
            localStorage.setItem("secondToken", data.token);
            router.push("/login");
          },
          onError: (error) => {
            setOtpError(error.message || "OTP verification failed.");
          },
        }
      );
    },
  });

  // Use useCallback to prevent function recreation on every render: PERFORMACE REASON
  const updateOtpField = useCallback(() => {
    formik.setFieldValue("otp", otp.join(""));
  }, [otp]);

  useEffect(() => {
    updateOtpField();
  }, [otp, updateOtpField]);

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
          <OtpInput
            otp={otp}
            handleOtpChange={handleOtpChange}
            error={formik.errors.otp}
            touched={formik.touched.otp}
          />

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
            disabled={otpVerificationMutation.isPending}
            className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {otpVerificationMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
