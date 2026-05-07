import apiClient from './apiClient'
import type { UserDto } from './userService.ts'

export interface AuthResponse {
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const registerUser = async (userData: RegistrationData): Promise<UserDto> => {
  const response = await apiClient.post('/auth/register', userData)
  return response.data
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return response.data
}

export const exchangeAuthCode = async (code: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/exchange-code', { code })
  return response.data
}

export const parseToken = (token: string): { id: number; role: string } | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))

    return {
      id: parseInt(payload.sub, 10),
      role: payload.role,
    }
  } catch (error) {
    console.error('Token parsing error:', error)
    return null
  }
}
