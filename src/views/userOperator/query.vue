<template>
  <div class="dept-page">
    <el-card class="page-card query-card" shadow="never">
      <el-form :model="queryForm" label-width="90px" class="query-form">
        <el-row :gutter="16" align="middle">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户名">
              <el-input
                v-model="queryForm.username"
                maxlength="30"
                clearable
                placeholder="模糊查询"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户姓名">
              <el-input
                v-model="queryForm.realName"
                maxlength="30"
                clearable
                placeholder="模糊查询"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户状态">
              <el-select v-model="queryForm.status" placeholder="全部" clearable>
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="24" :md="24">
            <div class="query-actions">
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="page-card table-card" shadow="never">
      <div class="table-header">
        <div class="table-actions">
          <el-button type="primary" plain @click="openAddDialog">新增</el-button>
          <el-button type="success" @click="handleDownload" :disabled="filteredList.length === 0"
            >下载</el-button
          >
        </div>
      </div>
      <div class="table-wrap">
        <el-table
          ref="tableRef"
          :data="filteredList"
          border
          stripe
          class="dept-table"
          table-layout="auto"
        >
          <el-table-column class-name="action-col" type="index" label="序号" width="70" fixed="left" />

          <el-table-column prop="deptName" label="部门名称" min-width="160">
            <template #default="{ row }">
              <el-tooltip v-if="row.deptName.length > 10" :content="row.deptName">
                <span>{{ truncateText(row.deptName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="action-col" prop="username" label="用户名" min-width="120" />
          <el-table-column prop="realName" label="用户姓名" min-width="120" />
          <el-table-column prop="officePhone" label="办公电话" min-width="140" />
          <el-table-column prop="mobile" label="手机" min-width="140" />
          <el-table-column prop="statusLabel" label="用户状态" min-width="120" />
          <el-table-column prop="remark" label="备注" min-width="160">
            <template #default="{ row }">
              <el-tooltip v-if="row.remark && row.remark.length > 10" :content="row.remark">
                <span>{{ truncateText(row.remark, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="action-col" prop="createdBy" label="录入人" min-width="120" />
          <el-table-column prop="createdAt" label="录入时间" min-width="170" />
          <el-table-column prop="updatedBy" label="更新人" min-width="120" />
          <el-table-column prop="updatedAt" label="更新时间" min-width="170" />
          <el-table-column prop="reviewedBy" label="复核人" min-width="120" />
          <el-table-column prop="reviewedAt" label="复核时间" min-width="170" />
          <el-table-column label="操作" fixed="right" width="1" class-name="action-col action-col--ops">
            <template #default="{ row }">
              <el-button link size="small" type="primary" @click="openDetailDialog(row)">详情</el-button>
              <el-button link size="small" type="primary" @click="openEditDialog(row)" :disabled="!canEdit(row)"
                >修改</el-button
              >
              <el-button link size="small" type="warning" @click="handleFreeze(row)" :disabled="!canFreeze(row)"
                >冻结</el-button
              >
              <el-button link size="small"
                type="success"
                @click="handleUnfreeze(row)"
                :disabled="!canUnfreeze(row)"
                >解冻</el-button
              >
              <el-button link size="small" type="danger" @click="handleLogout(row)" :disabled="!canLogout(row)"
                >注销</el-button
              >
              <el-button link size="small"
                type="primary"
                @click="openAssignDialog(row)"
                :disabled="!canAssign(row)"
              >
                分配权限
              </el-button>
              <el-button link size="small"
                type="primary"
                @click="handleResetPwd(row)"
                :disabled="!canResetPwd(row)"
              >
                重置密码
              </el-button>
              <el-button link size="small" type="primary" @click="openBindDialog(row)" :disabled="!canBind(row)">
                绑定证书
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="980px" @close="closeDialog">
      <div class="dialog-grid">
        <section class="panel">
          <div class="panel-title">基本信息</div>
          <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="90px">
            <el-form-item label="部门名称" prop="deptName">
              <el-select v-model="editForm.deptName" disabled>
                <el-option v-for="dept in deptOptions" :key="dept" :label="dept" :value="dept" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="editForm.username"
                maxlength="30"
                :disabled="dialogMode !== 'add'"
              />
            </el-form-item>
            <el-form-item label="用户姓名" prop="realName">
              <el-input v-model="editForm.realName" maxlength="30" :disabled="isBaseReadonly" />
            </el-form-item>
            <el-form-item label="办公电话">
              <el-input v-model="editForm.officePhone" maxlength="32" :disabled="isBaseReadonly" />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="editForm.mobile" maxlength="32" :disabled="isBaseReadonly" />
            </el-form-item>
            <el-form-item label="用户类型">
              <el-select v-model="editForm.userType" disabled>
                <el-option label="部门操作员" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select v-model="editForm.status" disabled>
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="editForm.remark"
                type="textarea"
                :rows="4"
                maxlength="500"
                show-word-limit
                :disabled="isBaseReadonly"
              />
            </el-form-item>
          </el-form>
        </section>

        <section class="panel">
          <div class="panel-title">备选岗位</div>
          <div :class="{ 'tree-disabled': dialogMode === 'detail' }">
            <el-checkbox-group v-model="selectedPosts" :disabled="dialogMode === 'detail'">
              <el-checkbox v-for="post in postOptions" :key="post.id" :label="post.id">
                {{ post.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </section>

        <section class="panel">
          <div class="panel-title">操作权限</div>
          <div :class="{ 'tree-disabled': dialogMode === 'detail' }">
            <el-tree
              ref="operateTreeRef"
              :data="operateTree"
              show-checkbox
              node-key="id"
              default-expand-all
              :props="{ label: 'label', children: 'children' }"
              :default-checked-keys="operateChecked"
              :disabled="dialogMode === 'detail'"
            />
          </div>
        </section>
      </div>

      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="dialogMode === 'detail'" @click="handleSaveEdit"
          >保存</el-button
        >
        <el-button v-if="dialogMode === 'detail'" type="primary" @click="handleRefreshAuth"
          >刷新权限</el-button
        >
      </template>
    </el-dialog>

    <el-dialog v-model="bindVisible" title="绑定证书" width="760px">
      <el-form :model="bindQuery" label-width="80px">
        <el-form-item label="证书DN">
          <el-input
            v-model="bindQuery.dn"
            placeholder="模糊查询，长度500字符"
            maxlength="500"
            clearable
          />
        </el-form-item>
        <div class="query-actions">
          <el-button type="primary" @click="handleBindQuery">查询</el-button>
          <el-button @click="handleBindReset">重置</el-button>
        </div>
      </el-form>
      <el-table ref="tableRef" :data="bindTable" border stripe @selection-change="handleBindSelectionChange">
        <el-table-column type="index" label="序号" width="70" fixed="left" />

        <el-table-column type="selection" width="55" />
        <el-table-column prop="certNo" label="证书编号" min-width="240" />
        <el-table-column prop="certName" label="证书名称" min-width="180" />
      </el-table>
      <template #footer>
        <el-button @click="bindVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBindSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  assignOperatorPermissions,
  bindOperatorCert,
  cancelOperator,
  createOperator,
  exportOperators,
  freezeOperator,
  getOperatorCertificates,
  getOperatorDetail,
  getOperatorList,
  getOperatorPermissions,
  modifyOperator,
  resetOperatorPassword,
  unfreezeOperator,
} from '@/api/userOperator'
import { getPositionList } from '@/api/post'

type StatusValue = '1' | '2' | '3' | '4' | ''

type UserRow = {
  id: string
  deptName: string
  username: string
  realName: string
  officePhone: string
  mobile: string
  status: StatusValue
  statusLabel: string
  remark: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  reviewedBy: string
  reviewedAt: string
  isSelf?: boolean
}

type CertOption = {
  certId: number
  certNo: string
  certName: string
  selected?: boolean
}

const statusOptions = [
  { value: '1', label: '正常' },
  { value: '2', label: '冻结' },
  { value: '3', label: '注销' },
  { value: '4', label: '密码重置' },
]

const queryForm = ref({
  username: '',
  realName: '',
  status: '' as StatusValue,
})

const list = ref<UserRow[]>([])
const loading = ref(false)

const statusCodeMap: Record<string, StatusValue> = {
  NORMAL: '1',
  FROZEN: '2',
  CANCELED: '3',
  PASSWORD_RESET: '4',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
}

const statusLabelMap: Record<string, string> = {
  NORMAL: '正常',
  FROZEN: '冻结',
  CANCELED: '注销',
  PASSWORD_RESET: '密码重置',
  '1': '正常',
  '2': '冻结',
  '3': '注销',
  '4': '密码重置',
}

const formatDateTime = (value?: string) => {
  if (!value) return '-'
  return value.replace('T', ' ').replaceAll('-', '/')
}

const getDeptId = () => {
  const raw = localStorage.getItem('deptId')
  const val = raw ? Number(raw) : NaN
  return Number.isFinite(val) && val > 0 ? val : undefined
}

const getDeptName = () => {
  try {
    const raw = localStorage.getItem('userInfo')
    const user = raw ? JSON.parse(raw) : null
    return String(user?.deptName ?? localStorage.getItem('deptName') ?? '默认部门')
  } catch {
    return String(localStorage.getItem('deptName') ?? '默认部门')
  }
}

const getApplicantInfo = () => {
  try {
    const raw = localStorage.getItem('userInfo')
    const user = raw ? JSON.parse(raw) : null
    return {
      applicantId: Number(user?.id ?? 1),
      applicantName: String(user?.name ?? user?.username ?? 'admin'),
      applicantDeptId: Number(user?.deptId ?? getDeptId() ?? 1),
      applicantDeptName: String(user?.deptName ?? editForm.value.deptName ?? getDeptName()),
    }
  } catch {
    return {
      applicantId: 1,
      applicantName: 'admin',
      applicantDeptId: Number(getDeptId() ?? 1),
      applicantDeptName: String(editForm.value.deptName || getDeptName()),
    }
  }
}

const buildQueryParams = () => {
  const statusMap: Record<string, string> = {
    '1': 'NORMAL',
    '2': 'FROZEN',
    '3': 'CANCELED',
    '4': 'PASSWORD_RESET',
  }
  return {
    deptId: getDeptId(),
    username: queryForm.value.username || undefined,
    fullName: queryForm.value.realName || undefined,
    status: queryForm.value.status ? statusMap[queryForm.value.status] : undefined,
  }
}

const normalizeOperator = (item: any): UserRow => {
  const rawStatus = item.status ?? ''
  const status = statusCodeMap[rawStatus] ?? '1'
  return {
    id: String(item.id ?? ''),
    deptName: item.deptName ?? '-',
    username: item.username ?? '-',
    realName: item.fullName ?? item.realName ?? '-',
    officePhone: item.officePhone ?? '-',
    mobile: item.mobilePhone ?? item.mobile ?? '-',
    status,
    statusLabel: statusLabelMap[rawStatus] ?? statusLabelMap[status] ?? '-',
    remark: item.remark ?? '-',
    createdBy: item.createdOperName ?? '-',
    createdAt: formatDateTime(item.createdAt),
    updatedBy: item.updatedOperName ?? '-',
    updatedAt: formatDateTime(item.updatedAt),
    reviewedBy: item.reviewOperName ?? '-',
    reviewedAt: formatDateTime(item.reviewTime),
    isSelf: false,
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const response = await getOperatorList(buildQueryParams())
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    list.value = (items ?? []).map(normalizeOperator)
  } catch {
    list.value = []
    ElMessage.error('获取操作员列表失败')
  } finally {
    loading.value = false
  }
}

const filteredList = computed(() => list.value)

const handleQuery = () => {
  fetchList()
}

const handleReset = () => {
  queryForm.value = { username: '', realName: '', status: '' }
  fetchList()
}

const downloadBlob = (data: Blob, filename: string) => {
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const handleDownload = async () => {
  try {
    const response = await exportOperators(buildQueryParams())
    const payload = response?.data ?? response
    const blob = payload instanceof Blob ? payload : new Blob([payload])
    downloadBlob(blob, `操作员查询_${new Date().getTime()}.xlsx`)
  } catch {
    ElMessage.error('下载失败')
  }
}

const truncateText = (text: string, size: number) => {
  if (!text) return '-'
  return text.length > size ? `${text.slice(0, size)}…` : text
}

const canEdit = (row: UserRow) => ['1', '4'].includes(row.status)
const canFreeze = (row: UserRow) => row.status === '1' && !row.isSelf
const canUnfreeze = (row: UserRow) => row.status === '2' && !row.isSelf
const canResetPwd = (row: UserRow) => row.status === '1' && !row.isSelf
const canLogout = (row: UserRow) => ['1', '4'].includes(row.status) && !row.isSelf
const canBind = (row: UserRow) => ['1', '4'].includes(row.status)
const canAssign = (row: UserRow) => ['1', '4'].includes(row.status)

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'detail' | 'assign'>('add')
const currentRow = ref<UserRow | null>(null)

type EditForm = {
  deptName: string
  username: string
  realName: string
  officePhone: string
  mobile: string
  userType: string
  status: StatusValue
  remark: string
}

const editFormRef = ref()
const editForm = ref<EditForm>({
  deptName: getDeptName(),
  username: '',
  realName: '',
  officePhone: '',
  mobile: '',
  userType: '3',
  status: '4',
  remark: '',
})

const editRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
}

const postOptions = ref<{ id: string; name: string }[]>([])
const selectedPosts = ref<string[]>([])

const operateTreeRef = ref()
const operateTree = ref<any[]>([])
const operateChecked = ref<string[]>([])

const isBaseReadonly = computed(() => dialogMode.value === 'detail' || dialogMode.value === 'assign')
const deptOptions = computed(() => {
  const dept = editForm.value.deptName || currentRow.value?.deptName || ''
  return dept ? [dept] : []
})

const loadPosts = async () => {
  try {
    const response = await getPositionList({ deptId: getDeptId() })
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    postOptions.value = (items ?? []).map((item: any) => ({ id: String(item.id), name: item.name ?? '-' }))
  } catch {
    postOptions.value = []
  }
}

const loadPermissions = async (id: string) => {
  try {
    const response = await getOperatorPermissions(id, { deptId: getDeptId() })
    const payload = response?.data ?? response
    const permissions = Array.isArray(payload) ? payload : payload?.operScopes ?? payload?.permissions ?? []
    const grouped = new Map<string, { id: string; label: string; children: any[] }>()
    const checked: string[] = []
    permissions.forEach((item: any) => {
      const systemCode = String(item.systemCode ?? 'SYS')
      const systemName = String(item.systemName ?? systemCode)
      if (!grouped.has(systemCode)) grouped.set(systemCode, { id: systemCode, label: systemName, children: [] })
      const scopeCode = String(item.scopeCode ?? '')
      if (!scopeCode) return
      grouped.get(systemCode)?.children.push({ id: scopeCode, label: item.scopeName ?? scopeCode })
      if (item.selected !== false) checked.push(scopeCode)
    })
    operateTree.value = Array.from(grouped.values())
    operateChecked.value = checked
    nextTick(() => operateTreeRef.value?.setCheckedKeys?.(checked))
  } catch {
    operateTree.value = []
    operateChecked.value = []
  }
}

const fillEditByRow = async (row: UserRow) => {
  try {
    const response = await getOperatorDetail(row.id, { deptId: getDeptId() })
    const payload = response?.data ?? response
    const data = payload?.data ?? payload
    editForm.value = {
      deptName: data?.deptName ?? row.deptName,
      username: data?.username ?? row.username,
      realName: data?.fullName ?? row.realName,
      officePhone: data?.officePhone ?? row.officePhone,
      mobile: data?.mobilePhone ?? row.mobile,
      userType: String(data?.userType ?? '3'),
      status: statusCodeMap[data?.status] ?? row.status,
      remark: data?.remark ?? row.remark,
    }
    selectedPosts.value = (data?.positions ?? [])
      .filter((item: any) => item.selected)
      .map((item: any) => String(item.positionId))
  } catch {
    editForm.value = {
      deptName: row.deptName,
      username: row.username,
      realName: row.realName,
      officePhone: row.officePhone,
      mobile: row.mobile,
      userType: '3',
      status: row.status,
      remark: row.remark,
    }
    selectedPosts.value = []
  }
}

const openAddDialog = () => {
  dialogMode.value = 'add'
  currentRow.value = null
  editForm.value = {
    deptName: getDeptName(),
    username: '',
    realName: '',
    officePhone: '',
    mobile: '',
    userType: '3',
    status: '4',
    remark: '',
  }
  selectedPosts.value = []
  operateTree.value = []
  operateChecked.value = []
  dialogVisible.value = true
}

const openEditDialog = async (row: UserRow) => {
  dialogMode.value = 'edit'
  currentRow.value = row
  await fillEditByRow(row)
  await loadPermissions(row.id)
  dialogVisible.value = true
}

const openDetailDialog = async (row: UserRow) => {
  dialogMode.value = 'detail'
  currentRow.value = row
  await fillEditByRow(row)
  await loadPermissions(row.id)
  dialogVisible.value = true
}

const openAssignDialog = async (row: UserRow) => {
  dialogMode.value = 'assign'
  currentRow.value = row
  await fillEditByRow(row)
  await loadPermissions(row.id)
  dialogVisible.value = true
}

const handleSaveEdit = async () => {
  if (!editFormRef.value || dialogMode.value === 'detail') return
  try {
    await editFormRef.value.validate()
    const deptId = getDeptId()
    if (!deptId) {
      ElMessage.error('缺少部门信息')
      return
    }
    const applicant = getApplicantInfo()
    if (dialogMode.value === 'assign') {
      if (!currentRow.value) return
      if (selectedPosts.value.length === 0) {
        ElMessage.error('请指定岗位')
        return
      }
      await assignOperatorPermissions(currentRow.value.id, {
        deptId,
        deptName: editForm.value.deptName,
        positionIds: selectedPosts.value.map((id) => Number(id)),
        ...applicant,
      })
    } else if (dialogMode.value === 'add') {
      await createOperator({
        deptId,
        deptName: editForm.value.deptName,
        username: editForm.value.username,
        fullName: editForm.value.realName,
        officePhone: editForm.value.officePhone,
        mobilePhone: editForm.value.mobile,
        remark: editForm.value.remark,
        ...applicant,
      })
    } else {
      if (!currentRow.value) return
      await modifyOperator(currentRow.value.id, {
        deptId,
        deptName: editForm.value.deptName,
        fullName: editForm.value.realName,
        officePhone: editForm.value.officePhone,
        mobilePhone: editForm.value.mobile,
        remark: editForm.value.remark,
        ...applicant,
      })
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    fetchList()
  } catch {
    ElMessage.error('操作失败')
  }
}

const submitAction = async (
  row: UserRow,
  action: (id: string, data: any) => Promise<any>,
  nextStatus: StatusValue,
  nextLabel: string,
) => {
  const deptId = getDeptId()
  if (!deptId) {
    ElMessage.error('缺少部门信息')
    return
  }
  try {
    await action(row.id, {
      deptId,
      deptName: row.deptName,
      ...getApplicantInfo(),
    })
    row.status = nextStatus
    row.statusLabel = nextLabel
    ElMessage.success('操作成功')
    fetchList()
  } catch {
    ElMessage.error('操作失败')
  }
}

const handleFreeze = (row: UserRow) => {
  if (!canFreeze(row)) return
  submitAction(row, freezeOperator as any, '2', '冻结')
}

const handleUnfreeze = (row: UserRow) => {
  if (!canUnfreeze(row)) return
  submitAction(row, unfreezeOperator as any, '1', '正常')
}

const handleResetPwd = (row: UserRow) => {
  if (!canResetPwd(row)) return
  submitAction(row, resetOperatorPassword as any, '4', '密码重置')
}

const handleLogout = (row: UserRow) => {
  if (!canLogout(row)) return
  submitAction(row, cancelOperator as any, '3', '注销')
}

const bindVisible = ref(false)
const bindQuery = ref({ dn: '' })
const bindTable = ref<CertOption[]>([])
const selectedCertIds = ref<number[]>([])

const openBindDialog = async (row: UserRow) => {
  currentRow.value = row
  bindVisible.value = true
  selectedCertIds.value = []
  try {
    const response = await getOperatorCertificates(row.id, { deptId: getDeptId() })
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    bindTable.value = (items ?? []).map((item: any) => ({
      certId: Number(item.certId ?? 0),
      certNo: item.certNo ?? '-',
      certName: item.certName ?? '-',
      selected: !!item.selected,
    }))
    selectedCertIds.value = bindTable.value.filter((item) => item.selected).map((item) => item.certId)
  } catch {
    bindTable.value = []
  }
}

const handleBindQuery = async () => {
  if (!currentRow.value) return
  try {
    const response = await getOperatorCertificates(currentRow.value.id, { deptId: getDeptId() })
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    const keyword = bindQuery.value.dn.trim()
    bindTable.value = (items ?? [])
      .map((item: any) => ({
        certId: Number(item.certId ?? 0),
        certNo: item.certNo ?? '-',
        certName: item.certName ?? '-',
        selected: !!item.selected,
      }))
      .filter((item: CertOption) => !keyword || item.certNo.includes(keyword) || item.certName.includes(keyword))
  } catch {
    bindTable.value = []
  }
}

const handleBindReset = () => {
  bindQuery.value.dn = ''
  handleBindQuery()
}

const handleBindSave = async () => {
  if (!currentRow.value) return
  const deptId = getDeptId()
  if (!deptId) return
  try {
    await bindOperatorCert(currentRow.value.id, {
      deptId,
      deptName: currentRow.value.deptName,
      certIds: selectedCertIds.value,
      ...getApplicantInfo(),
    })
    ElMessage.success('操作成功')
    bindVisible.value = false
  } catch {
    ElMessage.error('操作失败')
  }
}

const handleBindSelectionChange = (rows: CertOption[]) => {
  selectedCertIds.value = rows.map((item) => item.certId)
}

const handleRefreshAuth = async () => {
  if (!currentRow.value) return
  await loadPermissions(currentRow.value.id)
  ElMessage.success('权限已刷新')
}

const closeDialog = () => {
  dialogVisible.value = false
}

const dialogTitle = computed(() => {
  if (dialogMode.value === 'add') return '新增'
  if (dialogMode.value === 'edit') return '修改'
  if (dialogMode.value === 'assign') return '分配权限'
  return '详情'
})

onMounted(() => {
  loadPosts()
  fetchList()
})
</script>

<style scoped lang="scss">
.dept-page {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;
}

.page-card {
  margin-bottom: 16px;
  border-radius: 10px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  box-shadow: 0 6px 20px rgba(114, 93, 60, 0.08);
}

.query-card :deep(.el-card__body) {
  padding: 12px;
}

.query-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.query-form :deep(.el-input__wrapper),
.query-form :deep(.el-select__wrapper) {
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px var(--app-border);
  background: var(--app-surface);
}

.query-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 2px;
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 16px 0;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.query-card,
.table-card {
  width: var(--page-width);
  max-width: none;
  align-self: center;
}

.table-wrap {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  min-height: 0;
  max-height: 420px;
  max-width: 100%;
  padding: 0;
}

.table-wrap :deep(.el-table__body-wrapper) {
  overflow-y: auto;
}

.table-wrap :deep(.el-scrollbar__wrap) {
  overflow-x: auto;
}

:deep(.el-table__body-wrapper) {
  max-height: calc(100% - 56px);
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.table-card .el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  max-width: 100%;
}

:deep(.el-table th.el-table__cell) {
  background: var(--app-table-header);
  color: var(--app-text-strong);
  font-weight: 600;
}

:deep(.el-table__row:nth-child(odd)) {
  background: var(--app-row-odd);
}

:deep(.el-table__row:hover) {
  background: var(--app-row-hover);
}

:deep(.action-col .cell) {
  white-space: nowrap;
}

.dialog-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.panel {
  border: 1px solid var(--app-panel-border);
  border-radius: 8px;
  background: var(--app-surface);
  padding: 12px;
  min-height: 420px;
}

.panel-title {
  font-weight: 600;
  color: var(--app-text-title);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--app-divider);
}

.tree-disabled {
  pointer-events: none;
  opacity: 1;
}

.tree-disabled :deep(.el-tree-node__content),
.tree-disabled :deep(.el-tree-node__label),
.tree-disabled :deep(.el-checkbox__label) {
  color: var(--app-text-muted);
}

.tree-disabled :deep(.el-tree-node__content:hover) {
  background: transparent;
}

.tree-disabled :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
.tree-disabled :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: var(--app-disabled-bg);
  border-color: var(--app-disabled-bg);
}

.tree-disabled :deep(.el-checkbox__input .el-checkbox__inner) {
  background-color: var(--app-disabled-bg-light);
  border-color: var(--app-disabled-bg);
}

@media (max-width: 1200px) {
  .query-actions {
    flex-wrap: wrap;
  }
}

.table-wrap :deep(.el-table) {
  width: 100%;
  height: 100%;
}

.table-wrap :deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 2;
}

.table-wrap :deep(.el-table__header) {
  background: var(--app-table-header);
}
</style>
