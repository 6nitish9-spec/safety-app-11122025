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
        'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 font-medium',
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
        'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 font-medium bg-white',
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
  <div className="flex items-center justify-between py-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-8 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        checked ? 'bg-green-500' : 'bg-red-500'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={clsx(
          'absolute left-1 text-[10px] font-bold text-white transition-opacity',
          checked ? 'opacity-0' : 'opacity-100'
        )}
      >
        {falseLabel}
      </span>
      <span
        className={clsx(
          'absolute right-1 text-[10px] font-bold text-white transition-opacity',
          checked ? 'opacity-100' : 'opacity-0'
        )}
      >
        {trueLabel}
      </span>
      <span
        className={clsx(
          'inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm',
          checked ? 'translate-x-13' : 'translate-x-1'
        )}
      />
    </button>
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
        'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 font-medium',
        className
      )}
      {...props}
    />
  </div>
);
