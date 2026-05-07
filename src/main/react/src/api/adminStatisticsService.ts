import apiClient from './apiClient'

export interface AdminStatistics {
  totalUsers: number
  googleUsersRate: number
  loginsInLast24Hours: number
  totalGroups: number
  averageGroupMembers: number
  mostPopularCategory: string
  totalCategories: number
}

export const getTotalUsersCount = async (): Promise<number> => {
  const response = await apiClient.get<number>(`/admin/statistics/total-users`)
  return response.data
}

export const getGoogleUsersRate = async (): Promise<number> => {
  const response = await apiClient.get<number>(`/admin/statistics/google-users-rate`)
  return response.data
}

export const getLoginsInLast24Hours = async (): Promise<number> => {
  const response = await apiClient.get<number>(`/admin/statistics/logins-last-24-hours`)
  return response.data
}

export const getTotalGroupsCount = async (): Promise<number> => {
  const response = await apiClient.get<number>(`/admin/statistics/total-groups`)
  return response.data
}

export const getAverageGroupMembersCount = async (): Promise<number> => {
  const response = await apiClient.get<number>(`/admin/statistics/average-group-members`)
  return response.data
}

export const getMostPopularCategory = async (): Promise<string> => {
  const response = await apiClient.get<string>(`/admin/statistics/most-popular-category`)
  return response.data
}

export const getTotalCategoriesCount = async (): Promise<number> => {
  const response = await apiClient.get<number>(`/admin/statistics/total-categories`)
  return response.data
}

export const getAllStatistics = async (): Promise<AdminStatistics> => {
  const [totalUsers, googleUsersRate, loginsInLast24Hours, totalGroups, averageGroupMembers, mostPopularCategory, totalCategories] =
    await Promise.all([
      getTotalUsersCount(),
      getGoogleUsersRate(),
      getLoginsInLast24Hours(),
      getTotalGroupsCount(),
      getAverageGroupMembersCount(),
      getMostPopularCategory(),
      getTotalCategoriesCount(),
    ])

  return {
    totalUsers,
    googleUsersRate,
    loginsInLast24Hours,
    totalGroups,
    averageGroupMembers,
    mostPopularCategory,
    totalCategories,
  }
}
