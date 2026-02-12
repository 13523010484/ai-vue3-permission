<template>
  <div class="dept-page">
    <el-card class="page-card query-card" shadow="never">
      <el-form :model="queryForm" label-width="90px" class="query-form">
        <el-row :gutter="16" align="middle">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="岗位名称">
              <el-input
                v-model="queryForm.postName"
                placeholder="模糊查询，最多50字"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="岗位状态">
              <el-select v-model="queryForm.status" placeholder="全部" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
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



<el-table-column prop="deptName" label="部门名称" min-width="180">
<template #default="{ row }">
              <el-tooltip v-if="row.deptName.length > 10" :content="row.deptName">
                <span>{{ truncateText(row.deptName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="postName" label="岗位名称" min-width="180">
<template #default="{ row }">
              <el-tooltip v-if="row.postName.length > 10" :content="row.postName">
                <span>{{ truncateText(row.postName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.postName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="postStatus" label="岗位状态" min-width="120" />
<el-table-column prop="remark" label="备注" min-width="180">
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
<el-table-column label="操作" min-width="320" fixed="right">
<template #default="{ row }">
              <el-button link type="primary" @click="openDetailDialog(row)">详情</el-button>
              <el-button link type="primary" @click="openUserDialog(row)">用户查询</el-button>
              <el-button link type="primary" @click="openEditDialog(row)" :disabled="row.status !== '1'">
                修改
              </el-button>
              <el-button link type="danger" @click="handleLogout(row)" :disabled="row.status !== '1'">
                注销
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <PostDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :form="editForm"
      :rules="editRules"
      :auth-tree="authTree"
      :operate-tree="operateTree"
      :auth-checked="authChecked"
      :operate-checked="operateChecked"
      @save="handleSaveEdit"
    />

    <PostUserDialog v-model="userVisible" :users="postUsers" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PostDialog from './components/PostDialog.vue'
import PostUserDialog from './components/PostUserDialog.vue'

type StatusValue = '1' | '2' | ''

type PostRow = {
  id: string
  deptName: string
  postName: string
  postType: '1'
  status: StatusValue
  postStatus: string
  remark: string
  inputOperName: string
  inputTime: string
  updateOperName: string
  updateTime: string
  reviewOperName: string
  reviewTime: string
}

const statusOptions = [
  { value: '1', label: '正常' },
  { value: '2', label: '注销' },
]

const queryForm = ref({
  postName: '',
  status: '' as StatusValue,
})

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}/${pad(today.getMonth() + 1)}/${pad(today.getDate())}`
const now = '2026/02/09 13:30:00'
const list = ref<PostRow[]>([
  {
    id: `P${todayStr.replaceAll('/', '')}01`,
    deptName: '清算管理部',
    postName: '今日新增岗',
    postType: '1',
    status: '1',
    postStatus: '正常',
    remark: '今日新增岗位',
    inputOperName: 'superadmin',
    inputTime: `${todayStr} 09:30:00`,
    updateOperName: 'superadmin',
    updateTime: `${todayStr} 09:30:00`,
    reviewOperName: 'auditor01',
    reviewTime: `${todayStr} 10:00:00`,
  },
  {
    id: 'P1001',
    deptName: '清算管理部',
    postName: '清算操作员',
    postType: '1',
    status: '1',
    postStatus: '正常',
    remark: '清算业务操作岗位',
    inputOperName: 'superadmin',
    inputTime: now,
    updateOperName: 'superadmin',
    updateTime: now,
    reviewOperName: 'auditor01',
    reviewTime: now,
  },
  {
    id: 'P1002',
    deptName: '技术保障部',
    postName: '系统维护岗',
    postType: '1',
    status: '1',
    postStatus: '正常',
    remark: '系统巡检维护',
    inputOperName: 'superadmin',
    inputTime: now,
    updateOperName: 'superadmin',
    updateTime: now,
    reviewOperName: 'auditor01',
    reviewTime: now,
  },
  {
    id: 'P1003',
    deptName: '风控管理部',
    postName: '风控审核岗',
    postType: '1',
    status: '2',
    postStatus: '注销',
    remark: '已注销岗位',
    inputOperName: 'superadmin',
    inputTime: now,
    updateOperName: 'superadmin',
    updateTime: now,
    reviewOperName: 'auditor01',
    reviewTime: now,
  },
])

const fillPostList = () => {
  const statuses: StatusValue[] = ['1', '2']
  while (list.value.length < 10) {
    const idx = list.value.length + 1
    const status = statuses[idx % statuses.length]
    list.value.push({
      id: `P${todayStr.replaceAll('/', '')}${String(idx).padStart(2, '0')}`,
      deptName: '清算管理部',
      postName: status === '1' ? `今日新增岗${idx}` : `注销岗位${idx}`,
      postType: '1',
      status,
      postStatus: status === '1' ? '正常' : '注销',
      remark: status === '1' ? '今日新增岗位' : '已注销岗位',
      inputOperName: 'superadmin',
      inputTime: `${todayStr} 11:${String(idx).padStart(2, '0')}:00`,
      updateOperName: 'superadmin',
      updateTime: `${todayStr} 11:${String(idx).padStart(2, '0')}:00`,
      reviewOperName: 'auditor01',
      reviewTime: `${todayStr} 12:${String(idx).padStart(2, '0')}:00`,
    })
  }
}

fillPostList()

const filteredList = computed(() => {
  return list.value.filter((item) => {
    if (queryForm.value.postName && !item.postName.includes(queryForm.value.postName)) return false
    if (queryForm.value.status && item.status !== queryForm.value.status) return false
    return true
  })
})

const handleQuery = () => {
  // mock
}

const handleReset = () => {
  queryForm.value = { postName: '', status: '' }
}

const handleDownload = () => {
  ElMessage.success('下载成功')
}

const truncateText = (text: string, size: number) => {
  if (!text) return '-'
  return text.length > size ? `${text.slice(0, size)}…` : text
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'detail'>('add')

const editForm = ref({
  deptName: '清算管理部',
  postName: '',
  postType: '1',
  remark: '',
})

const editRules = {
  postName: [{ required: true, message: '请录入岗位名称', trigger: 'blur' }],
}

const authTree = ref([
  {
    id: 'A1',
    label: '系统管理',
    children: [
      { id: 'A1-1', label: '部门维护' },
      { id: 'A1-2', label: '用户维护' },
    ],
  },
  {
    id: 'A2',
    label: '安全管理',
    children: [
      { id: 'A2-1', label: '权限刷新' },
      { id: 'A2-2', label: '审计日志' },
    ],
  },
])

const operateTree = ref([
  {
    id: 'O1',
    label: '清算管理',
    children: [
      { id: 'O1-1', label: '查询' },
      { id: 'O1-2', label: '新增' },
    ],
  },
  {
    id: 'O2',
    label: '运营服务',
    children: [
      { id: 'O2-1', label: '导出' },
      { id: 'O2-2', label: '注销' },
    ],
  },
])

const authChecked = ref<string[]>(['A1-1'])
const operateChecked = ref<string[]>(['O1-1'])

const postUsers = ref([
  { operCode: 'postuser01', operName: '王宁', userType: '部门管理员', status: '正常' },
  { operCode: 'postuser02', operName: '李娜', userType: '操作员', status: '正常' },
])

const userVisible = ref(false)
const openUserDialog = (row: PostRow) => {
  userVisible.value = true
}

const openAddDialog = () => {
  dialogMode.value = 'add'
  editForm.value = {
    deptName: '清算管理部',
    postName: '',
    postType: '1',
    remark: '',
  }
  authChecked.value = []
  operateChecked.value = []
  dialogVisible.value = true
}

const openEditDialog = (row: PostRow) => {
  dialogMode.value = 'edit'
  editForm.value = {
    deptName: row.deptName,
    postName: row.postName,
    postType: '1',
    remark: row.remark,
  }
  authChecked.value = ['A1-1']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
}

const openDetailDialog = (row: PostRow) => {
  dialogMode.value = 'detail'
  editForm.value = {
    deptName: row.deptName,
    postName: row.postName,
    postType: '1',
    remark: row.remark,
  }
  authChecked.value = ['A1-1']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
}

const handleSaveEdit = (payload: typeof editForm.value & { operateKeys: string[]; authKeys: string[] }) => {
  const authKeys = payload.authKeys || []
  const operateKeys = payload.operateKeys || []
  if (authKeys.length === 0) {
    ElMessage.error('请指定岗位的可授权范围')
    return
  }
  if (operateKeys.length === 0) {
    ElMessage.error('请指定岗位的可操作范围')
    return
  }

  const exists = list.value.some((item) => item.postName === payload.postName)
  if (dialogMode.value === 'add' && exists) {
    ElMessage.error('岗位名称已经存在，请查证后重新录入')
    return
  }
  if (dialogMode.value === 'edit') {
    const other = list.value.find((item) => item.postName === payload.postName)
    if (other && other.postName !== editForm.value.postName) {
      ElMessage.error('岗位名称已经存在，请查证后重新录入')
      return
    }
  }

  if (dialogMode.value === 'add') {
    list.value.unshift({
      id: `P${Math.floor(Math.random() * 9000 + 1000)}`,
      deptName: payload.deptName,
      postName: payload.postName,
      postType: '1',
      status: '1',
      postStatus: '正常',
      remark: payload.remark,
      inputOperName: 'superadmin',
      inputTime: now,
      updateOperName: 'superadmin',
      updateTime: now,
      reviewOperName: 'auditor01',
      reviewTime: now,
    })
  } else {
    const target = list.value.find((item) => item.postName === editForm.value.postName)
    if (target) {
      target.remark = payload.remark
      target.updateOperName = 'superadmin'
      target.updateTime = now
    }
  }

  ElMessage.success('操作成功')
  dialogVisible.value = false
}

const handleLogout = (row: PostRow) => {
  if (row.status !== '1') {
    ElMessage.error('该岗位状态已是注销状态不能进行注销操作')
    return
  }
  row.status = '2'
  row.postStatus = '注销'
  row.updateOperName = 'superadmin'
  row.updateTime = now
  ElMessage.success('操作成功')
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
