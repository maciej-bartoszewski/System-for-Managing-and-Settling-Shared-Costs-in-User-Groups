import apiClient from './apiClient'

export interface PageResponse<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface UserDto {
  id: number
  firstName: string
  lastName: string
  email: string
  lastLogin: string | null
  role: string
  authProvider: string
}

export interface NameUpdateRequest {
  firstName: string
  lastName: string
}

export interface EmailUpdateRequest {
  email: string
  password: string
}

export interface PasswordUpdateRequest {
  currentPassword: string
  newPassword: string
}

export interface NotificationPreferencesDto {
  notifyNewExpense: boolean
  notifyDebtReminder: boolean
  notifyAddedToGroup: boolean
}

export interface UserEditRequest {
  firstName: string
  lastName: string
  password: string
  email: string
  role: string
}

export const searchUsers = async (
  email?: string,
  role?: string,
  authProvider?: string,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<UserDto>> => {
  const params = new URLSearchParams()

  if (email) params.append('email', email)
  if (role) params.append('role', role)
  if (authProvider) params.append('authProvider', authProvider)

  params.append('page', page.toString())
  params.append('size', size.toString())

  const response = await apiClient.get<PageResponse<UserDto>>('/users/search', { params })

  return response.data
}

export const getUserById = async (id: number): Promise<UserDto> => {
  const response = await apiClient.get<UserDto>(`/users/${id}`)
  return response.data
}

export const editUserById = async (id: number, data: UserEditRequest): Promise<void> => {
  await apiClient.patch(`/users/${id}`, data)
}

export const deleteUserById = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`)
}

export const updateUserName = async (id: number, data: NameUpdateRequest): Promise<void> => {
  await apiClient.patch(`/users/${id}/name`, data)
}

export const updateUserEmail = async (id: number, data: EmailUpdateRequest): Promise<void> => {
  await apiClient.put(`/users/${id}/email`, data)
}

export const updateUserPassword = async (id: number, data: PasswordUpdateRequest): Promise<void> => {
  await apiClient.put(`/users/${id}/password`, data)
}

export const getUserNotificationPreferences = async (id: number): Promise<NotificationPreferencesDto> => {
  const response = await apiClient.get<NotificationPreferencesDto>(`/users/${id}/notification-preferences`)
  return response.data
}

export const updateUserNotificationPreferences = async (id: number, data: NotificationPreferencesDto): Promise<void> => {
  await apiClient.patch(`/users/${id}/notification-preferences`, data)
}
