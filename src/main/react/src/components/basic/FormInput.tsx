import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FormInput: React.FC<FormInputProps> = ({ name, label, error, className, ...rest }) => {
  return (
    <div className={`relative w-full max-w-130 ${className}`}>
      <input
        id={name}
        name={name}
        placeholder=" "
        className={`peer mx-a block w-full rounded-md border px-3 pt-5 pb-1.5 text-xs shadow-sm transition focus:ring-2 focus:outline-none md:text-sm ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-accent bg-surface dark:bg-surface-dark border-gray-300'} `}
        {...rest}
      />
      <label
        htmlFor={name}
        className={`peer-focus:text-2xs peer-[&:not(:placeholder-shown)]:text-2xs text-gray/60 dark:text-gray-dark/60 absolute top-1 left-3 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-[&:not(:placeholder-shown)]:top-1 md:peer-focus:text-xs md:peer-[&:not(:placeholder-shown)]:text-xs ${error ? 'peer-focus:text-red-500 peer-[&:not(:placeholder-shown)]:text-red-500' : ''} `}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default FormInput
