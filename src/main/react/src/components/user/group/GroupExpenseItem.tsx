import type { ExpenseResponseDto, ExpenseSplitDto } from '../../../api/expenseService'
import { deleteExpense } from '../../../api/expenseService'
import FormButton from '../../basic/FormButton.tsx'
import { FiTrash } from 'react-icons/fi'
import { showConfirm, showError, showSuccess } from '../../alerts/swalAlerts'

interface Props {
  expense: ExpenseResponseDto
  getPayerName: (expense: ExpenseResponseDto) => string
  getUserName: (split: ExpenseSplitDto) => string
  t: any
  onExpenseDeleted: () => void
  currentUserId: number
}

function GroupExpenseItem({ expense, getPayerName, getUserName, t, onExpenseDeleted, currentUserId }: Props) {
  const handleDelete = async () => {
    const result = await showConfirm(t('groupPage.deleteExpenseConfirm'), t('groupPage.confirmDelete'))

    if (!result.isConfirmed) return

    try {
      await deleteExpense(expense.id)
      showSuccess(t('groupPage.deleteExpenseSuccess'))
      onExpenseDeleted()
    } catch {
      showError(t('groupPage.deleteExpenseFailed'))
    }
  }

  const isCreator = currentUserId === expense.paidByUserId

  return (
    <div className="bg-bg dark:bg-bg-dark/80 rounded-md p-3">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="font-medium">{expense.description}</span>
            <span className="text-xs md:text-sm">
              {t('category')}: {t('expenseCategories.' + expense.categoryName.toLowerCase())}
            </span>
          </div>
          <span className="font-medium">{expense.totalAmount} PLN</span>
        </div>
        <div className="text-xs text-gray-600 md:text-sm dark:text-gray-400">
          {t('groupPage.payer')}: <span className="font-medium">{getPayerName(expense)}</span>
        </div>
        <div className="mt-2 border-t border-gray-300 pt-2 text-xs md:text-sm dark:border-gray-700">
          <div className="font-medium">{t('groupPage.split')}:</div>
          <div className="flex justify-end">
            <ul className="mt-1 min-w-1/3 space-y-1 2xl:min-w-1/5">
              {expense.splits.map(
                (split) =>
                  split.amount > 0 && (
                    <li key={split.id} className="grid grid-cols-2">
                      <span className="text-left">{getUserName(split)}:</span>
                      <span className="text-right font-medium">{split.amount} PLN</span>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      </div>
      {isCreator && (
        <div className="mt-5 flex justify-end">
          <FormButton type="button" onClick={handleDelete} className="max-w-fit bg-red-400 px-3 hover:bg-red-300">
            <FiTrash />
          </FormButton>
        </div>
      )}
    </div>
  )
}

export default GroupExpenseItem
