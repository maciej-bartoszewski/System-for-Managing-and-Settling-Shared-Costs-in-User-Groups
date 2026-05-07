import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormInput from '../basic/FormInput'
import FormButton from '../basic/FormButton'
import { createExpense, type ExpenseRequestDto, type ExpenseResponseDto } from '../../api/expenseService'
import { showError, showSuccess } from '../alerts/swalAlerts'
import type { UserDto } from '../../api/userService'
import { getCategories } from '../../api/categoryService'

interface CreateExpenseModalProps {
  groupId: number
  members: UserDto[]
  onClose: () => void
  onExpenseCreated: (expense: ExpenseResponseDto) => void
}

function CreateExpenseModal({ groupId, members, onClose, onExpenseCreated }: CreateExpenseModalProps) {
  const { t } = useTranslation()
  const [description, setDescription] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [splits, setSplits] = useState<{ userId: number; amount: number }[]>(members.map((member) => ({ userId: member.id, amount: 0 })))
  const [categories, setCategories] = useState<{ categoryId: number; categoryName: string }[]>([])
  const [categoryId, setCategoryId] = useState<number | ''>('')

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res.data)
      const other = res.data.find((cat) => cat.categoryName.toLowerCase() === 'other')
      if (other) setCategoryId(other.categoryId)
    })
  }, [])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleEqualSplit = () => {
    if (!totalAmount || isNaN(Number(totalAmount))) return
    const total = parseFloat(totalAmount)
    const equalAmount = total / members.length
    setSplits(
      members.map((member) => ({
        userId: member.id,
        amount: parseFloat(equalAmount.toFixed(2)),
      }))
    )
  }

  const handleSplitChange = (userId: number, amount: string) => {
    const numAmount = amount === '' ? 0 : parseFloat(amount)
    setSplits(splits.map((split) => (split.userId === userId ? { ...split, amount: numAmount } : split)))
  }

  const handleSubmit = async () => {
    if (!description.trim()) {
      showError(t('groupPage.descriptionRequired'))
      return
    }
    if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
      showError(t('groupPage.validAmountRequired'))
      return
    }
    if (!categoryId) {
      showError(t('errors.fieldRequired', { field: t('category') }))
      return
    }
    const splitsSum = splits.reduce((sum, split) => sum + split.amount, 0)
    const total = parseFloat(totalAmount)
    if (Math.abs(splitsSum - total) > 0.01) {
      showError(t('groupPage.splitSumError', { splitsSum: splitsSum.toFixed(2), total: total.toFixed(2) }))
      return
    }
    setLoading(true)
    try {
      const expenseData: ExpenseRequestDto = {
        groupId,
        description,
        totalAmount: parseFloat(totalAmount),
        categoryId: Number(categoryId),
        splits: splits.map((split) => ({
          userId: split.userId,
          amount: split.amount,
        })),
      }
      const response = await createExpense(expenseData)
      showSuccess(t('groupPage.expenseAddedSuccess'))
      onExpenseCreated(response.data)
    } catch (error) {
      showError(t('groupPage.expenseAddFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div className="bg-surface dark:bg-surface-dark w-full max-w-md rounded-lg p-5 shadow-lg md:max-w-xl">
        <h2 className="text-lg font-bold">{t('groupPage.addExpense')}</h2>
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <FormInput
              className="max-w-full"
              label={t('groupPage.description')}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormInput
              label={t('groupPage.amount')}
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="[&>input]:appearance-textfield !max-w-38 [&>input::-webkit-inner-spin-button]:appearance-none [&>input::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('category')}</label>
            <select
              className="focus:border-accent dark:border-bg dark:bg-surface-dark w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:outline-none"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">{t('category')}</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {t('expenseCategories.' + cat.categoryName.toLowerCase())}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded border border-gray-300 p-3">
            <div className="flex items-center justify-between">
              <FormButton className="px-2 py-1" onClick={handleEqualSplit}>
                {t('groupPage.splitEqual')}
              </FormButton>
            </div>
            <div className="mt-3 space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <span className="flex-1">
                    {member.firstName} {member.lastName}:
                  </span>
                  <FormInput
                    label={t('groupPage.amount')}
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={splits.find((s) => s.userId === member.id)?.amount || 0}
                    onChange={(e) => handleSplitChange(member.id, e.target.value)}
                    className="[&>input]:appearance-textfield !max-w-38 [&>input::-webkit-inner-spin-button]:appearance-none [&>input::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span>PLN</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <FormButton className="bg-gray-500 hover:bg-gray-400" onClick={onClose}>
            {t('groupPage.cancel')}
          </FormButton>
          <FormButton onClick={handleSubmit} disabled={loading}>
            {loading ? t('groupPage.adding') : t('groupPage.addExpense')}
          </FormButton>
        </div>
      </div>
    </div>
  )
}

export default CreateExpenseModal
