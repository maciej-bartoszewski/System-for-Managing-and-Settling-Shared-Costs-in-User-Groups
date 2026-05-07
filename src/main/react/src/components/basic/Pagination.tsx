import { useTranslation } from 'react-i18next'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-10 flex items-center justify-center gap-4 font-medium md:mt-5">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0}
        className={`rounded-lg px-4 py-2 transition ${
          currentPage === 0 ? 'bg-gray-200 text-gray-400 dark:bg-gray-700' : 'bg-accent hover:bg-accent/60 cursor-pointer text-white'
        }`}
      >
        &laquo;
      </button>

      <div className="text-xs md:text-sm">{t('pagination.page', { current: currentPage + 1, total: totalPages })}</div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
        disabled={currentPage === totalPages - 1}
        className={`rounded-lg px-4 py-2 transition ${
          currentPage === totalPages - 1
            ? 'bg-gray-200 text-gray-400 dark:bg-gray-700'
            : 'bg-accent hover:bg-accent/60 cursor-pointer text-white'
        }`}
      >
        &raquo;
      </button>
    </div>
  )
}

export default Pagination
