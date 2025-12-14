import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <input
      className={twMerge(
        'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 font-medium transition-shadow',
        className
      )}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  className,
  ...props
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <select
      className={twMerge(
        'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 font-medium bg-white transition-shadow',
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  trueLabel = 'ON',
  falseLabel = 'OFF',
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
    <label className="text-sm font-medium text-gray-700 flex-1">{label}</label>
    <div className="flex items-center gap-3 self-end sm:self-auto">
      <span className={clsx("text-xs font-bold w-10 text-right transition-colors", !checked ? "text-red-500" : "text-gray-300")}>
        {falseLabel}
      </span>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          checked ? 'bg-green-500' : 'bg-red-500'
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={clsx(
            'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-7' : 'translate-x-0'
          )}
        />
      </button>

      <span className={clsx("text-xs font-bold w-10 text-left transition-colors", checked ? "text-green-600" : "text-gray-300")}>
        {trueLabel}
      </span>
    </div>
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <textarea
      className={twMerge(
        'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 font-medium transition-shadow',
        className
      )}
      {...props}
    />
  </div>
);