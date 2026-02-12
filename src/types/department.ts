export interface DeptListQuery {
  deptName?: string
  status?: string | number
  page?: number
  size?: number
}

export interface DeptRow {
  id: string
  deptName: string
  remark?: string
  status?: string
  deptStatus?: string
  createdOperName?: string
  createdAt?: string
  updatedOperName?: string
  updatedAt?: string
  reviewOperName?: string
  reviewTime?: string
}

export interface DeptDetail {
  id: string
  name: string
  remark?: string
  status?: string
  authScopes?: any[]
  operScopes?: any[]
}

export interface DeptForm {
  name: string
  remark?: string
  authScopes?: any[]
  operScopes?: any[]
}

export interface DeptApplicationPayload {
  name: string
  remark?: string
  authScopes?: any[]
  operScopes?: any[]
  externalScopes?: any[]
  applicantId?: number
  applicantName?: string
  applicantDeptId?: number
  applicantDeptName?: string
}

export interface DeptApplyQuery {
  statusType?: string
  startDate?: string
  endDate?: string
  applyNo?: string
  deptName?: string
  operationType?: string
}

export interface DeptApplySummary {
  id: number | string
  applyNo?: string
  deptId?: number | string
  deptName?: string
  operationType?: string
  status?: string
  applicantName?: string
  applyTime?: string
  reviewOperName?: string
  reviewTime?: string
  revokeTime?: string
  deptStatus?: string
  remark?: string
}

export interface AuthTreeNode {
  id: string
  label: string
  children?: AuthTreeNode[]
}

export interface OperateTreeNode {
  id: string
  label: string
  children?: OperateTreeNode[]
}

