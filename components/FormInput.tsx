import React from "react";

interface FormInputProps {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
  error,
  touched,
  disabled,
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full p-2 border rounded ${
        touched && error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {touched && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormInput;
