import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronDown } from 'react-icons/fi'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { ExpenseItemDto, PieSliceDto } from '../../../api/summaryService'

const COLORS = ['#E74C3C', '#3498DB', '#F39C12', '#2ECC71', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E', '#C0392B', '#16A085']

function groupExpensesByDate(expenses: ExpenseItemDto[]) {
  return expenses.reduce<Record<string, ExpenseItemDto[]>>((acc, expense) => {
    const date = expense.createdAt.split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(expense)
    return acc
  }, {})
}

interface Props {
  totalAmount: number
  categoryShare: PieSliceDto[]
  expenses: ExpenseItemDto[]
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export default function OverallSummarySection({ totalAmount, categoryShare, expenses, from, to, onFromChange, onToChange }: Props) {
  const { t } = useTranslation()
  const [showSummary, setShowSummary] = useState(true)

  const grouped = groupExpensesByDate(expenses)
  const translatedCategoryShare = categoryShare.map((slice) => ({
    ...slice,
    label: t(`expenseCategories.${slice.label.toLowerCase()}`) || slice.label,
  }))

  return (
    <div>
      <div className="flex cursor-pointer items-center justify-between select-none" onClick={() => setShowSummary((v) => !v)}>
        <h1 className="text-accent mr-2 text-xl font-bold text-nowrap lg:text-2xl">{t('userSummaryPage.overallSummary')}</h1>
        <FiChevronDown className={`text-2xl transition-transform ${showSummary ? 'rotate-0' : '-rotate-90'}`} />
      </div>

      {showSummary && (
        <div className="bg-bg dark:bg-bg-dark mt-4 space-y-4 rounded-md p-4">
          <div className="mb-6 text-center">
            <div className="text-accent mb-2 text-xl font-bold lg:text-2xl">{t('userSummaryPage.total')}</div>
            <div className="text-3xl font-semibold">{totalAmount.toFixed(2)} PLN</div>
            <div className="text-muted mt-2 text-sm">{t('userSummaryPage.totalDescription')}</div>
          </div>

          <hr className="border-gray/20 dark:border-gray-dark/30" />

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex w-full flex-col lg:w-1/2">
              <h2 className="text-accent mb-4 text-lg font-semibold">{t('userSummaryPage.categoryShare')}</h2>
              {!Array.isArray(categoryShare) || categoryShare.length === 0 ? (
                <div className="text-center">{t('userSummaryPage.noChartData')}</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={translatedCategoryShare} dataKey="value" nameKey="label" innerRadius={50} outerRadius={100} label>
                      {translatedCategoryShare.map((entry, idx) => (
                        <Cell key={entry.label} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} PLN`} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex w-full flex-col lg:w-1/2">
              <h2 className="text-accent mb-4 text-lg font-semibold">{t('userSummaryPage.history')}</h2>

              <div className="mb-4 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                <div className="border-gray/20 dark:border-gray-dark/30 bg-surface dark:bg-surface-dark mx-auto flex w-full max-w-fit flex-row gap-3 rounded-xl border p-2 shadow-md md:mx-0">
                  <label>{t('userSummaryPage.from')}</label>
                  <input type="date" value={from} onChange={(e) => onFromChange(e.target.value)} />
                </div>
                <div className="border-gray/20 dark:border-gray-dark/30 bg-surface dark:bg-surface-dark mx-auto flex w-full max-w-fit flex-row gap-3 rounded-xl border p-2 shadow-md md:mx-0">
                  <label>{t('userSummaryPage.to')}</label>
                  <input type="date" value={to} onChange={(e) => onToChange(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                {expenses.length === 0 ? (
                  <div className="text-center">{t('userSummaryPage.noExpenses')}</div>
                ) : (
                  Object.entries(grouped)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([date, expensesForDate]) => (
                      <div key={date} className="space-y-2">
                        <div className="bg-surface dark:bg-surface-dark text-accent rounded-md p-2 text-sm font-medium">{date}</div>
                        <div className="bg-surface dark:bg-surface-dark rounded-md p-2">
                          {expensesForDate.map((expense, idx) =>
                            expense.amount > 0 ? (
                              <div
                                key={idx}
                                className="border-gray/10 dark:border-gray-dark/20 flex items-center justify-between border-b py-2 text-sm last:border-b-0"
                              >
                                <span>{expense.description}</span>
                                <span>{expense.amount.toFixed(2)} PLN</span>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
