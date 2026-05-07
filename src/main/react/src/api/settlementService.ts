import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'

export interface SettlementRequestDto {
  groupId: number
  toUserId: number
  amount: number
}

export interface SettlementResponseDto {
  id: number
  groupId: number
  groupName: string
  fromUserId: number
  fromUserEmail: string
  toUserId: number
  toUserEmail: string
  amount: number
  createdAt: string
}

export const createSettlement = (settlementData: SettlementRequestDto): Promise<AxiosResponse<SettlementResponseDto>> => {
  return apiClient.post('/settlements', settlementData)
}

export const getSettlementsByGroupId = (groupId: number): Promise<AxiosResponse<SettlementResponseDto[]>> => {
  return apiClient.get(`/settlements/group/${groupId}`)
}

export const getMySettlements = (): Promise<AxiosResponse<SettlementResponseDto[]>> => {
  return apiClient.get('/settlements/my')
}

export const deleteSettlement = (settlementId: number): Promise<AxiosResponse<string>> => {
  return apiClient.delete(`/settlements/${settlementId}`)
}
