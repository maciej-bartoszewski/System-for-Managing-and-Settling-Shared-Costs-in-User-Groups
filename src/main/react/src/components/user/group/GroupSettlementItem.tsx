import type { SettlementResponseDto } from '../../../api/settlementService'
import { deleteSettlement } from '../../../api/settlementService'
import FormButton from '../../basic/FormButton.tsx'
import { FiTrash } from 'react-icons/fi'
import { showConfirm, showError, showSuccess } from '../../alerts/swalAlerts'

interface Props {
  settlement: SettlementResponseDto
  getSettlementUserName: (userId: number) => string
  t: (key: string, options?: any) => string
  currentUserId: number
  onSettlementDeleted: () => void
}

function GroupSettlementItem({ settlement, getSettlementUserName, t, currentUserId, onSettlementDeleted }: Props) {
  const handleDelete = async () => {
    const result = await showConfirm(t('groupPage.deleteSettlementConfirm'), t('groupPage.confirmDelete'))

    if (!result.isConfirmed) return

    try {
      await deleteSettlement(settlement.id)
      showSuccess(t('groupPage.deleteSettlementSuccess'))
      onSettlementDeleted()
    } catch {
      showError(t('groupPage.deleteSettlementFailed'))
    }
  }

  const isCreator = currentUserId === settlement.fromUserId

  return (
    <div className="bg-bg dark:bg-bg-dark/80 rounded-md p-3">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span>
            <span className="font-medium">{getSettlementUserName(settlement.fromUserId)}</span> {t('groupPage.payer')}{' '}
            <span className="font-medium">{getSettlementUserName(settlement.toUserId)}</span>
          </span>
          <span className="font-medium">{settlement.amount} PLN</span>
        </div>
        <div className="text-xs text-gray-600 md:text-sm dark:text-gray-400">{new Date(settlement.createdAt).toLocaleDateString()}</div>
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

export default GroupSettlementItem
