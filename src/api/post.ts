import request from '@/utils/request'
import { AxiosPromise } from 'axios'

// 岗位管理相关API

/**
 * 查询岗位列表
 */
export function getPostList(params?: any): AxiosPromise<any> {
  return request({
    url: '/posts',
    method: 'get',
    params
  })
}

/**
 * 获取岗位详情
 */
export function getPostDetail(id: string): AxiosPromise<any> {
  return request({
    url: `/posts/${id}`,
    method: 'get'
  })
}

/**
 * 新增岗位
 */
export function addPost(data: any): AxiosPromise<any> {
  return request({
    url: '/posts',
    method: 'post',
    data
  })
}

/**
 * 更新岗位
 */
export function updatePost(id: string, data: any): AxiosPromise<any> {
  return request({
    url: `/posts/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除岗位
 */
export function deletePost(id: string): AxiosPromise<any> {
  return request({
    url: `/posts/${id}`,
    method: 'delete'
  })
}

/**
 * 注销岗位
 */
export function logoutPost(id: string): AxiosPromise<any> {
  return request({
    url: `/posts/${id}/logout`,
    method: 'post'
  })
}

/**
 * 恢复岗位
 */
export function restorePost(id: string): AxiosPromise<any> {
  return request({
    url: `/posts/${id}/restore`,
    method: 'post'
  })
}