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
          <el-table-column type="index" label="??" width="70" fixed="left" />

          <el-table-column prop="deptName" label="部门名称" min-width="160">
            <template #default="{ row }">
              <el-tooltip v-if="row.deptName.length > 10" :content="row.deptName">
                <span>{{ truncateText(row.deptName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" min-width="120" />
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
          <el-table-column prop="createdBy" label="录入人" min-width="120" />
          <el-table-column prop="createdAt" label="录入时间" min-width="170" />
          <el-table-column prop="updatedBy" label="更新人" min-width="120" />
          <el-table-column prop="updatedAt" label="更新时间" min-width="170" />
          <el-table-column prop="reviewedBy" label="复核人" min-width="120" />
          <el-table-column prop="reviewedAt" label="复核时间" min-width="170" />
          <el-table-column label="操作" fixed="right" class-name="action-col">
            <template #default="{ row }">
              <el-button link type="primary" @click="openDetailDialog(row)">详情</el-button>
              <el-button link type="primary" @click="openEditDialog(row)" :disabled="!canEdit(row)"
                >修改</el-button
              >
              <el-button link type="warning" @click="handleFreeze(row)" :disabled="!canFreeze(row)"
                >冻结</el-button
              >
              <el-button
                link
                type="success"
                @click="handleUnfreeze(row)"
                :disabled="!canUnfreeze(row)"
                >解冻</el-button
              >
              <el-button link type="danger" @click="handleLogout(row)" :disabled="!canLogout(row)"
                >注销</el-button
              >
              <el-button
                link
                type="primary"
                @click="openAssignDialog(row)"
                :disabled="!canAssign(row)"
              >
                分配权限
              </el-button>
              <el-button
                link
                type="primary"
                @click="handleResetPwd(row)"
                :disabled="!canResetPwd(row)"
              >
                重置密码
              </el-button>
              <el-button link type="primary" @click="openBindDialog(row)" :disabled="!canBind(row)">
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
      <el-table ref="tableRef" :data="bindTable" border stripe>
        <el-table-column type="index" label="??" width="70" fixed="left" />

        <el-table-column type="selection" width="55" />
        <el-table-column prop="dn" label="证书DN" min-width="260" />
        <el-table-column prop="owner" label="持证机构" min-width="180" />
        <el-table-column prop="algo" label="证书算法" min-width="100" />
        <el-table-column prop="status" label="证书状态" min-width="100" />
        <el-table-column prop="validFrom" label="有效期开始" min-width="120" />
        <el-table-column prop="validTo" label="有效期结束" min-width="120" />
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

const statusOptions = [
  { value: '1', label: '正常' },
  { value: '2', label: '冻结' },
  { value: '3', label: '注销' },
  { value: '4', label: '密码重置' },
]

const deptOptions = ['清算管理部']

const queryForm = ref({
  username: '',
  realName: '',
  status: '' as StatusValue,
})

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}/${pad(today.getMonth() + 1)}/${pad(today.getDate())}`
const now = '2026/02/09 13:30:00'

const list = ref<UserRow[]>([
  {
    id: `U${todayStr.replaceAll('/', '')}01`,
    deptName: '清算管理部',
    username: 'deptopToday',
    realName: '今日新增',
    officePhone: '021-55550010',
    mobile: '13800001000',
    status: '4',
    statusLabel: '密码重置',
    remark: '今日新增操作员',
    createdBy: 'superadmin',
    createdAt: `${todayStr} 09:30:00`,
    updatedBy: 'superadmin',
    updatedAt: `${todayStr} 09:30:00`,
    reviewedBy: 'auditor01',
    reviewedAt: `${todayStr} 10:00:00`,
  },
  {
    id: 'U2001',
    deptName: '清算管理部',
    username: 'deptop01',
    realName: '王宁',
    officePhone: '021-55550001',
    mobile: '13800000001',
    status: '1',
    statusLabel: '正常',
    remark: '操作员',
    createdBy: 'superadmin',
    createdAt: now,
    updatedBy: 'superadmin',
    updatedAt: now,
    reviewedBy: 'auditor01',
    reviewedAt: now,
  },
  {
    id: 'U2002',
    deptName: '清算管理部',
    username: 'deptop02',
    realName: '李娜',
    officePhone: '021-55550002',
    mobile: '13800000002',
    status: '2',
    statusLabel: '冻结',
    remark: '临时冻结',
    createdBy: 'superadmin',
    createdAt: now,
    updatedBy: 'superadmin',
    updatedAt: now,
    reviewedBy: 'auditor01',
    reviewedAt: now,
  },
  {
    id: 'U2003',
    deptName: '清算管理部',
    username: 'deptop03',
    realName: '赵敏',
    officePhone: '021-55550003',
    mobile: '13800000003',
    status: '4',
    statusLabel: '密码重置',
    remark: '密码重置',
    createdBy: 'superadmin',
    createdAt: now,
    updatedBy: 'superadmin',
    updatedAt: now,
    reviewedBy: 'auditor01',
    reviewedAt: now,
  },
])

const fillUserOperatorList = () => {
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
      username: `deptop${String(idx).padStart(2, '0')}`,
      realName: `操作员${idx}`,
      officePhone: '021-55550010',
      mobile: `13800001${String(idx).padStart(3, '0')}`,
      status,
      statusLabel: statusLabelMap[status],
      remark: '今日新增操作员',
      createdBy: 'superadmin',
      createdAt: `${todayStr} 11:${String(idx).padStart(2, '0')}:00`,
      updatedBy: 'superadmin',
      updatedAt: `${todayStr} 11:${String(idx).padStart(2, '0')}:00`,
      reviewedBy: 'auditor01',
      reviewedAt: `${todayStr} 12:${String(idx).padStart(2, '0')}:00`,
    })
  }
}

fillUserOperatorList()

const filteredList = computed(() => {
  return list.value.filter((item) => {
    if (queryForm.value.username && !item.username.includes(queryForm.value.username)) return false
    if (queryForm.value.realName && !item.realName.includes(queryForm.value.realName)) return false
    if (queryForm.value.status && item.status !== queryForm.value.status) return false
    return true
  })
})

const handleQuery = () => {}

const handleReset = () => {
  queryForm.value = { username: '', realName: '', status: '' }
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
const canAssign = (row: UserRow) => ['1', '4'].includes(row.status)

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'detail' | 'assign'>('add')
const currentRow = ref<UserRow | null>(null)

const editFormRef = ref()
const editForm = ref({
  deptName: deptOptions[0],
  username: '',
  realName: '',
  officePhone: '',
  mobile: '',
  userType: '3',
  status: '4',
  remark: '',
})

const editRules = {
  deptName: [{ required: true, message: '请选择部门名称', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
}

const postOptions = [
  { id: 'P001', name: '清算操作岗' },
  { id: 'P002', name: '风控操作岗' },
  { id: 'P003', name: '监控操作岗' },
]

const selectedPosts = ref<string[]>([])

const operateTreeRef = ref()
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

const operateChecked = ref<string[]>(['O1-1'])

const isBaseReadonly = computed(
  () => dialogMode.value === 'detail' || dialogMode.value === 'assign',
)

const openAddDialog = () => {
  dialogMode.value = 'add'
  editForm.value = {
    deptName: deptOptions[0],
    username: '',
    realName: '',
    officePhone: '',
    mobile: '',
    userType: '3',
    status: '4',
    remark: '',
  }
  selectedPosts.value = []
  operateChecked.value = []
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.([])
  })
}

const openEditDialog = (row: UserRow) => {
  dialogMode.value = 'edit'
  currentRow.value = row
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
  selectedPosts.value = ['P001']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.(operateChecked.value)
  })
}

const openDetailDialog = (row: UserRow) => {
  dialogMode.value = 'detail'
  currentRow.value = row
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
  selectedPosts.value = ['P001']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.(operateChecked.value)
  })
}

const openAssignDialog = (row: UserRow) => {
  dialogMode.value = 'assign'
  currentRow.value = row
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
  selectedPosts.value = ['P001']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.(operateChecked.value)
  })
}

const handleSaveEdit = async () => {
  if (!editFormRef.value || dialogMode.value === 'detail') return
  try {
    await editFormRef.value.validate()
    const operateKeys = operateTreeRef.value?.getCheckedKeys?.() || []
    if (selectedPosts.value.length === 0) {
      ElMessage.error('请指定岗位')
      return
    }
    if (operateKeys.length === 0) {
      ElMessage.error('请指定岗位的可操作范围')
      return
    }

    const exists = list.value.some((item) => item.username === editForm.value.username)
    if (dialogMode.value === 'add' && exists) {
      ElMessage.error('用户名已经存在，请查证后重新录入')
      return
    }

    if (dialogMode.value === 'add') {
      list.value.unshift({
        id: `U${Math.floor(Math.random() * 9000 + 1000)}`,
        deptName: editForm.value.deptName,
        username: editForm.value.username,
        realName: editForm.value.realName,
        officePhone: editForm.value.officePhone,
        mobile: editForm.value.mobile,
        status: '4',
        statusLabel: '密码重置',
        remark: editForm.value.remark,
        createdBy: 'superadmin',
        createdAt: now,
        updatedBy: 'superadmin',
        updatedAt: now,
        reviewedBy: '',
        reviewedAt: '',
      })
    } else if (currentRow.value) {
      currentRow.value.realName = editForm.value.realName
      currentRow.value.officePhone = editForm.value.officePhone
      currentRow.value.mobile = editForm.value.mobile
      currentRow.value.remark = editForm.value.remark
      currentRow.value.updatedBy = 'superadmin'
      currentRow.value.updatedAt = now
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
  row.statusLabel = '冻结'
  ElMessage.success('操作成功')
}

const handleUnfreeze = (row: UserRow) => {
  if (!canUnfreeze(row)) {
    ElMessage.error('该用户状态已是非冻结状态不能进行解冻操作')
    return
  }
  row.status = '1'
  row.statusLabel = '正常'
  ElMessage.success('操作成功')
}

const handleResetPwd = (row: UserRow) => {
  if (!canResetPwd(row)) {
    ElMessage.error('该用户状态已是非正常状态不能进行重置密码操作')
    return
  }
  row.status = '4'
  row.statusLabel = '密码重置'
  ElMessage.success('操作成功')
}

const handleLogout = (row: UserRow) => {
  if (!canLogout(row)) {
    ElMessage.error('用户状态不允许注销')
    return
  }
  row.status = '3'
  row.statusLabel = '注销'
  ElMessage.success('操作成功')
}

const bindVisible = ref(false)
const bindQuery = ref({ dn: '' })
const bindTable = ref([
  {
    dn: 'CN=cert-001,OU=SHCH,O=SHCH',
    owner: '000001/清算管理部',
    algo: 'SM2',
    status: '有效',
    validFrom: '2025/01/01',
    validTo: '2027/01/01',
  },
])

const openBindDialog = (row: UserRow) => {
  currentRow.value = row
  bindVisible.value = true
}

const handleBindQuery = () => {}

const handleBindReset = () => {
  bindQuery.value.dn = ''
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

const dialogTitle = computed(() => {
  if (dialogMode.value === 'add') return '新增'
  if (dialogMode.value === 'edit') return '修改'
  if (dialogMode.value === 'assign') return '分配权限'
  return '详情'
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

:deep(.action-col .cell) {
  white-space: nowrap;
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
.tree-disabled :deep(.el-tree-node__label),
.tree-disabled :deep(.el-checkbox__label) {
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
</style>
