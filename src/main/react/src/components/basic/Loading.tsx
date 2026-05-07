interface LoadingProps {
  className?: string
}

function Loading({ className = '' }: LoadingProps) {
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center ${className}`}>
      <div className="border-accent h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
    </div>
  )
}

export default Loading
