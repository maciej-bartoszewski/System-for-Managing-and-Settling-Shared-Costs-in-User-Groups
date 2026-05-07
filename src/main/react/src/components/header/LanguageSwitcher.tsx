import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language

  const setLang = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  return (
    <div className="bg-surface dark:bg-surface-dark border-accent flex gap-2 rounded-full border p-1 shadow-sm">
      <button
        onClick={() => setLang('pl')}
        className={`cursor-pointer rounded-full px-2 py-1 font-medium transition ${
          current === 'pl' ? 'bg-accent text-white shadow' : 'text-accent hover:bg-accent/10 bg-transparent'
        }`}
        aria-pressed={current === 'pl'}
      >
        PL
      </button>
      <button
        onClick={() => setLang('en')}
        className={`cursor-pointer rounded-full px-2 py-1 font-medium transition ${
          current === 'en' ? 'bg-accent text-white shadow' : 'text-accent hover:bg-accent/10 bg-transparent'
        }`}
        aria-pressed={current === 'en'}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher
