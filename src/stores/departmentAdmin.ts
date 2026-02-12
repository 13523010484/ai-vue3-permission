import { defineStore } from 'pinia'

type StatusValue = '1' | '2' | '3' | '4'

type QueryForm = {
  operCode: string
  operName: string
  status: StatusValue | ''
}

type DepartmentAdmin = {
  id: string
  deptName: string
  operCode: string
  operName: string
  telPhone: string
  mobile: string
  status: StatusValue
  remark: string
  inputOperName: string
  inputTime: string
  updateOperName: string
  updateTime: string
  reviewOperName: string
  reviewTime: string
  isSelf?: boolean
}

type Certificate = {
  id: string
  certDN: string
  certOrg: string
  certAlgorithm: string
  status: string
  validFrom: string
  validTo: string
}

const now = '2026/02/09 13:30:00'

export const useDepartmentAdminStore = defineStore('departmentAdmin', {
  state: () => ({
    currentRole: 'super' as 'super' | 'dept',
    currentDept: '清算管理部',
    query: {
      operCode: '',
      operName: '',
      status: '' as StatusValue | '',
    },
    list: [
      {
        id: 'U1001',
        deptName: '清算管理部',
        operCode: 'deptadmin01',
        operName: '王宁',
        telPhone: '021-55550001',
        mobile: '13800000001',
        status: '1',
        remark: '负责清算管理部日常维护',
        inputOperName: 'superadmin',
        inputTime: now,
        updateOperName: 'superadmin',
        updateTime: now,
        reviewOperName: 'auditor01',
        reviewTime: now,
        isSelf: false,
      },
      {
        id: 'U1002',
        deptName: '技术保障部',
        operCode: 'deptadmin02',
        operName: '李娜',
        telPhone: '021-55550002',
        mobile: '13800000002',
        status: '2',
        remark: '临时冻结，待复核',
        inputOperName: 'superadmin',
        inputTime: now,
        updateOperName: 'superadmin',
        updateTime: now,
        reviewOperName: 'auditor01',
        reviewTime: now,
        isSelf: false,
      },
      {
        id: 'U1003',
        deptName: '清算管理部',
        operCode: 'deptadmin03',
        operName: '赵敏',
        telPhone: '021-55550003',
        mobile: '13800000003',
        status: '4',
        remark: '',
        inputOperName: 'superadmin',
        inputTime: now,
        updateOperName: 'superadmin',
        updateTime: now,
        reviewOperName: 'auditor01',
        reviewTime: now,
        isSelf: true,
      },
    ] as DepartmentAdmin[],
    certificates: [
      {
        id: 'C1001',
        certDN: 'CN=Cert-001,OU=Dept,O=Org',
        certOrg: '000100+上清结算',
        certAlgorithm: 'RSA',
        status: '有效',
        validFrom: '2024/01/01',
        validTo: '2027/01/01',
      },
      {
        id: 'C1002',
        certDN: 'CN=Cert-002,OU=Dept,O=Org',
        certOrg: '000200+金融科技',
        certAlgorithm: 'SM2',
        status: '有效',
        validFrom: '2024/06/01',
        validTo: '2026/06/01',
      },
      {
        id: 'C1003',
        certDN: 'CN=Cert-003,OU=Dept,O=Org',
        certOrg: '000300+业务运营',
        certAlgorithm: 'RSA',
        status: '冻结',
        validFrom: '2023/01/01',
        validTo: '2025/01/01',
      },
    ] as Certificate[],
    deptOptions: ['清算管理部', '技术保障部', '业务运营部'],
    authTree: [
      {
        id: 'A1',
        label: '清算管理',
        children: [
          { id: 'A1-1', label: '查询' },
          { id: 'A1-2', label: '新增' },
          { id: 'A1-3', label: '修改' },
        ],
      },
      {
        id: 'A2',
        label: '运营服务',
        children: [
          { id: 'A2-1', label: '导出' },
          { id: 'A2-2', label: '冻结' },
        ],
      },
    ],
    operateTree: [
      {
        id: 'O1',
        label: '系统管理',
        children: [
          { id: 'O1-1', label: '用户维护' },
          { id: 'O1-2', label: '角色维护' },
        ],
      },
      {
        id: 'O2',
        label: '安全管理',
        children: [
          { id: 'O2-1', label: '证书绑定' },
          { id: 'O2-2', label: '权限刷新' },
        ],
      },
    ],
  }),
  getters: {
    filteredList: (state) => {
      return state.list.filter((item) => {
        if (state.currentRole === 'dept' && item.deptName !== state.currentDept) return false
        if (state.query.operCode && !item.operCode.includes(state.query.operCode)) return false
        if (state.query.operName && !item.operName.includes(state.query.operName)) return false
        if (state.query.status && item.status !== state.query.status) return false
        return true
      })
    },
  },
  actions: {
    setQuery(query: QueryForm) {
      this.query = query
    },
    exportData() {
      return true
    },
    addUser(payload: DepartmentAdmin) {
      const exists = this.list.some((item) => item.operCode === payload.operCode)
      if (exists) {
        return { ok: false, message: '用户名已存在或存在待复核申请' }
      }
      const newUser: DepartmentAdmin = {
        ...payload,
        id: `U${Math.floor(Math.random() * 9000 + 1000)}`,
        inputOperName: 'superadmin',
        inputTime: now,
        updateOperName: 'superadmin',
        updateTime: now,
        reviewOperName: '',
        reviewTime: '',
        status: '4',
        remark: payload.remark || '',
      }
      this.list.unshift(newUser)
      return { ok: true }
    },
    updateUser(payload: DepartmentAdmin) {
      const index = this.list.findIndex((item) => item.id === payload.id)
      if (index === -1) return { ok: false, message: '未找到用户' }
      const original = this.list[index]
      const changed =
        original.operName !== payload.operName ||
        original.telPhone !== payload.telPhone ||
        original.mobile !== payload.mobile ||
        original.remark !== payload.remark
      if (!changed) return { ok: false, message: '请修改数据后再保存' }
      this.list[index] = {
        ...original,
        operName: payload.operName,
        telPhone: payload.telPhone,
        mobile: payload.mobile,
        remark: payload.remark,
        updateOperName: 'superadmin',
        updateTime: now,
      }
      return { ok: true }
    },
    changeStatus(id: string, status: StatusValue) {
      const item = this.list.find((row) => row.id === id)
      if (!item) return
      item.status = status
      item.updateOperName = 'superadmin'
      item.updateTime = now
    },
    filteredCertificates(keyword: string) {
      if (!keyword) return this.certificates
      return this.certificates.filter((item) => item.certDN.includes(keyword))
    },
    bindCertificates(id: string) {
      if (!id) return { ok: false, message: '请选择用户' }
      return { ok: true }
    },
    getUserPermissions(row: DepartmentAdmin) {
      if (this.currentRole === 'super') {
        return {
          auth: ['A1-1', 'A1-2', 'A1-3', 'A2-1', 'A2-2'],
          operate: ['O1-1', 'O1-2', 'O2-1', 'O2-2'],
        }
      }
      if (row.deptName === this.currentDept) {
        return { auth: ['A1-1', 'A2-1'], operate: ['O2-1'] }
      }
      return { auth: [], operate: [] }
    },
    refreshPermissions(row: DepartmentAdmin) {
      return this.getUserPermissions(row)
    },
  },
})
