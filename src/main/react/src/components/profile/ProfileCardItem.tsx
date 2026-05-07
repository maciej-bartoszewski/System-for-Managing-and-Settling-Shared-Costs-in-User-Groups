import React from 'react'

interface ProfileCardItemProps {
  title: string
  description?: string
  children: React.ReactNode
}

const ProfileCardItem: React.FC<ProfileCardItemProps> = ({ title, description, children }) => {
  return (
    <div>
      <div className="mb-1 flex items-center gap-3">
        <p>{title}</p>
      </div>
      {description && <p className="text-2xs mb-2 md:text-xs">{description}</p>}
      {children}
    </div>
  )
}

export default ProfileCardItem
