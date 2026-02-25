import { defineStore } from 'pinia'
import {
  cancelPosition,
  createPosition,
  exportPositionApplications,
  exportPositions,
  getPositionApplications,
  getPositionDetail,
  getPositionList,
  getPositionUsers,
  modifyPosition,
  reviewPositionApplication,
  revokePositionApplication,
} from '@/api/post'

export const usePostStore = defineStore('post', {
  actions: {
    fetchList(params?: any) {
      return getPositionList(params)
    },
    exportList(params?: any) {
      return exportPositions(params)
    },
    fetchDetail(id: string | number) {
      return getPositionDetail(id)
    },
    fetchUsers(id: string | number) {
      return getPositionUsers(id)
    },
    create(data: any) {
      return createPosition(data)
    },
    update(id: string | number, data: any) {
      return modifyPosition(id, data)
    },
    cancel(id: string | number, data?: any) {
      return cancelPosition(id, data)
    },
    fetchApplications(params?: any) {
      return getPositionApplications(params)
    },
    exportApplications(params?: any) {
      return exportPositionApplications(params)
    },
    reviewApplication(id: string | number, data: any) {
      return reviewPositionApplication(id, data)
    },
    revokeApplication(id: string | number, params?: any) {
      return revokePositionApplication(id, params)
    },
  },
})
