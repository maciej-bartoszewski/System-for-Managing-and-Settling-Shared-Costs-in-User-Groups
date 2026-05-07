import apiClient from './apiClient.ts'

export const getRoles = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/roles')
  return response.data
}
