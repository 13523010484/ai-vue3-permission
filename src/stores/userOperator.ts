import { defineStore } from 'pinia'
import {
  assignOperatorPermissions,
  bindOperatorCert,
  cancelOperator,
  createOperator,
  exportOperatorApplications,
  exportOperators,
  freezeOperator,
  getOperatorApplications,
  getOperatorCertificates,
  getOperatorDetail,
  getOperatorList,
  getOperatorPermissions,
  modifyOperator,
  resetOperatorPassword,
  reviewOperatorApplication,
  revokeOperatorApplication,
  unfreezeOperator,
} from '@/api/userOperator'

export const useUserOperatorStore = defineStore('userOperator', {
  actions: {
    fetchList(params?: any) {
      return getOperatorList(params)
    },
    exportList(params?: any) {
      return exportOperators(params)
    },
    fetchDetail(id: string | number, params?: any) {
      return getOperatorDetail(id, params)
    },
    fetchPermissions(id: string | number, params?: any) {
      return getOperatorPermissions(id, params)
    },
    fetchCertificates(id: string | number, params?: any) {
      return getOperatorCertificates(id, params)
    },
    create(data: any) {
      return createOperator(data)
    },
    update(id: string | number, data: any) {
      return modifyOperator(id, data)
    },
    cancel(id: string | number, data?: any) {
      return cancelOperator(id, data)
    },
    freeze(id: string | number, data?: any) {
      return freezeOperator(id, data)
    },
    unfreeze(id: string | number, data?: any) {
      return unfreezeOperator(id, data)
    },
    resetPassword(id: string | number, data?: any) {
      return resetOperatorPassword(id, data)
    },
    bindCert(id: string | number, data?: any) {
      return bindOperatorCert(id, data)
    },
    assignPermissions(id: string | number, data?: any) {
      return assignOperatorPermissions(id, data)
    },
    fetchApplications(params?: any) {
      return getOperatorApplications(params)
    },
    exportApplications(params?: any) {
      return exportOperatorApplications(params)
    },
    reviewApplication(id: string | number, data: any) {
      return reviewOperatorApplication(id, data)
    },
    revokeApplication(id: string | number, operatorId: string | number) {
      return revokeOperatorApplication(id, operatorId)
    },
  },
})
