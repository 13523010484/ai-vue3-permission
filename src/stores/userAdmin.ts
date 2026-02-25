import { defineStore } from 'pinia'
import {
  bindAdminCert,
  cancelAdmin,
  createAdmin,
  exportAdminApplications,
  exportAdmins,
  freezeAdmin,
  getAdminApplications,
  getAdminCertificates,
  getAdminDetail,
  getAdminList,
  getAdminPermissions,
  modifyAdmin,
  resetAdminPassword,
  reviewAdminApplication,
  revokeAdminApplication,
  unfreezeAdmin,
} from '@/api/userAdmin'

export const useUserAdminStore = defineStore('userAdmin', {
  actions: {
    fetchList(params?: any) {
      return getAdminList(params)
    },
    exportList(params?: any) {
      return exportAdmins(params)
    },
    fetchDetail(id: string | number, params?: any) {
      return getAdminDetail(id, params)
    },
    fetchPermissions(id: string | number, params?: any) {
      return getAdminPermissions(id, params)
    },
    fetchCertificates(id: string | number, params?: any) {
      return getAdminCertificates(id, params)
    },
    create(data: any) {
      return createAdmin(data)
    },
    update(id: string | number, data: any) {
      return modifyAdmin(id, data)
    },
    cancel(id: string | number, data?: any) {
      return cancelAdmin(id, data)
    },
    freeze(id: string | number, data?: any) {
      return freezeAdmin(id, data)
    },
    unfreeze(id: string | number, data?: any) {
      return unfreezeAdmin(id, data)
    },
    resetPassword(id: string | number, data?: any) {
      return resetAdminPassword(id, data)
    },
    bindCert(id: string | number, data?: any) {
      return bindAdminCert(id, data)
    },
    fetchApplications(params?: any) {
      return getAdminApplications(params)
    },
    exportApplications(params?: any) {
      return exportAdminApplications(params)
    },
    reviewApplication(id: string | number, data: any) {
      return reviewAdminApplication(id, data)
    },
    revokeApplication(id: string | number, operatorId: string | number) {
      return revokeAdminApplication(id, operatorId)
    },
  },
})
