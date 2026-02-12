import request from '@/utils/request'

export const getOperatorList = (params?: any) =>
  request({
    url: '/department-operators',
    method: 'get',
    params,
  })

export const exportOperators = (params?: any) =>
  request({
    url: '/department-operators/export',
    method: 'get',
    params,
    responseType: 'blob',
  })

export const getOperatorDetail = (id: string | number, params?: any) =>
  request({
    url: `/department-operators/${id}`,
    method: 'get',
    params,
  })

export const getOperatorPermissions = (id: string | number, params?: any) =>
  request({
    url: `/department-operators/${id}/permissions`,
    method: 'get',
    params,
  })

export const getOperatorCertificates = (id: string | number, params?: any) =>
  request({
    url: `/department-operators/${id}/certificates`,
    method: 'get',
    params,
  })

export const createOperator = (data: any) =>
  request({
    url: '/department-operators/applications',
    method: 'post',
    data,
  })

export const modifyOperator = (id: string | number, data: any) =>
  request({
    url: `/department-operators/${id}/applications`,
    method: 'put',
    data,
  })

export const cancelOperator = (id: string | number, data?: any) =>
  request({
    url: `/department-operators/${id}/applications/cancel`,
    method: 'post',
    data,
  })

export const freezeOperator = (id: string | number, data?: any) =>
  request({
    url: `/department-operators/${id}/applications/freeze`,
    method: 'post',
    data,
  })

export const unfreezeOperator = (id: string | number, data?: any) =>
  request({
    url: `/department-operators/${id}/applications/unfreeze`,
    method: 'post',
    data,
  })

export const resetOperatorPassword = (id: string | number, data?: any) =>
  request({
    url: `/department-operators/${id}/applications/reset-password`,
    method: 'post',
    data,
  })

export const bindOperatorCert = (id: string | number, data?: any) =>
  request({
    url: `/department-operators/${id}/applications/bind-cert`,
    method: 'post',
    data,
  })

export const assignOperatorPermissions = (id: string | number, data?: any) =>
  request({
    url: `/department-operators/${id}/applications/assign-permissions`,
    method: 'post',
    data,
  })

export const getOperatorApplications = (params?: any) =>
  request({
    url: '/department-operator-applications',
    method: 'get',
    params,
  })

export const exportOperatorApplications = (params?: any) =>
  request({
    url: '/department-operator-applications/export',
    method: 'get',
    params,
    responseType: 'blob',
  })

export const reviewOperatorApplication = (id: string | number, data: any) =>
  request({
    url: `/department-operator-applications/${id}/review`,
    method: 'post',
    data,
  })

export const revokeOperatorApplication = (id: string | number, operatorId: string | number) =>
  request({
    url: `/department-operator-applications/${id}/revoke`,
    method: 'post',
    params: { operatorId },
  })
