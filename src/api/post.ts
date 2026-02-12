import request from '@/utils/request'

export const getPositionList = (params?: any) =>
  request({
    url: '/internal-positions',
    method: 'get',
    params,
  })

export const exportPositions = (params?: any) =>
  request({
    url: '/internal-positions/export',
    method: 'get',
    params,
    responseType: 'blob',
  })

export const getPositionDetail = (id: string | number) =>
  request({
    url: `/internal-positions/${id}`,
    method: 'get',
  })

export const getPositionUsers = (id: string | number) =>
  request({
    url: `/internal-positions/${id}/users`,
    method: 'get',
  })

export const createPosition = (data: any) =>
  request({
    url: '/internal-positions/applications',
    method: 'post',
    data,
  })

export const modifyPosition = (id: string | number, data: any) =>
  request({
    url: `/internal-positions/${id}/applications`,
    method: 'put',
    data,
  })

export const cancelPosition = (id: string | number, data?: any) =>
  request({
    url: `/internal-positions/${id}/applications/cancel`,
    method: 'post',
    data,
  })

export const getPositionApplications = (params?: any) =>
  request({
    url: '/position-applications',
    method: 'get',
    params,
  })

export const exportPositionApplications = (params?: any) =>
  request({
    url: '/position-applications/export',
    method: 'get',
    params,
    responseType: 'blob',
  })

export const reviewPositionApplication = (id: string | number, data: any) =>
  request({
    url: `/position-applications/${id}/review`,
    method: 'post',
    data,
  })

export const revokePositionApplication = (id: string | number, params?: any) =>
  request({
    url: `/position-applications/${id}/revoke`,
    method: 'post',
    params,
  })
