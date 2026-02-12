import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

// 参与者管理相关API

/**
 * 查询参与者列表
 */
export function getParticipantList(params?: any): AxiosPromise<any> {
  return request({
    url: '/participants',
    method: 'get',
    params
  })
}

/**
 * 获取参与者详情
 */
export function getParticipantDetail(id: string): AxiosPromise<any> {
  return request({
    url: `/participants/${id}`,
    method: 'get'
  })
}

/**
 * 新增参与者
 */
export function addParticipant(data: any): AxiosPromise<any> {
  return request({
    url: '/participants',
    method: 'post',
    data
  })
}

/**
 * 更新参与者
 */
export function updateParticipant(id: string, data: any): AxiosPromise<any> {
  return request({
    url: `/participants/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除参与者
 */
export function deleteParticipant(id: string): AxiosPromise<any> {
  return request({
    url: `/participants/${id}`,
    method: 'delete'
  })
}

/**
 * 注销参与者
 */
export function logoutParticipant(id: string): AxiosPromise<any> {
  return request({
    url: `/participants/${id}/logout`,
    method: 'post'
  })
}

/**
 * 恢复参与者
 */
export function restoreParticipant(id: string): AxiosPromise<any> {
  return request({
    url: `/participants/${id}/restore`,
    method: 'post'
  })
}

/**
 * 获取参与者证书信息
 */
export function getParticipantCertificates(participantId: string): AxiosPromise<any> {
  return request({
    url: `/participants/${participantId}/certificates`,
    method: 'get'
  })
}

/**
 * 获取现货平台信息
 */
export function getSpotPlatformList(params?: any): AxiosPromise<any> {
  return request({
    url: '/spot-platforms',
    method: 'get',
    params
  })
}

/**
 * 获取现货清算会员信息
 */
export function getSpotClearingMemberList(params?: any): AxiosPromise<any> {
  return request({
    url: '/spot-clearing-members',
    method: 'get',
    params
  })
}

/**
 * 获取现货交易商信息
 */
export function getSpotTraderList(params?: any): AxiosPromise<any> {
  return request({
    url: '/spot-traders',
    method: 'get',
    params
  })
}

/**
 * 获取现货清算产品信息
 */
export function getSpotClearingProductList(params?: any): AxiosPromise<any> {
  return request({
    url: '/spot-clearing-products',
    method: 'get',
    params
  })
}

/**
 * 获取现货结算账户信息
 */
export function getSpotSettlementAccountList(params?: any): AxiosPromise<any> {
  return request({
    url: '/spot-settlement-accounts',
    method: 'get',
    params
  })
}

/**
 * 获取现货平台资金账户信息
 */
export function getSpotPlatformFundAccountList(params?: any): AxiosPromise<any> {
  return request({
    url: '/spot-platform-fund-accounts',
    method: 'get',
    params
  })
}

/**
 * 获取交易商资金账户信息
 */
export function getTraderFundAccountList(params?: any): AxiosPromise<any> {
  return request({
    url: '/trader-fund-accounts',
    method: 'get',
    params
  })
}

/**
 * 获取仓库组织信息
 */
export function getWarehouseOrgList(params?: any): AxiosPromise<any> {
  return request({
    url: '/warehouse-orgs',
    method: 'get',
    params
  })
}

/**
 * 获取仓库区域信息
 */
export function getWarehouseAreaList(params?: any): AxiosPromise<any> {
  return request({
    url: '/warehouse-areas',
    method: 'get',
    params
  })
}

/**
 * 获取仓库区域存储关系信息
 */
export function getWarehouseAreaStorageRelationList(params?: any): AxiosPromise<any> {
  return request({
    url: '/warehouse-area-storage-relations',
    method: 'get',
    params
  })
}