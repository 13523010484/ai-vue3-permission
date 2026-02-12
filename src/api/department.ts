import request from '@/utils/request'
import type {
  DeptListQuery,
  DeptForm,
  DeptApplicationPayload,
  DeptApplyQuery,
} from '@/types/department'

export const getDepartmentList = (params?: DeptListQuery) => {
  const q: any = {}
  if (params?.deptName) q.name = params.deptName
  if (params?.status) {
    q.deptStatus =
      params.status === '1'
        ? 'NORMAL'
        : params.status === '2'
          ? 'CANCELED'
          : params.status
  }
  return request({
    url: '/departments',
    method: 'get',
    params: q,
  })
}

export const exportDepartments = (params?: DeptListQuery) => {
  const q: any = {}
  if (params?.deptName) q.name = params.deptName
  if (params?.status) q.status = params.status
  return request({
    url: '/departments/export',
    method: 'get',
    params: q,
    responseType: 'blob',
  })
}

export const getDepartmentDetail = (id: string | number) => {
  return request({
    url: `/departments/${id}`,
    method: 'get',
  })
}

export const getDeptUsers = (id: string | number) => {
  return request({
    url: `/departments/${id}/users`,
    method: 'get',
  })
}

export const createDepartment = (data: DeptApplicationPayload | DeptForm) => {
  return request({
    url: '/departments/applications',
    method: 'post',
    data,
  })
}

export const modifyDepartment = (id: string | number, data: DeptApplicationPayload | DeptForm) => {
  return request({
    url: `/departments/${id}/applications`,
    method: 'put',
    data,
  })
}

export const cancelDepartment = (id: string | number, data?: any) => {
  return request({
    url: `/departments/${id}/applications/cancel`,
    method: 'post',
    data,
  })
}

export const getDepartmentApplications = (params?: DeptApplyQuery) => {
  return request({
    url: '/department-applications',
    method: 'get',
    params,
  })
}

export const exportDepartmentApplications = (params?: DeptApplyQuery) => {
  return request({
    url: '/department-applications/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}

export const reviewDepartmentApplication = (id: string | number, data: any) => {
  return request({
    url: `/department-applications/${id}/review`,
    method: 'post',
    data,
  })
}

export const revokeDepartmentApplication = (id: string | number, params?: any) => {
  return request({
    url: `/department-applications/${id}/revoke`,
    method: 'post',
    params,
  })
}

// permission trees (legacy endpoints used by UI)
export const getAuthTree = () => request({ url: '/dept/auth/tree', method: 'get' })
export const getOperateTree = () => request({ url: '/dept/operate/tree', method: 'get' })
