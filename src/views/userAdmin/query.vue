<template>
  <div class="dept-page">
    <el-card class="page-card query-card" shadow="never">
      <el-form :model="queryForm" label-width="90px" class="query-form">
        <el-row :gutter="16" align="middle">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户名">
              <el-input v-model="queryForm.operCode" maxlength="30" clearable placeholder="模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户姓名">
              <el-input v-model="queryForm.operName" maxlength="30" clearable placeholder="模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户状态">
              <el-select v-model="queryForm.operStatus" placeholder="全部" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          <el-button type="success" @click="handleDownload" :disabled="filteredList.length === 0">下载</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table ref="tableRef" :data="filteredList" border stripe class="dept-table">
          <el-table-column type="index" label="序号" width="70" fixed="left" />



<el-table-column prop="deptName" label="部门名称" min-width="160">
<template #default="{ row }">
              <el-tooltip v-if="row.deptName.length > 10" :content="row.deptName">
                <span>{{ truncateText(row.deptName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operCode" label="用户名" min-width="120" />
<el-table-column prop="operName" label="用户姓名" min-width="120" />
<el-table-column prop="telPhone" label="办公电话" min-width="140" />
<el-table-column prop="mobile" label="手机" min-width="140" />
<el-table-column prop="operStatus" label="用户状态" min-width="120" />
<el-table-column prop="remark" label="备注" min-width="160">
<template #default="{ row }">
              <el-tooltip v-if="row.remark && row.remark.length > 10" :content="row.remark">
                <span>{{ truncateText(row.remark, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inputOperName" label="录入人" min-width="120" />
<el-table-column prop="inputTime" label="录入时间" min-width="170" />
<el-table-column prop="updateOperName" label="更新人" min-width="120" />
<el-table-column prop="updateTime" label="更新时间" min-width="170" />
<el-table-column prop="reviewOperName" label="复核人" min-width="120" />
<el-table-column prop="reviewTime" label="复核时间" min-width="170" />
          <el-table-column class-name="action-col" label="操作" min-width="360" fixed="right">
<template #default="{ row }">
              <el-button link type="primary" @click="openDetailDialog(row)">详情</el-button>
              <el-button link type="primary" @click="openEditDialog(row)" :disabled="!canEdit(row)">修改</el-button>
              <el-button link type="warning" @click="handleFreeze(row)" :disabled="!canFreeze(row)">冻结</el-button>
              <el-button link type="success" @click="handleUnfreeze(row)" :disabled="!canUnfreeze(row)">解冻</el-button>
              <el-button link type="danger" @click="handleLogout(row)" :disabled="!canLogout(row)">注销</el-button>
              <el-button link type="primary" @click="handleResetPwd(row)" :disabled="!canResetPwd(row)">重置密码</el-button>
              <el-button link type="primary" @click="openBindDialog(row)" :disabled="!canBind(row)">绑定证书</el-button>
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
              <el-select v-model="editForm.deptName" :disabled="dialogMode !== 'add'">
                <el-option v-for="dept in deptOptions" :key="dept" :label="dept" :value="dept" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="operCode">
              <el-input v-model="editForm.operCode" maxlength="30" :disabled="dialogMode !== 'add'" />
            </el-form-item>
            <el-form-item label="用户姓名" prop="operName">
              <el-input v-model="editForm.operName" maxlength="30" :disabled="dialogMode === 'detail'" />
            </el-form-item>
            <el-form-item label="办公电话">
              <el-input v-model="editForm.telPhone" maxlength="32" :disabled="dialogMode === 'detail'" />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="editForm.mobile" maxlength="32" :disabled="dialogMode === 'detail'" />
            </el-form-item>
            <el-form-item label="用户类型">
              <el-select v-model="editForm.userType" disabled>
                <el-option label="部门管理员" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select v-model="editForm.status" disabled>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="editForm.remark" type="textarea" :rows="4" maxlength="500" show-word-limit :disabled="dialogMode === 'detail'" />
            </el-form-item>
          </el-form>
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

        <section class="panel">
          <div class="panel-title">授权权限</div>
          <div :class="{ 'tree-disabled': dialogMode === 'detail' }">
            <el-tree
              ref="authTreeRef"
              :data="authTree"
              show-checkbox
              node-key="id"
              default-expand-all
              :props="{ label: 'label', children: 'children' }"
              :default-checked-keys="authChecked"
              :disabled="dialogMode === 'detail'"
            />
          </div>
        </section>
      </div>

      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="dialogMode === 'detail'" @click="handleSaveEdit">保存</el-button>
        <el-button v-if="dialogMode === 'detail'" type="primary" @click="handleRefreshAuth">刷新权限</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="bindVisible" title="绑定证书" width="760px">
      <el-form :model="bindQuery" label-width="80px">
        <el-form-item label="证书DN">
          <el-input v-model="bindQuery.certDN" placeholder="模糊查询，长度500字符" maxlength="500" clearable />
        </el-form-item>
        <div class="query-actions">
          <el-button type="primary" @click="handleBindQuery">查询</el-button>
          <el-button @click="handleBindReset">重置</el-button>
        </div>
      </el-form>
      <el-table ref="tableRef" :data="bindTable" border stripe>
          <el-table-column type="index" label="序号" width="70" fixed="left" />


<el-table-column type="selection" width="55" />
<el-table-column prop="certDN" label="证书DN" min-width="260" />
<el-table-column prop="certOrg" label="持证机构" min-width="180" />
<el-table-column prop="certAlgorithm" label="证书算法" min-width="100" />
<el-table-column prop="certStatus" label="证书状态" min-width="100" />
<el-table-column prop="validStartDate" label="有效期开始" min-width="120" />
<el-table-column prop="validEndDate" label="有效期结束" min-width="120" />
</el-table>
      <template #footer>
        <el-button @click="bindVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBindSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'

type StatusValue = '1' | '2' | '3' | '4' | ''

type UserRow = {
  id: string
  deptName: string
  operCode: string
  operName: string
  telPhone: string
  mobile: string
  status: StatusValue
  operStatus: string
  remark: string
  inputOperName: string
  inputTime: string
  updateOperName: string
  updateTime: string
  reviewOperName: string
  reviewTime: string
  isSelf?: boolean
}

const statusOptions = [
  { value: '1', label: '正常' },
  { value: '2', label: '冻结' },
  { value: '3', label: '注销' },
  { value: '4', label: '密码重置' },
]

const deptOptions = ['清算管理部', '技术保障部', '风控管理部']

const queryForm = ref({
  operCode: '',
  operName: '',
  operStatus: '' as StatusValue,
})

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}/${pad(today.getMonth() + 1)}/${pad(today.getDate())}`
const now = '2026/02/09 13:30:00'
const list = ref<UserRow[]>([
  {
    id: `U${todayStr.replaceAll('/', '')}01`,
    deptName: '清算管理部',
    operCode: 'deptadminToday',
    operName: '今日新增',
    telPhone: '021-55550010',
    mobile: '13800001000',
    operStatus: '密码重置',
    remark: '今日新增部门管理员',
    inputOperName: 'superadmin',
    inputTime: `${todayStr} 09:30:00`,
    updateOperName: 'superadmin',
    updateTime: `${todayStr} 09:30:00`,
    reviewOperName: 'auditor01',
    reviewTime: `${todayStr} 10:00:00`,
  },
  {
    id: 'U1001',
    deptName: '清算管理部',
    operCode: 'deptadmin01',
    operName: '王宁',
    telPhone: '021-55550001',
    mobile: '13800000001',
    operStatus: '正常',
    remark: '负责清算管理部日常维护',
    inputOperName: 'superadmin',
    inputTime: now,
    updateOperName: 'superadmin',
    updateTime: now,
    reviewOperName: 'auditor01',
    reviewTime: now,
  },
  {
    id: 'U1002',
    deptName: '技术保障部',
    operCode: 'deptadmin02',
    operName: '李娜',
    telPhone: '021-55550002',
    mobile: '13800000002',
    operStatus: '冻结',
    remark: '临时冻结',
    inputOperName: 'superadmin',
    inputTime: now,
    updateOperName: 'superadmin',
    updateTime: now,
    reviewOperName: 'auditor01',
    reviewTime: now,
  },
  {
    id: 'U1003',
    deptName: '风控管理部',
    operCode: 'deptadmin03',
    operName: '赵敏',
    telPhone: '021-55550003',
    mobile: '13800000003',
    operStatus: '密码重置',
    remark: '密码重置',
    inputOperName: 'superadmin',
    inputTime: now,
    updateOperName: 'superadmin',
    updateTime: now,
    reviewOperName: 'auditor01',
    reviewTime: now,
  },
])

const fillUserAdminList = () => {
  const statuses: StatusValue[] = ['1', '2', '3', '4']
  const statusLabelMap: Record<string, string> = {
    '1': '正常',
    '2': '冻结',
    '3': '注销',
    '4': '密码重置',
  }
  while (list.value.length < 10) {
    const idx = list.value.length + 1
    const status = statuses[idx % statuses.length]
    list.value.push({
      id: `U${todayStr.replaceAll('/', '')}${String(idx).padStart(2, '0')}`,
      deptName: '清算管理部',
      operCode: `deptadmin${idx}`,
      operName: `管理员${idx}`,
      telPhone: '021-55550010',
      mobile: `13800001${String(idx).padStart(3, '0')}`,
      status,
      operStatus: statusLabelMap[status],
      remark: '今日新增账号',
      inputOperName: 'superadmin',
      inputTime: `${todayStr} 11:${String(idx).padStart(2, '0')}:00`,
      updateOperName: 'superadmin',
      updateTime: `${todayStr} 11:${String(idx).padStart(2, '0')}:00`,
      reviewOperName: 'auditor01',
      reviewTime: `${todayStr} 12:${String(idx).padStart(2, '0')}:00`,
    })
  }
}

fillUserAdminList()

const filteredList = computed(() => {
  return list.value.filter((item) => {
    if (queryForm.value.operCode && !item.operCode.includes(queryForm.value.operCode)) return false
    if (queryForm.value.operName && !item.operName.includes(queryForm.value.operName)) return false
    if (queryForm.value.status && item.status !== queryForm.value.status) return false
    return true
  })
})

const handleQuery = () => {
  // mock
}

const handleReset = () => {
  queryForm.value = { operCode: '', operName: '', operStatus: '' }
}

const handleDownload = () => {
  ElMessage.success('下载成功')
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

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'detail'>('add')
const currentRow = ref<UserRow | null>(null)

const editFormRef = ref()
const editForm = ref({
  deptName: deptOptions[0],
  operCode: '',
  operName: '',
  telPhone: '',
  mobile: '',
  userType: '2',
  remark: '',
})

const editRules = {
  deptName: [{ required: true, message: '请选择部门名称', trigger: 'change' }],
  operCode: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  operName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
}

const authTree = ref([
  {
    id: 'A1',
    label: '清算管理',
    children: [
      { id: 'A1-1', label: '查询' },
      { id: 'A1-2', label: '新增' },
    ],
  },
])

const operateTree = ref([
  {
    id: 'O1',
    label: '系统管理',
    children: [
      { id: 'O1-1', label: '部门维护' },
      { id: 'O1-2', label: '用户维护' },
    ],
  },
])

const authChecked = ref<string[]>(['A1-1'])
const operateChecked = ref<string[]>(['O1-1'])

const openAddDialog = () => {
  dialogMode.value = 'add'
  editForm.value = {
    deptName: deptOptions[0],
    operCode: '',
    operName: '',
    telPhone: '',
    mobile: '',
    userType: '2',
    remark: '',
  }
  authChecked.value = []
  operateChecked.value = []
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.([])
    authTreeRef.value?.setCheckedKeys?.([])
  })
}

const openEditDialog = (row: UserRow) => {
  dialogMode.value = 'edit'
  currentRow.value = row
  editForm.value = {
    deptName: row.deptName,
    operCode: row.operCode,
    operName: row.operName,
    telPhone: row.telPhone,
    mobile: row.mobile,
    userType: '2',
    status: row.status,
    remark: row.remark,
  }
  authChecked.value = ['A1-1']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.(operateChecked.value)
    authTreeRef.value?.setCheckedKeys?.(authChecked.value)
  })
}

const openDetailDialog = (row: UserRow) => {
  dialogMode.value = 'detail'
  currentRow.value = row
  editForm.value = {
    deptName: row.deptName,
    operCode: row.operCode,
    operName: row.operName,
    telPhone: row.telPhone,
    mobile: row.mobile,
    userType: '2',
    status: row.status,
    remark: row.remark,
  }
  authChecked.value = ['A1-1']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.(operateChecked.value)
    authTreeRef.value?.setCheckedKeys?.(authChecked.value)
  })
}

const handleSaveEdit = async () => {
  if (!editFormRef.value || dialogMode.value === 'detail') return
  try {
    await editFormRef.value.validate()
    const authKeys = authTreeRef.value?.getCheckedKeys?.() || []
    const operateKeys = operateTreeRef.value?.getCheckedKeys?.() || []
    if (authKeys.length === 0) {
      ElMessage.error('请指定部门的可授权范围')
      return
    }
    if (operateKeys.length === 0) {
      ElMessage.error('请指定部门的可操作范围')
      return
    }

    const exists = list.value.some((item) => item.operCode === editForm.value.operCode)
    if (dialogMode.value === 'add' && exists) {
      ElMessage.error('用户名已经存在，请查证后重新录入')
      return
    }

    if (dialogMode.value === 'add') {
      list.value.unshift({
        id: `U${Math.floor(Math.random() * 9000 + 1000)}`,
        deptName: editForm.value.deptName,
        operCode: editForm.value.operCode,
        operName: editForm.value.operName,
        telPhone: editForm.value.telPhone,
        mobile: editForm.value.mobile,
        operStatus: '密码重置',
        remark: editForm.value.remark,
        inputOperName: 'superadmin',
        inputTime: now,
        updateOperName: 'superadmin',
        updateTime: now,
        reviewOperName: '',
        reviewTime: '',
      })
    } else if (currentRow.value) {
      currentRow.value.operName = editForm.value.operName
      currentRow.value.telPhone = editForm.value.telPhone
      currentRow.value.mobile = editForm.value.mobile
      currentRow.value.remark = editForm.value.remark
      currentRow.value.updateOperName = 'superadmin'
      currentRow.value.updateTime = now
    }

    ElMessage.success('操作成功')
    dialogVisible.value = false
  } catch {
    ElMessage.error('请检查必填项')
  }
}

const handleFreeze = (row: UserRow) => {
  if (!canFreeze(row)) {
    ElMessage.error('用户不能变更自己的状态')
    return
  }
  row.status = '2'
  row.operStatus = '冻结'
  ElMessage.success('操作成功')
}

const handleUnfreeze = (row: UserRow) => {
  if (!canUnfreeze(row)) {
    ElMessage.error('该用户状态已是非冻结状态不能进行解冻操作')
    return
  }
  row.status = '1'
  row.operStatus = '正常'
  ElMessage.success('操作成功')
}

const handleResetPwd = (row: UserRow) => {
  if (!canResetPwd(row)) {
    ElMessage.error('该用户状态已是非正常状态不能进行重置密码操作')
    return
  }
  row.status = '4'
  row.operStatus = '密码重置'
  ElMessage.success('操作成功')
}

const handleLogout = (row: UserRow) => {
  if (!canLogout(row)) {
    ElMessage.error('用户状态不允许注销')
    return
  }
  row.status = '3'
  row.operStatus = '注销'
  ElMessage.success('操作成功')
}

const handleBind = (row: UserRow) => {
  openBindDialog(row)
}

const bindVisible = ref(false)
const bindQuery = ref({ certDN: '' })
const bindTable = ref([
  {
    certDN: 'CN=cert-001,OU=SHCH,O=SHCH',
    certOrg: '000001/清算管理部',
    certAlgorithm: 'SM2',
    certStatus: '有效',
    validStartDate: '2025/01/01',
    validEndDate: '2027/01/01',
  },
])

const openBindDialog = (row: UserRow) => {
  currentRow.value = row
  bindVisible.value = true
}

const handleBindQuery = () => {}

const handleBindReset = () => {
  bindQuery.value.certDN = ''
}

const handleBindSave = () => {
  ElMessage.success('操作成功')
  bindVisible.value = false
}

const handleRefreshAuth = () => {
  ElMessage.success('权限已刷新')
}

const closeDialog = () => {
  dialogVisible.value = false
}
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
  border: 1px solid #e6e2db;
  background: #ffffff;
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
  box-shadow: inset 0 0 0 1px #e6e2db;
  background: #fff;
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
  background: #f5f1ea;
  color: #5b4a2f;
  font-weight: 600;
}

:deep(.el-table__row:nth-child(odd)) {
  background: #fbfbfd;
}

:deep(.el-table__row:hover) {
  background: #f6f2ea;
}

.dialog-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.panel {
  border: 1px solid #eee3d1;
  border-radius: 8px;
  background: #ffffff;
  padding: 12px;
  min-height: 420px;
}

.panel-title {
  font-weight: 600;
  color: #6b532b;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0e6d4;
}

.tree-disabled {
  pointer-events: none;
  opacity: 1;
}

.tree-disabled :deep(.el-tree-node__content),
.tree-disabled :deep(.el-tree-node__label) {
  color: #a8abb2;
}

.tree-disabled :deep(.el-tree-node__content:hover) {
  background: transparent;
}

.tree-disabled :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
.tree-disabled :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #dcdfe6;
  border-color: #dcdfe6;
}

.tree-disabled :deep(.el-checkbox__input .el-checkbox__inner) {
  background-color: #f5f7fa;
  border-color: #dcdfe6;
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
  background: #f5f1ea;
}

:deep(.action-col .cell) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  gap: 8px;
}

</style>
