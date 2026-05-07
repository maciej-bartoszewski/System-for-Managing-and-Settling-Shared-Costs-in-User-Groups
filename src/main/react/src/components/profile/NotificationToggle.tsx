import React from 'react'

interface NotificationToggleProps {
  id: string
  title: string
  description: string
  checked: boolean
  onChange: (id: string) => void
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ id, title, description, checked, onChange }) => {
  const handleToggleClick = () => {
    onChange(id)
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-1 flex-col gap-1">
        <p>{title}</p>
        <p className="text-2xs md:text-xs">{description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="relative inline-block w-12 cursor-pointer align-middle select-none" onClick={handleToggleClick}>
          <input type="checkbox" id={id} name={id} checked={checked} onChange={(e) => e.stopPropagation()} className="sr-only" />
          <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors dark:bg-gray-700"></div>
          <div
            className={`absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white transition-transform ${
              checked ? '!bg-accent translate-x-5' : ''
            }`}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default NotificationToggle
