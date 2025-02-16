"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { loginValidationSchema } from "@/utils/validation";
import PasswordInput from "@/components/PasswordInput";
import { Info, X } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const { loginMutation } = useAuth();
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsTokenExpired(true);
      setLoginError(
        "Your session has expired. Please start the authentication process again."
      );
    }
  }, []);

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      setLoginError(null);
      if (isTokenExpired) {
        router.push("/forgot-password");
        return;
      }
      loginMutation.mutate(values, {
        onSuccess: (data) => {
          localStorage.setItem("loginToken", data.token);
          Cookies.set("loginToken", data.token, { expires: 7 });
          localStorage.removeItem("accessToken");
          router.push("/dashboard");
        },
        onError: (error) => {
          setLoginError(
            error.message || "Login failed. Please check your credentials."
          );
        },
      });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white p-8 rounded-br-lg rounded-tr-lg relative">
      {/* Info Icon (Yellow) */}
      <button
        className="absolute top-4 right-4 text-yellow-500"
        onClick={() => setShowInfoPopup(true)}
      >
        <Info size={24} />
      </button>

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="absolute top-16 right-4 bg-white p-4 rounded-lg shadow-lg w-80 z-50">
          <h3 className="font-semibold text-gray-700">Login Info</h3>
          <p className="text-sm text-gray-700">
            Please click <strong>&apos;Forgot PIN&apos;</strong>. On the
            <strong>&apos;Forgot PIN&apos;</strong> page, enter your username.
            After entering your username, we will send you an OTP, which you can
            check in the browser log. Then, enter that OTP to validate it on the
            OTP validation page. After successful validation, you will be
            redirected to the login page, where you can enter your password and
            log in successfully.
          </p>

          <button
            className="text-red-500 mt-3 text-sm font-semibold"
            onClick={() => setShowInfoPopup(false)}
          >
            <X /> Close
          </button>
        </div>
      )}

      {/* Logo */}
      <Image
        src="/logos/dashen-logo.png"
        alt="Dashen Bank"
        width={80}
        height={80}
        className="mb-4"
      />

      <h2 className="text-xl font-semibold">Login</h2>
      <p className="text-gray-500 mb-6">Welcome to Dashen Bank Dashboard</p>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="w-full max-w-sm">
        <PasswordInput
          label="Enter PIN"
          id="password"
          placeholder="********"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.errors.password}
          touched={formik.touched.password}
          disabled={isTokenExpired}
        />

        <button
          type="submit"
          disabled={loginMutation.isPending || isTokenExpired}
          className="w-full bg-[#1B216C]  text-white p-2 rounded  disabled:opacity-50 outline-none"
        >
          {isTokenExpired
            ? "Start Over"
            : loginMutation.isPending
            ? "Signing In..."
            : "Sign In"}
        </button>

        {isTokenExpired ||
          (loginError && (
            <div className="mt-4 text-center text-red-600">
              Your session has expired. Please restart the authentication
              process.
            </div>
          ))}

        <div className="mt-4 text-right">
          <Link
            href="/forgot-password"
            className="text-blue-900 text-sm hover:underline"
          >
            Forgot PIN?
          </Link>
        </div>
      </form>
    </div>
  );
}
