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
