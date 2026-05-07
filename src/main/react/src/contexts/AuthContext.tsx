import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import {
  type AuthResponse,
  exchangeAuthCode,
  type LoginCredentials,
  loginUser,
  parseToken,
  registerUser,
  type RegistrationData,
} from '../api/authService'
import { getUserById, type UserDto } from '../api/userService'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

interface AuthContextType {
  isAuthenticated: boolean
  user: UserDto | null
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: (code: string) => Promise<void>
  register: (data: RegistrationData) => Promise<void>
  logout: () => void
  clearError: () => void
  updateUserData: (userData: Partial<UserDto>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const [user, setUser] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updateUserData = useCallback((userData: Partial<UserDto>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    setUser(null)
    clearError()
  }, [clearError])

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        const tokenData = parseToken(token)
        if (tokenData) {
          try {
            const userData = await getUserById(tokenData.id)
            setUser(userData)
          } catch (error) {
            console.error('Error loading user data:', error)
            logout()
          }
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [logout])

  const handleAuthResponse = useCallback(async (response: AuthResponse) => {
    localStorage.setItem('authToken', response.token)
    const tokenData = parseToken(response.token)

    if (tokenData) {
      try {
        const userData = await getUserById(tokenData.id)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
  }, [])

  const register = useCallback(
    async (data: RegistrationData): Promise<void> => {
      setLoading(true)
      clearError()
      try {
        await registerUser(data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setError(t('errors.emailTaken'))
          } else if (err.response?.status === 400) {
            setError(t('errors.invalidRegistrationData'))
          } else {
            setError(t('errors.registrationFailed'))
          }
        } else {
          setError(t('errors.registrationFailed'))
        }
        throw err
      } finally {
        setLoading(false)
      }
    },
    [t, clearError]
  )

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setLoading(true)
      clearError()
      try {
        const response = await loginUser(credentials)
        await handleAuthResponse(response)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError(t('errors.invalidCredentials'))
          } else if (err.response?.status === 400) {
            setError(t('errors.invalidLoginData'))
          } else if (err.response?.status === 404) {
            setError(t('errors.accountNotFound'))
          } else {
            setError(t('errors.serverError'))
          }
        } else {
          setError(t('errors.serverError'))
        }
        throw err
      } finally {
        setLoading(false)
      }
    },
    [t, clearError, handleAuthResponse]
  )

  const loginWithGoogle = useCallback(
    async (code: string): Promise<void> => {
      setLoading(true)
      clearError()
      try {
        const response = await exchangeAuthCode(code)
        await handleAuthResponse(response)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError(t('errors.googleAuthFailed'))
          } else {
            setError(t('errors.googleLoginServerError'))
          }
        } else {
          setError(t('errors.googleLoginServerError'))
        }
        throw err
      } finally {
        setLoading(false)
      }
    },
    [t, clearError, handleAuthResponse]
  )

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, loading, error, login, loginWithGoogle, register, logout, clearError, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
