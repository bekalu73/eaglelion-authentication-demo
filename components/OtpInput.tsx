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
  );
};

export default OtpInput;
