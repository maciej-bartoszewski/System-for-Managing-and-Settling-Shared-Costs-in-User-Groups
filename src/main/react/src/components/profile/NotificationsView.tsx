import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbBellRinging } from 'react-icons/tb'
import ProfileViewLayout from './ProfileViewLayout.tsx'
import NotificationToggle from './NotificationToggle.tsx'
import { useAuth } from '../../contexts/AuthContext'
import { getUserNotificationPreferences, type NotificationPreferencesDto, updateUserNotificationPreferences } from '../../api/userService'
import { showError, showSuccess } from '../alerts/swalAlerts'

const NotificationsView = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationPreferencesDto>({
    notifyNewExpense: false,
    notifyDebtReminder: false,
    notifyAddedToGroup: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      if (!user) return

      try {
        const preferences = await getUserNotificationPreferences(user.id)
        setNotifications(preferences)
      } catch (error) {
        console.error('Error fetching notification preferences:', error)
        showError(t('profilePage.notifications.errors.fetchFailed'))
      } finally {
        setLoading(false)
      }
    }

    fetchNotificationPreferences()
  }, [user, t])

  const handleChange = (id: string) => {
    setNotifications((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      await updateUserNotificationPreferences(user.id, notifications)
      showSuccess(t('profilePage.notifications.preferencesUpdated'))
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      showError(t('profilePage.notifications.errors.updateFailed'))
    }
  }

  const notificationItems = [
    {
      id: 'notifyNewExpense',
      title: t('profilePage.notifications.newExpense.title'),
      description: t('profilePage.notifications.newExpense.description'),
    },
    {
      id: 'notifyNewSettlement',
      title: t('profilePage.notifications.newSettlement.title'),
      description: t('profilePage.notifications.newSettlement.description'),
    },
    {
      id: 'notifyAddedToGroup',
      title: t('profilePage.notifications.addedToGroup.title'),
      description: t('profilePage.notifications.addedToGroup.description'),
    },
  ]

  return (
    <ProfileViewLayout
      icon={TbBellRinging}
      titleKey="profilePage.notifications.title"
      subtitleKey="profilePage.notifications.subtitle"
      onSubmit={handleSubmit}
    >
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="border-t-accent h-6 w-6 animate-spin rounded-full border-2 border-gray-300"></div>
        </div>
      ) : (
        <>
          {notificationItems.map((item) => (
            <NotificationToggle
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              checked={notifications[item.id as keyof typeof notifications]}
              onChange={handleChange}
            />
          ))}
        </>
      )}
    </ProfileViewLayout>
  )
}

export default NotificationsView
