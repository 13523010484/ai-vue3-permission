import { defineStore } from 'pinia'
import type {
  DeptListQuery,
  DeptApplicationPayload,
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
  getAuthTree,
  getOperateTree,
} from '@/api/department'

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
        const data = res?.data ?? res
        this.list = Array.isArray(data) ? data : data?.list || []
      } finally {
        this.loading = false
      }
    },
    async fetchTrees() {
      try {
        const [authRes, operateRes]: any = await Promise.all([getAuthTree(), getOperateTree()])
        const authData = authRes?.data ?? authRes
        const operateData = operateRes?.data ?? operateRes
        this.authTree = Array.isArray(authData) ? authData : []
        this.operateTree = Array.isArray(operateData) ? operateData : []
      } catch (e) {
        this.authTree = []
        this.operateTree = []
      }
    },
    async fetchDeptUsers(id: string | number) {
      return getDeptUsers(id)
    },
    async createApplication(input: CreateApplicationInput) {
      const buildScopeMap = (nodes: (AuthTreeNode | OperateTreeNode)[]) => {
        const map = new Map<string, string>()
        const walk = (list: (AuthTreeNode | OperateTreeNode)[]) => {
          list.forEach((node) => {
            map.set(node.id, node.label)
            if (node.children && node.children.length) walk(node.children)
          })
        }
        walk(nodes)
        return map
      }

      const authMap = buildScopeMap(this.authTree)
      const operateMap = buildScopeMap(this.operateTree)

      const toScopeList = (keys: string[], map: Map<string, string>) =>
        keys.map((key) => ({ scopeCode: key, scopeName: map.get(key) || key }))

      const getApplicantInfo = () => {
        try {
          const raw = localStorage.getItem('userInfo')
          const user = raw ? JSON.parse(raw) : null
          return {
            applicantId: Number(user?.id ?? 1),
            applicantName: String(user?.name ?? user?.username ?? 'admin'),
            applicantDeptId: Number(user?.deptId ?? 1),
            applicantDeptName: String(user?.deptName ?? '默认部门'),
          }
        } catch {
          return {
            applicantId: 1,
            applicantName: 'admin',
            applicantDeptId: 1,
            applicantDeptName: '默认部门',
          }
        }
      }

      const applicant = getApplicantInfo()
      const payload: DeptApplicationPayload = {
        name: input.deptName,
        remark: input.remark,
        authScopes: toScopeList(input.authKeys, authMap),
        operScopes: toScopeList(input.operateKeys, operateMap),
        externalScopes: [],
        ...applicant,
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
