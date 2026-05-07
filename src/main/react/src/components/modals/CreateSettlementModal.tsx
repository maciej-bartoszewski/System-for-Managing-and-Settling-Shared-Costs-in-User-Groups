import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSettlement, type SettlementRequestDto, type SettlementResponseDto } from '../../api/settlementService'
import { showError, showSuccess } from '../alerts/swalAlerts'
import FormInput from '../basic/FormInput'
import FormButton from '../basic/FormButton'
import { useAuth } from '../../contexts/AuthContext'
import type { UserDto } from '../../api/userService'

interface CreateSettlementModalProps {
  groupId: number
  members: UserDto[]
  onClose: () => void
  onSettlementCreated: (settlement: SettlementResponseDto) => void
}

function CreateSettlementModal({ groupId, members, onClose, onSettlementCreated }: CreateSettlementModalProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [toUserId, setToUserId] = useState<number | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = async () => {
    if (!toUserId) {
      showError(t('groupPage.selectMemberRequired'))
      return
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showError(t('groupPage.validAmountRequired'))
      return
    }

    setLoading(true)
    try {
      const settlementData: SettlementRequestDto = {
        groupId,
        toUserId,
        amount: parseFloat(amount),
      }
      const response = await createSettlement(settlementData)
      showSuccess(t('groupPage.settlementAddedSuccess'))
      onSettlementCreated(response.data)
    } catch (error) {
      console.error('Error:', error)
      showError(t('groupPage.settlementAddFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div className="bg-surface dark:bg-surface-dark w-full max-w-md rounded-lg p-5 shadow-lg md:max-w-xl">
        <h2 className="text-lg font-bold">{t('groupPage.settle')}</h2>
        <div className="mt-4 flex flex-row gap-2">
          <select
            className="focus:border-accent dark:border-bg dark:bg-surface-dark w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:outline-none"
            value={toUserId ?? ''}
            onChange={(e) => setToUserId(Number(e.target.value))}
          >
            <option value="">{t('groupPage.members')}</option>
            {members
              .filter((m) => m.id !== user?.id)
              .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
          </select>
          <FormInput
            label={t('groupPage.amount')}
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="[&>input]:appearance-textfield !max-w-38 [&>input::-webkit-inner-spin-button]:appearance-none [&>input::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <FormButton className="bg-gray-500 hover:bg-gray-400" onClick={onClose}>
            {t('groupPage.cancel')}
          </FormButton>
          <FormButton onClick={handleSubmit} disabled={loading}>
            {loading ? t('groupPage.adding') : t('groupPage.settle')}
          </FormButton>
        </div>
      </div>
    </div>
  )
}

export default CreateSettlementModal
