import apiClient from './apiClient'

export interface ChartSeriesDto {
  name: string
  data: number[]
}

export interface GroupBalancesChartDto {
  labels: string[]
  series: ChartSeriesDto[]
  iOwe: UserBalanceItemDto[]
  owedToMe: UserBalanceItemDto[]
}

export interface UserBalanceItemDto {
  groupId: number
  groupName: string
  userId: number
  userName: string
  amount: number
}

export interface PieSliceDto {
  label: string
  value: number
}

export interface ExpenseItemDto {
  description: string
  amount: number
  createdAt: string
}

export interface ExpenseSummaryDto {
  totalAmount: number
  expenses: ExpenseItemDto[]
}

export const getMyBalancesPerGroup = async (): Promise<GroupBalancesChartDto> => {
  const response = await apiClient.get<GroupBalancesChartDto>('/summary/my/group-balances')
  return response.data
}

export const getMyCategoryShare = async (from?: string, to?: string): Promise<PieSliceDto[]> => {
  const params: Record<string, string> = {}
  if (from) params.from = from
  if (to) params.to = to

  const response = await apiClient.get<PieSliceDto[]>('/summary/my/category-share', { params })
  return response.data
}

export const getExpenseSummary = async (from?: string, to?: string): Promise<ExpenseSummaryDto> => {
  const params: Record<string, string> = {}
  if (from) params.from = from
  if (to) params.to = to

  const response = await apiClient.get<ExpenseSummaryDto>(`/summary`, { params })
  return response.data
}
