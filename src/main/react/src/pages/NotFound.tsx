import { useTranslation } from 'react-i18next'
import NotFoundImage from '../assets/not-found.svg'
import StorySetImage from '../components/basic/StorySetImage.tsx'

function NotFound() {
  const { t } = useTranslation()

  return (
    <section className="flex h-full w-full items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark flex h-full min-w-3/4 flex-col items-center justify-center rounded-2xl p-10 shadow-md md:p-20">
        <StorySetImage
          image={NotFoundImage}
          alt={t('notFound.alt')}
          link="https://storyset.com/internet"
          text="Internet illustrations by Storyset"
        />
        <h1 className="text-accent mt-5 mb-2 text-center text-2xl font-bold md:text-3xl">{t('notFound.title')}</h1>
        <p className="mb-2 text-center">{t('notFound.description')}</p>
      </div>
    </section>
  )
}

export default NotFound
