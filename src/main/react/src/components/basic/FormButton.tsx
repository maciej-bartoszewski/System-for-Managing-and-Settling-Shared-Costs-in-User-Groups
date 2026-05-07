import React from 'react'

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const FormButton: React.FC<FormButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      className={`bg-accent hover:bg-accent/60 duration flex min-h-10 w-full max-w-130 cursor-pointer flex-row items-center justify-center gap-2 rounded-lg py-2 text-xs text-white shadow-sm transition sm:text-sm ${className || ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default FormButton
