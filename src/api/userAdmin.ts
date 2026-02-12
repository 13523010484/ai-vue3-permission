import request from '@/utils/request'

export const getAdminList = (params?: any) =>
  request({
    url: '/department-admins',
    method: 'get',
    params,
  })

export const exportAdmins = (params?: any) =>
  request({
    url: '/department-admins/export',
    method: 'get',
    params,
    responseType: 'blob',
  })

export const getAdminDetail = (id: string | number, params?: any) =>
  request({
    url: `/department-admins/${id}`,
    method: 'get',
    params,
  })

export const getAdminPermissions = (id: string | number, params?: any) =>
  request({
    url: `/department-admins/${id}/permissions`,
    method: 'get',
    params,
  })

export const getAdminCertificates = (id: string | number, params?: any) =>
  request({
    url: `/department-admins/${id}/certificates`,
    method: 'get',
    params,
  })

export const createAdmin = (data: any) =>
  request({
    url: '/department-admins/applications',
    method: 'post',
    data,
  })

export const modifyAdmin = (id: string | number, data: any) =>
  request({
    url: `/department-admins/${id}/applications`,
    method: 'put',
    data,
  })

export const cancelAdmin = (id: string | number, data?: any) =>
  request({
    url: `/department-admins/${id}/applications/cancel`,
    method: 'post',
    data,
  })

export const freezeAdmin = (id: string | number, data?: any) =>
  request({
    url: `/department-admins/${id}/applications/freeze`,
    method: 'post',
    data,
  })

export const unfreezeAdmin = (id: string | number, data?: any) =>
  request({
    url: `/department-admins/${id}/applications/unfreeze`,
    method: 'post',
    data,
  })

export const resetAdminPassword = (id: string | number, data?: any) =>
  request({
    url: `/department-admins/${id}/applications/reset-password`,
    method: 'post',
    data,
  })

export const bindAdminCert = (id: string | number, data?: any) =>
  request({
    url: `/department-admins/${id}/applications/bind-cert`,
    method: 'post',
    data,
  })

export const getAdminApplications = (params?: any) =>
  request({
    url: '/department-admin-applications',
    method: 'get',
    params,
  })

export const exportAdminApplications = (params?: any) =>
  request({
    url: '/department-admin-applications/export',
    method: 'get',
    params,
    responseType: 'blob',
  })

export const reviewAdminApplication = (id: string | number, data: any) =>
  request({
    url: `/department-admin-applications/${id}/review`,
    method: 'post',
    data,
  })

export const revokeAdminApplication = (id: string | number, operatorId: string | number) =>
  request({
    url: `/department-admin-applications/${id}/revoke`,
    method: 'post',
    params: { operatorId },
  })
