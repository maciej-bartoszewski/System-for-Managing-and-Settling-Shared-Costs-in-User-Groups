import { useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const newDark = !dark
    setDark(newDark)
    document.documentElement.classList.toggle('dark', newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-accent cursor-pointer p-2 text-xl transition duration-300 hover:scale-110 md:text-2xl"
    >
      {dark ? <FiSun /> : <FiMoon />}
    </button>
  )
}

export default ThemeToggle
