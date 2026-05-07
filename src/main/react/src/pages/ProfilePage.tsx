import { useState } from 'react'
import InfoView from '../components/profile/InfoView.tsx'
import ProfileMenu from '../components/profile/ProfileMenu.tsx'
import EmailView from '../components/profile/EmailView.tsx'
import PasswordView from '../components/profile/PasswordView.tsx'
import NotificationsView from '../components/profile/NotificationsView.tsx'

function ProfilePage() {
  const [selectedView, setSelectedView] = useState('info')

  const renderView = () => {
    switch (selectedView) {
      case 'info':
        return <InfoView />
      case 'email':
        return <EmailView />
      case 'password':
        return <PasswordView />
      case 'notifications':
        return <NotificationsView />
      default:
        return null
    }
  }

  return (
    <section className="h-full w-full py-5 lg:p-5">
      <div className="m-3 flex min-w-3/4 flex-col gap-5 lg:m-8 lg:flex-row lg:gap-10">
        <ProfileMenu selected={selectedView} onSelect={setSelectedView} />
        <div className="bg-surface dark:bg-surface-dark w-full rounded-2xl p-3 shadow-md lg:w-2/3 lg:p-10">
          <div className="mx-auto flex flex-col gap-5 md:w-4/5 lg:w-2/3">{renderView()}</div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
