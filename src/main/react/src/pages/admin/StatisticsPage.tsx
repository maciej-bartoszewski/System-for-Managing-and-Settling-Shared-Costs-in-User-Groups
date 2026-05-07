import { useEffect, useState } from 'react'
import { type AdminStatistics, getAllStatistics } from '../../api/adminStatisticsService.ts'
import Loading from '../../components/basic/Loading.tsx'
import StorySetImage from '../../components/basic/StorySetImage.tsx'
import Statistics from '../../assets/statistics.svg'
import { FiLogIn, FiUsers } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import { TbCategory } from 'react-icons/tb'
import StatisticsCard from '../../components/admin/statistics/StatisticsCardProps.tsx'
import { useTranslation } from 'react-i18next'

function StatisticsPage() {
  const { t } = useTranslation()
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStatistics()
        setStatistics(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <section className="flex h-full w-full flex-col items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark flex h-full w-full flex-col items-center justify-center rounded-2xl p-5 shadow-md lg:max-w-[90%] lg:flex-row">
        <div className="mb-10 w-full">
          <h1 className="text-accent mb-8 text-center text-2xl font-bold lg:text-3xl">{t('adminStatistics.title')}</h1>
          <StorySetImage
            image={Statistics}
            alt={t('adminStatistics.alt')}
            link="https://storyset.com/data"
            text="Data illustrations by Storyset"
            imgClassName="max-h-200"
          />
        </div>
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
          <StatisticsCard
            icon={<FiUsers className="text-2xl text-white" />}
            title={t('adminStatistics.users.title')}
            value={statistics?.totalUsers || 0}
          >
            <div className="text-gray dark:text-gray-dark flex items-center gap-2">
              <span>{t('adminStatistics.users.googleAccounts')}</span>
              <span className="text-accent font-medium">{statistics?.googleUsersRate || 0}%</span>
            </div>
          </StatisticsCard>

          <StatisticsCard
            icon={<FiLogIn className="text-2xl text-white" />}
            title={t('adminStatistics.logins.title')}
            value={statistics?.loginsInLast24Hours || 0}
          >
            <div className="text-gray dark:text-gray-dark">{t('adminStatistics.logins.last24Hours')}</div>
          </StatisticsCard>

          <StatisticsCard
            icon={<GrGroup className="text-2xl text-white" />}
            title={t('adminStatistics.groups.title')}
            value={statistics?.totalGroups || 0}
          >
            <div className="text-gray dark:text-gray-dark">
              {t('adminStatistics.groups.averageMembers')} {statistics?.averageGroupMembers || 0}
            </div>
          </StatisticsCard>

          <StatisticsCard
            icon={<TbCategory className="text-2xl text-white" />}
            title={t('adminStatistics.categories.title')}
            value={statistics?.totalCategories || 0}
          >
            <div className="text-gray dark:text-gray-dark">
              {t('adminStatistics.categories.mostUsed')} {t(`expenseCategories.${statistics?.mostPopularCategory.toLowerCase()}`) || '-'}
            </div>
          </StatisticsCard>
        </div>
      </div>
    </section>
  )
}

export default StatisticsPage
