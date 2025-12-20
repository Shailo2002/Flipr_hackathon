import type { ChangeEvent, KeyboardEvent } from "react";

interface Input {
  type: string;
  placeholder: string;
  value?: any;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

function Input({
  type,
  placeholder,
  onChange,
  className,
  value,
  onKeyDown,
}: Input) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`bg-white border border-slate-100 text-gray-900 text-sm rounded-lg hover:ring-blue-500 hover:border-slate-300 block w-full p-2.5 m-2 ml-0 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}

export default Input;
