import apiClient from './apiClient'
import type { PageResponse, UserDto } from './userService'

export interface GroupRequestDto {
  name: string
  description: string
}

export interface GroupDto {
  id: number
  name: string
  description: string
  inviteCode: string
  createdAt: string
  createdByEmail: string
}

export const searchGroups = async (query?: string, page: number = 0, size: number = 10): Promise<PageResponse<GroupDto>> => {
  const params = new URLSearchParams()

  if (query) params.append('query', query)

  params.append('page', page.toString())
  params.append('size', size.toString())

  const response = await apiClient.get<PageResponse<GroupDto>>('/groups/search', { params })

  return response.data
}

export const createGroup = async (groupData: GroupRequestDto): Promise<GroupDto> => {
  const response = await apiClient.post<GroupDto>('/groups', groupData)
  return response.data
}

export const getGroupById = async (groupId: number): Promise<GroupDto> => {
  const response = await apiClient.get<GroupDto>(`/groups/${groupId}`)
  return response.data
}

export const updateGroup = async (groupId: number, groupData: GroupRequestDto): Promise<void> => {
  await apiClient.put(`/groups/${groupId}`, groupData)
}

export const deleteGroup = async (groupId: number): Promise<void> => {
  await apiClient.delete(`/groups/${groupId}`)
}

export const joinGroup = async (inviteCode: string): Promise<GroupDto> => {
  const response = await apiClient.post('/groups/join', null, {
    params: { inviteCode },
  })
  return response.data
}

export const generateInviteCode = async (groupId: number): Promise<void> => {
  await apiClient.post(`/groups/${groupId}/invite-code`)
}

export const leaveGroup = async (groupId: number): Promise<void> => {
  await apiClient.post(`/groups/${groupId}/leave`)
}

export const addUserToGroup = async (groupId: number, email: string): Promise<void> => {
  await apiClient.post(`/groups/${groupId}/add-user`, null, {
    params: { email },
  })
}

export const removeUserFromGroup = async (groupId: number, userId: number): Promise<void> => {
  await apiClient.delete(`/groups/${groupId}/remove-user`, {
    params: { userId },
  })
}

export const getMyGroups = async (): Promise<GroupDto[]> => {
  const response = await apiClient.get<GroupDto[]>('/groups/my')
  return response.data
}

export const getGroupMembers = async (groupId: number): Promise<UserDto[]> => {
  const response = await apiClient.get<UserDto[]>(`/groups/${groupId}/members`)
  return response.data
}
