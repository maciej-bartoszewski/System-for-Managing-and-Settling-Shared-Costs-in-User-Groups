import { useTranslation } from 'react-i18next'
import Blocked from '../../assets/blocked.svg'
import StorySetImage from '../../components/basic/StorySetImage.tsx'

function BlockedPage() {
  const { t } = useTranslation()

  return (
    <section className="flex h-full w-full items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark flex h-full min-w-3/4 flex-col items-center justify-center rounded-2xl p-10 shadow-md md:p-20">
        <StorySetImage
          image={Blocked}
          alt={t('notFound.alt')}
          link="https://storyset.com/process"
          text="Process illustrations by Storyset"
        />
        <h1 className="text-accent mt-5 mb-2 text-center text-2xl font-bold md:text-3xl">{t('blocked.title')}</h1>
        <p className="mb-2 text-center">{t('blocked.description')}</p>
      </div>
    </section>
  )
}

export default BlockedPage
