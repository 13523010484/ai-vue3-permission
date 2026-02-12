import request from '@/utils/request'
import { AxiosPromise } from 'axios'

// 用户管理相关API

/**
 * 查询用户列表
 */
export function getUserList(params?: any): AxiosPromise<any> {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: string): AxiosPromise<any> {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

/**
 * 新增用户
 */
export function addUser(data: any): AxiosPromise<any> {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 */
export function updateUser(id: string, data: any): AxiosPromise<any> {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户
 */
export function deleteUser(id: string): AxiosPromise<any> {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

/**
 * 注销用户
 */
export function logoutUser(id: string): AxiosPromise<any> {
  return request({
    url: `/users/${id}/logout`,
    method: 'post'
  })
}

/**
 * 恢复用户
 */
export function restoreUser(id: string): AxiosPromise<any> {
  return request({
    url: `/users/${id}/restore`,
    method: 'post'
  })
}

/**
 * 重置用户密码
 */
export function resetUserPassword(id: string): AxiosPromise<any> {
  return request({
    url: `/users/${id}/reset-password`,
    method: 'post'
  })
}

/**
 * 分配用户到部门
 */
export function assignUserToDepartment(userId: string, departmentId: string): AxiosPromise<any> {
  return request({
    url: `/users/${userId}/departments/${departmentId}`,
    method: 'post'
  })
}