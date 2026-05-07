import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import FormButton from './FormButton.tsx'

interface SearchBarProps {
  onSearch: (searchValue: string) => void
  initialValue?: string
  placeholder?: string
  className?: string
}

function SearchBar({ onSearch, initialValue = '', placeholder, className = '' }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState(initialValue)

  const handleSearch = () => {
    onSearch(searchInput)
  }

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
        className="border-gray/20 dark:border-gray-dark/30 focus:border-accent min-h-10 w-full rounded-xl border py-2 pr-12 pl-3 shadow-sm outline-none"
      />
      <FormButton onClick={handleSearch} className="absolute top-1/2 right-0 !w-fit -translate-y-1/2 rounded-l-none px-3">
        <FiSearch />
      </FormButton>
    </div>
  )
}

export default SearchBar
