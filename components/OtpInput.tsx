import React, { useRef } from "react";

interface OtpInputProps {
  otp: string[];
  handleOtpChange: (index: number, value: string) => void;
  error?: string;
  touched?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, handleOtpChange }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex justify-between gap-2 mb-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d?$/.test(value)) {
              handleOtpChange(index, value);
              if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !otp[index] && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
          className="w-12 h-12 text-center text-lg font-semibold border-2 border-[#1B216C] bg-blue-100 text-gray-900 rounded-md focus:border-blue-700 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-200"
        />
      ))}
    </div>
  );
};

export default OtpInput;
