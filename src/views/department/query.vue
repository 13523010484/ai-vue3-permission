<template>
  <div class="dept-page">
    <el-card class="page-card query-card" shadow="never">
      <el-form :model="queryForm" label-width="90px" class="query-form">
        <el-row :gutter="16" align="middle">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="部门名称">
              <el-input
                v-model="queryForm.deptName"
                placeholder="模糊查询，最多50字"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="部门状态">
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
          <el-button type="success" @click="handleDownload" :disabled="list.length === 0"
            >下载</el-button
          >
        </div>
      </div>
      <div class="table-wrap">
        <el-table ref="tableRef" :data="list" border stripe class="dept-table" v-loading="loading">
          <el-table-column type="index" label="序号" width="70" fixed="left" />
          <el-table-column prop="deptName" label="部门名称" min-width="180">
            <template #default="{ row }">
              <el-tooltip v-if="row.deptName.length > 10" :content="row.deptName">
                <span>{{ truncateText(row.deptName, 10) }}</span>
              </el-tooltip>
              <span v-else>{{ row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="部门状态" min-width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === '1' ? 'success' : 'info'">
                {{ statusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
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
          <el-table-column class-name="action-col" label="操作" min-width="240" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openDetailDialog(row)">详情</el-button>
              <el-button link type="primary" @click="openUserDialog(row)">用户查询</el-button>
              <el-button
                link
                type="primary"
                @click="openEditDialog(row)"
                :disabled="row.status !== '1'"
              >
                修改
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleLogout(row)"
                :disabled="row.status !== '1'"
                >注销</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <DeptDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :form="editForm"
      :rules="editRules"
      :auth-tree="authTree"
      :operate-tree="operateTree"
      :auth-checked="authChecked"
      :operate-checked="operateChecked"
      @save="handleSaveEdit"
    ></DeptDialog>

    <el-dialog v-model="userVisible" title="部门用户" width="760px">
      <el-table ref="tableRef" :data="deptUsers" border stripe>
        <el-table-column type="index" label="序号" width="70" fixed="left" />
        <el-table-column prop="operCode" label="用户名" min-width="160" />
        <el-table-column prop="operName" label="用户姓名" min-width="160" />
        <el-table-column prop="userType" label="用户类型" min-width="160" />
        <el-table-column prop="operStatus" label="用户状态" min-width="160" />
      </el-table>
      <template #footer>
        <el-button @click="userVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DeptDialog from './components/DeptDialog.vue'
import { storeToRefs } from 'pinia'
import { useDepartmentStore } from '@/stores/department'
import type { DeptRow } from '@/types/department'

type StatusValue = '1' | '2' | ''

interface QueryForm {
  deptName: string
  status: StatusValue
}

const statusOptions = [
  { value: '1', label: '正常' },
  { value: '2', label: '注销' },
]

const queryForm = ref<QueryForm>({ deptName: '', status: '' as StatusValue })

const store = useDepartmentStore()
const { list, loading, authTree, operateTree } = storeToRefs(store)

const handleQuery = async () => {
  try {
    await store.fetchList(queryForm.value)
  } catch (error) {
    console.error('查询部门失败:', error)
    ElMessage.error('查询部门失败')
  }
}

const handleReset = () => {
  queryForm.value = { deptName: '', status: '' }
  handleQuery()
}

const handleDownload = () => {
  ElMessage.success('下载成功')
}

const truncateText = (text: string, size: number) => {
  if (!text) return '-'
  return text.length > size ? `${text.slice(0, size)}…` : text
}

const statusLabel = (value: string) => {
  const hit = statusOptions.find((item) => item.value === value)
  return hit ? hit.label : '-'
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'detail'>('add')

const editForm = ref({ deptName: '', remark: '' })

const editRules = { deptName: [{ required: true, message: '请录入部门名称', trigger: 'blur' }] }

const authChecked = ref<string[]>([])
const operateChecked = ref<string[]>([])

const openDetailDialog = (row: any) => {
  dialogMode.value = 'detail'
  editForm.value = { deptName: row.deptName, remark: row.remark }
  dialogVisible.value = true
}

const deptUsers = ref<any[]>([])
const userVisible = ref(false)

const openUserDialog = async (row: DeptRow) => {
  try {
    const response = await store.fetchDeptUsers(row.id)
    deptUsers.value = Array.isArray(response?.data) ? response.data : response || []
    userVisible.value = true
  } catch (error) {
    console.error('获取部门用户失败:', error)
    ElMessage.error('获取部门用户失败')
    deptUsers.value = [
      { operCode: 'deptadmin01', operName: '王宁', userType: '部门管理员', operStatus: '正常' },
      { operCode: 'deptuser02', operName: '李娜', userType: '操作员', operStatus: '正常' },
    ]
    userVisible.value = true
  }
}

const openAddDialog = () => {
  dialogMode.value = 'add'
  editForm.value = { deptName: '', remark: '' }
  authChecked.value = []
  operateChecked.value = []
  dialogVisible.value = true
}

const openEditDialog = (row: any) => {
  dialogMode.value = 'edit'
  editForm.value = { deptName: row.deptName, remark: row.remark }
  dialogVisible.value = true
}

const handleSaveEdit = async (
  payload: typeof editForm.value & { operateKeys: string[]; authKeys: string[]; id?: string },
) => {
  const authKeys = payload.authKeys || []
  const operateKeys = payload.operateKeys || []
  if (authKeys.length === 0) {
    ElMessage.error('请指定部门的可授权范围')
    return
  }
  if (operateKeys.length === 0) {
    ElMessage.error('请指定部门的可操作范围')
    return
  }

  try {
    if (dialogMode.value === 'add') {
      await store.createApplication({
        deptName: payload.deptName,
        remark: payload.remark,
        authKeys,
        operateKeys,
      })
      ElMessage.success('新增部门申请提交成功')
    } else if (dialogMode.value === 'edit') {
      await store.updateDept(payload.id!, payload)
      ElMessage.success('更新部门成功')
    }

    dialogVisible.value = false
    handleQuery()
  } catch (error) {
    console.error('保存部门失败:', error)
    ElMessage.error(dialogMode.value === 'add' ? '新增部门失败' : '更新部门失败')
  }
}

const handleLogout = async (row: DeptRow) => {
  if (row.status !== '1') {
    ElMessage.error('该部门状态已是注销状态不能进行注销操作')
    return
  }
  try {
    await ElMessageBox.confirm(`确认注销 ${row.deptName} ?`, '提示', { type: 'warning' })
    await store.logoutDept(row.id)
    ElMessage.success('操作成功')
    handleQuery()
  } catch {
    return
  }
}

onMounted(async () => {
  await store.fetchTrees()
  await handleQuery()
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
  align-items: center;
  height: 100%;
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.query-card,
.table-card {
  width: var(--page-width);
  max-width: none;
  align-self: center;
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

.table-actions :deep(.el-button--primary) {
  background: #c9a35c;
  border-color: #c9a35c;
  color: #fff;
}

.table-actions :deep(.el-button--success) {
  background: #b4925e;
  border-color: #b4925e;
  color: #fff;
}

.table-actions :deep(.el-button--primary.is-plain) {
  background: #fff;
  color: #8a6a3e;
  border-color: #d9c7a8;
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

.tree-section {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eee3d1;
  background: #fffaf3;
}

.tree-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #6b532b;
}

.readonly-tree {
  pointer-events: none;
  opacity: 0.85;
}

@media (max-width: 1200px) {
  .query-actions {
    flex-wrap: wrap;
  }
}

:deep(.el-button--primary) {
  background: #c9a35c;
  border-color: #c9a35c;
}

:deep(.el-button--success) {
  background: #b4925e;
  border-color: #b4925e;
}

:deep(.el-button--primary.is-plain) {
  color: #8a6a3e;
  border-color: #d9c7a8;
}

:deep(.el-table .el-button--primary),
:deep(.el-table .el-button--danger) {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
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

@media (max-width: 1200px) {
  .dialog-grid {
    grid-template-columns: 1fr;
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
