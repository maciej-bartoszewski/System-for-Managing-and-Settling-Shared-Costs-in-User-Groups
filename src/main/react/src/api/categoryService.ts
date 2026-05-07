import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'

export interface CategoryDto {
  categoryId: number
  categoryName: string
}

export const getCategories = (): Promise<AxiosResponse<CategoryDto[]>> => {
  return apiClient.get(`/categories`)
}
