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
        <el-table ref="tableRef" :data="filteredList" border stripe class="dept-table" table-layout="auto">
          <el-table-column class-name="action-col" type="index" label="序号" width="70" fixed="left" />



<el-table-column prop="deptName" label="部门名称" min-width="180">
<template #default="{ row }">
              <el-tooltip v-if="row.deptName.length > 10" :content="row.deptName">
                <span>{{ truncateText(row.deptName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="action-col" prop="postName" label="岗位名称" min-width="180">
<template #default="{ row }">
              <el-tooltip v-if="row.postName.length > 10" :content="row.postName">
                <span>{{ truncateText(row.postName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.postName }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="action-col" prop="postStatus" label="岗位状态" min-width="120" />
<el-table-column prop="remark" label="备注" min-width="180">
<template #default="{ row }">
              <el-tooltip v-if="row.remark && row.remark.length > 10" :content="row.remark">
                <span>{{ truncateText(row.remark, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="action-col" prop="createdOperName" label="录入人" min-width="120" />
<el-table-column prop="createdAt" label="录入时间" min-width="170" />
<el-table-column prop="updatedOperName" label="更新人" min-width="120" />
<el-table-column prop="updatedAt" label="更新时间" min-width="170" />
<el-table-column prop="reviewOperName" label="复核人" min-width="120" />
<el-table-column prop="reviewTime" label="复核时间" min-width="170" />
          <el-table-column label="操作" width="1" fixed="right" class-name="action-col action-col--ops">
<template #default="{ row }">
              <el-button link size="small" type="primary" @click="openDetailDialog(row)">详情</el-button>
              <el-button link size="small" type="primary" @click="openUserDialog(row)">用户查询</el-button>
              <el-button link size="small" type="primary" @click="openEditDialog(row)" :disabled="row.status !== '1'">
                修改
              </el-button>
              <el-button link size="small" type="danger" @click="handleLogout(row)" :disabled="row.status !== '1'">
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
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PostDialog from './components/PostDialog.vue'
import PostUserDialog from './components/PostUserDialog.vue'
import {
  cancelPosition,
  createPosition,
  exportPositions,
  getPositionList,
  getPositionUsers,
  modifyPosition,
} from '@/api/post'

type StatusValue = '1' | '2' | ''

type PostRow = {
  id: string
  deptName: string
  postName: string
  postType: '1'
  status: StatusValue
  postStatus: string
  remark: string
  createdOperName: string
  createdAt: string
  updatedOperName: string
  updatedAt: string
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

const list = ref<PostRow[]>([])
const loading = ref(false)
const now = new Date().toISOString().replace('T', ' ').slice(0, 19).replaceAll('-', '/')

const statusLabelMap: Record<string, string> = {
  NORMAL: '正常',
  CANCELED: '注销',
  '1': '正常',
  '2': '注销',
}

const statusCodeMap: Record<string, StatusValue> = {
  NORMAL: '1',
  CANCELED: '2',
  '1': '1',
  '2': '2',
}

const formatDateTime = (value?: string) => {
  if (!value) return '-'
  return value.replace('T', ' ').replaceAll('-', '/')
}

const normalizePosition = (item: any): PostRow => ({
  id: String(item.id ?? ''),
  deptName: item.deptName ?? '-',
  postName: item.name ?? item.postName ?? '-',
  postType: '1',
  status: statusCodeMap[item.status] ?? '1',
  postStatus: statusLabelMap[item.status] ?? item.status ?? '-',
  remark: item.remark ?? '-',
  createdOperName: item.createdOperName ?? '-',
  createdAt: formatDateTime(item.createdAt),
  updatedOperName: item.updatedOperName ?? '-',
  updatedAt: formatDateTime(item.updatedAt),
  reviewOperName: item.reviewOperName ?? '-',
  reviewTime: formatDateTime(item.reviewTime),
})

const getDeptId = () => {
  const raw = localStorage.getItem('deptId')
  const val = raw ? Number(raw) : NaN
  return Number.isFinite(val) && val > 0 ? val : undefined
}

const buildQueryParams = () => {
  const statusMap: Record<string, string> = { '1': 'NORMAL', '2': 'CANCELED' }
  return {
    deptId: getDeptId(),
    name: queryForm.value.postName || undefined,
    status: queryForm.value.status ? statusMap[queryForm.value.status] : undefined,
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const response = await getPositionList(buildQueryParams())
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    list.value = (items ?? []).map(normalizePosition)
  } catch (error) {
    list.value = []
    ElMessage.error('获取岗位列表失败')
  } finally {
    loading.value = false
  }
}

const filteredList = computed(() => list.value)

const handleQuery = () => {
  fetchList()
}

const handleReset = () => {
  queryForm.value = { postName: '', status: '' }
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
    const response = await exportPositions(buildQueryParams())
    const payload = response?.data ?? response
    const blob = payload instanceof Blob ? payload : new Blob([payload])
    downloadBlob(blob, `岗位查询_${new Date().getTime()}.xlsx`)
  } catch (error) {
    ElMessage.error('下载失败')
  }
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

const authTree = ref<any[]>([])
const operateTree = ref<any[]>([])
const authChecked = ref<string[]>([])
const operateChecked = ref<string[]>([])

const postUsers = ref<any[]>([])

type SavePayload = {
  deptName: string
  postName: string
  remark: string
  operateKeys?: string[]
  authKeys?: string[]
}

const userVisible = ref(false)
const openUserDialog = async (row: PostRow) => {
  userVisible.value = true
  try {
    const response = await getPositionUsers(row.id)
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    postUsers.value =
      items?.map((user: any) => ({
        operCode: user.username ?? '-',
        operName: user.fullName ?? '-',
        userType: user.userType ?? '-',
        status: statusLabelMap[user.status] ?? user.status ?? '-',
      })) ?? []
  } catch {
    postUsers.value = []
  }
}

const openAddDialog = () => {
  dialogMode.value = 'add'
  editForm.value = {
    deptName: '',
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

const handleSaveEdit = async (payload: SavePayload) => {
  const authKeys = payload.authKeys || []
  const operateKeys = payload.operateKeys || []
  if (authTree.value.length > 0 && authKeys.length === 0) {
    ElMessage.error('请指定岗位的可授权范围')
    return
  }
  if (operateTree.value.length > 0 && operateKeys.length === 0) {
    ElMessage.error('请指定岗位的可操作范围')
    return
  }

  const operScopes = operateKeys.map((key) => ({ scopeCode: key, scopeName: key }))
  const basePayload = {
    deptId: getDeptId(),
    deptName: payload.deptName,
    name: payload.postName,
    remark: payload.remark,
    operScopes,
  }

  try {
    if (dialogMode.value === 'add') {
      await createPosition(basePayload)
    } else {
      const target = list.value.find((item) => item.postName === editForm.value.postName)
      if (target) {
        await modifyPosition(target.id, basePayload)
      }
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    fetchList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleLogout = (row: PostRow) => {
  if (row.status !== '1') {
    ElMessage.error('该岗位状态已是注销状态不能进行注销操作')
    return
  }
  cancelPosition(row.id)
    .then(() => {
      row.status = '2'
      row.postStatus = '注销'
      row.updatedOperName = 'superadmin'
      row.updatedAt = now
      ElMessage.success('操作成功')
    })
    .catch(() => {
      ElMessage.error('操作失败')
    })
}

onMounted(() => {
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

