import { useEffect, useState } from 'react'
import {
  type ExpenseItemDto,
  getExpenseSummary,
  getMyBalancesPerGroup,
  getMyCategoryShare,
  type GroupBalancesChartDto,
  type PieSliceDto,
} from '../../api/summaryService.ts'
import Loading from '../../components/basic/Loading'
import Expense from '../../assets/expense.svg'
import GroupBalancesSection from '../../components/user/summary/GroupBalancesSection'
import OverallSummarySection from '../../components/user/summary/OverallSummarySection'

function SummaryPage() {
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [expenses, setExpenses] = useState<ExpenseItemDto[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [chartBalances, setChartBalances] = useState<GroupBalancesChartDto | null>(null)
  const [categoryShare, setCategoryShare] = useState<PieSliceDto[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [expenseData, groupBalancesDto, categorySlices] = await Promise.all([
        getExpenseSummary(from || undefined, to || undefined),
        getMyBalancesPerGroup(),
        getMyCategoryShare(from || undefined, to || undefined),
      ])

      setExpenses(expenseData.expenses)
      setTotalAmount(expenseData.totalAmount)
      setChartBalances(groupBalancesDto ?? null)
      setCategoryShare(Array.isArray(categorySlices) ? categorySlices : [])
    } catch (e) {
      console.error('Error fetching data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [from, to])

  if (loading) {
    return <Loading />
  }

  return (
    <section className="flex h-full w-full flex-col items-center justify-center py-5 md:p-5">
      <div className="bg-surface dark:bg-surface-dark relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-5 shadow-md lg:max-w-[90%]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${Expense})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.08,
          }}
        />

        <div className="relative space-y-10">
          <GroupBalancesSection chartBalances={chartBalances} />
          <OverallSummarySection
            totalAmount={totalAmount}
            categoryShare={categoryShare}
            expenses={expenses}
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
          />
        </div>
      </div>
    </section>
  )
}

export default SummaryPage
