import LanguageSwitcher from '../header/LanguageSwitcher.tsx'
import ThemeToggle from '../header/ThemeToggle.tsx'

function Footer() {
  return (
    <footer className="bg-surface dark:bg-surface-dark text-2xs flex items-center justify-between px-5 py-2 shadow-md md:text-xs">
      <div>&copy; {new Date().getFullYear()} MB.</div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </footer>
  )
}

export default Footer
