import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'

export interface ExpenseSplitRequestDto {
  userId: number
  amount: number
}

export interface ExpenseRequestDto {
  groupId: number
  description: string
  totalAmount: number
  categoryId: number
  splits: ExpenseSplitRequestDto[]
}

export interface ExpenseResponseDto {
  id: number
  groupId: number
  groupName: string
  paidByUserId: number
  paidByUserEmail: string
  description: string
  totalAmount: number
  createdAt: string
  categoryId: number
  categoryName: string
  splits: ExpenseSplitDto[]
}

export interface ExpenseSplitDto {
  id: number
  userId: number
  userEmail: string
  amount: number
}

export const createExpense = (expenseData: ExpenseRequestDto): Promise<AxiosResponse<ExpenseResponseDto>> => {
  return apiClient.post('/expenses', expenseData)
}

export const getExpensesByGroupId = (groupId: number): Promise<AxiosResponse<ExpenseResponseDto[]>> => {
  return apiClient.get(`/expenses/group/${groupId}`)
}

export const deleteExpense = (expenseId: number): Promise<AxiosResponse<string>> => {
  return apiClient.delete(`/expenses/${expenseId}`)
}

export const getGroupBalances = (groupId: number): Promise<AxiosResponse<Record<number, Record<number, number>>>> => {
  return apiClient.get(`/expenses/group/${groupId}/balances`)
}
