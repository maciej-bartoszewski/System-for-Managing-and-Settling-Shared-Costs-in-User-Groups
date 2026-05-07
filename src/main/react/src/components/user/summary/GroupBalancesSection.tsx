import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiChevronDown } from 'react-icons/fi'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { GroupBalancesChartDto } from '../../../api/summaryService'

interface GroupTotal {
  groupName: string
  groupId: number | null
  iOweTotal: number
  owedToMeTotal: number
}

function groupByGroupName<T extends { groupName: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    if (!acc[item.groupName]) acc[item.groupName] = []
    acc[item.groupName].push(item)
    return acc
  }, {})
}

function getGroupTotalsFromChart(dto: GroupBalancesChartDto | null): GroupTotal[] {
  if (!dto) return []

  const iOwe = Array.isArray(dto.iOwe) ? dto.iOwe : []
  const owed = Array.isArray(dto.owedToMe) ? dto.owedToMe : []
  const iOweMap = groupByGroupName(iOwe)
  const owedMap = groupByGroupName(owed)
  const keys = Array.from(new Set([...Object.keys(iOweMap), ...Object.keys(owedMap)]))

  return keys.map((k) => {
    const iOweItems = iOweMap[k] ?? []
    const owedItems = owedMap[k] ?? []
    const iOweTotal = iOweItems.reduce((s, it) => s + Number((it as any).amount), 0)
    const owedToMeTotal = owedItems.reduce((s, it) => s + Number((it as any).amount), 0)
    const groupId = (iOweItems[0] as any)?.groupId ?? (owedItems[0] as any)?.groupId ?? null
    return { groupName: k, groupId, iOweTotal, owedToMeTotal }
  })
}

interface Props {
  chartBalances: GroupBalancesChartDto | null
}

export default function GroupBalancesSection({ chartBalances }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showGroups, setShowGroups] = useState(true)

  const groupTotals = getGroupTotalsFromChart(chartBalances)
  const visibleGroupTotals = groupTotals.filter((g) => g.iOweTotal !== 0 || g.owedToMeTotal !== 0)

  return (
    <div>
      <div className="flex cursor-pointer items-center justify-between select-none" onClick={() => setShowGroups((v) => !v)}>
        <h1 className="text-accent mr-2 text-xl font-bold text-nowrap lg:text-2xl">{t('userSummaryPage.groupCosts')}</h1>
        <FiChevronDown className={`text-2xl transition-transform ${showGroups ? 'rotate-0' : '-rotate-90'}`} />
      </div>

      {showGroups && (
        <div className="bg-bg dark:bg-bg-dark mt-4 space-y-4 rounded-md p-4">
          {visibleGroupTotals.length === 0 ? (
            <div className="text-center">{t('userSummaryPage.noDebts')}</div>
          ) : (
            visibleGroupTotals.map((g) => {
              const iOweItemsForGroup = chartBalances?.iOwe.filter((it) => it.groupName === g.groupName) ?? []
              const owedItemsForGroup = chartBalances?.owedToMe.filter((it) => it.groupName === g.groupName) ?? []

              return (
                <div
                  key={g.groupName}
                  className="bg-surface dark:bg-surface-dark border-gray/10 dark:border-gray-dark/20 flex flex-col gap-4 rounded-md border p-4 shadow-sm"
                >
                  <div className="cursor-pointer" onClick={() => g.groupId != null && navigate(`/groups/${g.groupId}/`)}>
                    <div className="text-accent text-lg font-semibold">{g.groupName}</div>
                    <div className="text-muted mt-1 text-sm">
                      {t('userSummaryPage.iOwe')}: <span className="font-medium">{g.iOweTotal.toFixed(2)} PLN</span>
                      <br />
                      {t('userSummaryPage.owedToMe')}: <span className="font-medium">{g.owedToMeTotal.toFixed(2)} PLN</span>
                    </div>
                  </div>

                  <hr className="border-gray/20 dark:border-gray-dark/30" />

                  <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex w-full flex-col gap-4 lg:w-2/3">
                      {iOweItemsForGroup.length > 0 && (
                        <div className="bg-bg dark:bg-bg-dark rounded-md p-3">
                          <div className="mb-4 text-base font-semibold text-red-400">{t('userSummaryPage.iOwe')}</div>
                          <div className="space-y-2">
                            {iOweItemsForGroup.map((it: any) => (
                              <div
                                key={it.userId}
                                className="border-gray/10 dark:border-gray-dark/20 flex items-center justify-between border-b py-2 text-sm last:border-b-0"
                              >
                                <span>{it.userName}</span>
                                <span>{Number(it.amount).toFixed(2)} PLN</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {owedItemsForGroup.length > 0 && (
                        <div className="bg-bg dark:bg-bg-dark rounded-md p-3">
                          <div className="text-accent mb-4 text-base font-semibold">{t('userSummaryPage.owedToMe')}</div>
                          <div className="space-y-2">
                            {owedItemsForGroup.map((it: any) => (
                              <div
                                key={it.userId}
                                className="border-gray/10 dark:border-gray-dark/20 flex items-center justify-between border-b py-2 text-sm last:border-b-0"
                              >
                                <span>{it.userName}</span>
                                <span>{Number(it.amount).toFixed(2)} PLN</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex w-full flex-col items-center justify-center lg:w-1/3">
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart
                          data={[{ name: g.groupName, iOwe: g.iOweTotal, owed: g.owedToMeTotal }]}
                          margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                        >
                          <XAxis dataKey="name" hide />
                          <YAxis />
                          <Tooltip formatter={(value: number) => `${value.toFixed(2)} PLN`} />
                          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="iOwe" name={t('userSummaryPage.iOwe')} fill="#FF6467" />
                          <Bar dataKey="owed" name={t('userSummaryPage.owedToMe')} fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
