import { defineStore } from 'pinia'
import type {
  DeptListQuery,
  DeptCreatePayload,
  DeptApplyQuery,
  AuthTreeNode,
  OperateTreeNode,
  DeptRow,
} from '@/types/department'
import {
  getDepartmentList,
  createDepartment,
  modifyDepartment,
  cancelDepartment,
  getDeptUsers,
  getDepartmentApplications,
  exportDepartmentApplications,
  reviewDepartmentApplication,
  revokeDepartmentApplication,
} from '@/api/department'
import { getMenuTree } from '@/api/menu'

type CreateApplicationInput = {
  deptName: string
  remark: string
  authKeys: string[]
  operateKeys: string[]
}

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    list: [] as DeptRow[],
    loading: false,
    authTree: [] as AuthTreeNode[],
    operateTree: [] as OperateTreeNode[],
  }),
  actions: {
    async fetchList(params?: DeptListQuery) {
      this.loading = true
      try {
        const res: any = await getDepartmentList(params)
        const payload = res?.data ?? res
        const rawList = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : payload?.list || []
        const toStatus = (value: string) => {
          if (value === 'NORMAL') return '1'
          if (value === 'CANCELED') return '2'
          return value
        }
        const toDeptStatus = (value: string) => {
          if (value === '1') return 'NORMAL'
          if (value === '2') return 'CANCELED'
          return value
        }
        this.list = rawList.map((item: any) => ({
          id: String(item.id ?? ''),
          deptName: item.deptName ?? item.name ?? '',
          remark: item.remark ?? '',
          status: toStatus(item.deptStatus ?? item.status ?? ''),
          deptStatus: item.deptStatus ?? toDeptStatus(item.status ?? ''),
          createdOperName: item.createdOperName ?? '',
          createdAt: item.createdAt ?? '',
          updatedOperName: item.updatedOperName ?? '',
          updatedAt: item.updatedAt ?? '',
          reviewOperName: item.reviewOperName ?? '',
          reviewTime: item.reviewTime ?? '',
        }))
      } finally {
        this.loading = false
      }
    },
    async fetchTrees() {
      try {
        const res: any = await getMenuTree()
        const payload = res?.data ?? res
        const raw = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
        const toTree = (items: any[]): AuthTreeNode[] =>
          (items ?? []).map((item) => {
            const id = String(
              item.id ??
                item.menuId ??
                item.code ??
                item.key ??
                item.name ??
                item.title ??
                item.menuName ??
                '',
            )
            const label = String(
              item.label ??
                item.name ??
                item.title ??
                item.menuName ??
                item.menuTitle ??
                id,
            )
            const childrenSource =
              item.children ?? item.childList ?? item.subMenus ?? item.submenu ?? []
            return {
              id,
              label,
              children: toTree(Array.isArray(childrenSource) ? childrenSource : []),
            }
          })
        const tree = toTree(raw)
        this.authTree = tree
        this.operateTree = tree
      } catch (e) {
        this.authTree = []
        this.operateTree = []
      }
    },
    async fetchDeptUsers(id: string | number) {
      return getDeptUsers(id)
    },
    async fetchApplications(params?: DeptApplyQuery) {
      return getDepartmentApplications(params)
    },
    async exportApplications(params?: DeptApplyQuery) {
      return exportDepartmentApplications(params)
    },
    async reviewApplication(id: string | number, data: any) {
      return reviewDepartmentApplication(id, data)
    },
    async revokeApplication(id: string | number, params?: any) {
      return revokeDepartmentApplication(id, params)
    },
    async createApplication(input: CreateApplicationInput) {
      const toBtnList = (keys: string[]) =>
        keys
          .map((key) => Number(key))
          .filter((val) => Number.isFinite(val))
          .map((val) => ({ btnId: val }))

      const payload: DeptCreatePayload = {
        deptName: input.deptName,
        remark: input.remark,
        assignAuth: toBtnList(input.authKeys),
        operAuth: toBtnList(input.operateKeys),
      }

      return createDepartment(payload)
    },
    async updateDept(id: string | number, payload: any) {
      return modifyDepartment(id, payload)
    },
    async logoutDept(id: string | number) {
      const raw = localStorage.getItem('userInfo')
      const user = raw ? JSON.parse(raw) : null
      const applicant = {
        applicantId: Number(user?.id ?? 1),
        applicantName: String(user?.name ?? user?.username ?? 'admin'),
        applicantDeptId: Number(user?.deptId ?? 1),
        applicantDeptName: String(user?.deptName ?? '默认部门'),
      }
      return cancelDepartment(id, applicant)
    },
  },
})

