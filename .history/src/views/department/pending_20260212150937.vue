<template>
  <div class="dept-page">
    <el-card class="page-card query-card" shadow="never">
      <el-form :model="queryForm" label-width="90px" class="query-form">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="queryForm.startDate"
                type="date"
                placeholder="选择开始日期"
                value-format="yyyy/MM/dd"
                format="yyyy/MM/dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="queryForm.endDate"
                type="date"
                placeholder="选择结束日期"
                value-format="yyyy/MM/dd"
                format="yyyy/MM/dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="申请编号">
              <el-input v-model="queryForm.arrNo" maxlength="50" placeholder="申请编号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="操作类型">
              <el-select v-model="queryForm.opType" placeholder="全部" clearable>
                <el-option
                  v-for="item in opTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="申请状态">
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
          <el-button type="success" @click="handleDownload" :disabled="filteredList.length === 0"
            >下载</el-button
          >
        </div>
      </div>
      <div class="table-wrap">
        <el-table ref="tableRef" :data="pagedList" border stripe class="dept-table">
          <el-table-column class-name="action-col" type="index" label="序号" width="70" fixed="left" />

          <el-table-column prop="arrNo" label="申请编号" min-width="160" />
          <el-table-column prop="arrDate" label="申请日期" min-width="120" />
          <el-table-column prop="operType" label="操作类型" min-width="120" />
          <el-table-column prop="deptName" label="部门名称" min-width="160" />
          <el-table-column prop="deptStatus" label="部门状态" min-width="120" />
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column prop="arrOperName" label="申请人" min-width="120" />
          <el-table-column prop="applyTime" label="申请时间" min-width="170" />
          <el-table-column prop="reviewOperName" label="复核人" min-width="120" />
          <el-table-column prop="reviewTime" label="复核时间" min-width="170" />
          <el-table-column prop="revokeTime" label="撤销时间" min-width="170" />
          <el-table-column prop="arrStatus" label="申请状态" min-width="120" />
          <el-table-column label="操作" min-width="200" fixed="right">
            <template #default="{ row }">
              <el-button link size="small"
                type="primary"
                @click="openReviewDialog(row)"
                :disabled="!canReview(row)"
              >
                复核
              </el-button>
              <el-button link size="small" type="danger" @click="handleRevoke(row)" :disabled="!canRevoke(row)">
                撤销
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredList.length"
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10, 20, 50]"
        />
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
      @save="handleReviewSave"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import DeptDialog from './components/DeptDialog.vue'

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}/${pad(today.getMonth() + 1)}/${pad(today.getDate())}`

type OpTypeValue = 'all' | '1' | '2' | '3'
type StatusValue = 'all' | '1' | '3' | '4'

const queryForm = ref({
  startDate: todayStr,
  endDate: todayStr,
  arrNo: '',
  deptName: '',
  opType: 'all' as OpTypeValue,
  status: 'all' as StatusValue,
})

const opTypeOptions = [
  { value: 'all', label: '全部' },
  { value: '1', label: '新增' },
  { value: '2', label: '修改' },
  { value: '3', label: '注销' },
]

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: '1', label: '待复核' },
  { value: '3', label: '复核拒绝' },
  { value: '4', label: '已撤销' },
]

const currentUser = 'superadmin'

const list = ref([
  {
    arrNo: `AP${todayStr.replaceAll('/', '')}0101`,
    arrDate: todayStr,
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    deptStatus: '正常',
    remark: '今日新增申请',
    arrOperName: 'superadmin',
    applyTime: `${todayStr} 09:05:00`,
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
  {
    arrNo: 'AP202602090101',
    arrDate: '2026/02/09',
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    deptStatus: '正常',
    remark: '新增部门申请',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 09:12:11',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
  {
    arrNo: 'AP202602090103',
    arrDate: '2026/02/09',
    opType: '2',
    operType: '修改',
    deptName: '技术保障部',
    deptStatus: '正常',
    remark: '部门负责人调整',
    arrOperName: 'auditor01',
    applyTime: '2026/02/09 11:05:00',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
  {
    arrNo: 'AP202602090104',
    arrDate: '2026/02/09',
    opType: '1',
    operType: '新增',
    deptName: '运营支持部',
    deptStatus: '正常',
    remark: '新增运营支持部',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 12:20:00',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
  {
    arrNo: 'AP202602090102',
    arrDate: '2026/02/09',
    opType: '2',
    operType: '修改',
    deptName: '技术保障部',
    deptStatus: '正常',
    remark: '部门信息修改',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 09:40:11',
    reviewOperName: 'auditor01',
    reviewTime: '2026/02/09 10:12:00',
    revokeTime: '-',
    status: '3',
    arrStatus: '复核拒绝',
  },
  {
    arrNo: 'AP202602100101',
    arrDate: '2026/02/10',
    opType: '3',
    operType: '注销',
    deptName: '风控管理部',
    deptStatus: '注销',
    remark: '注销部门申请',
    arrOperName: 'superadmin',
    applyTime: '2026/02/10 09:00:00',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '2026/02/10 09:30:00',
    status: '4',
    arrStatus: '已撤销',
  },
  {
    arrNo: 'AP202602100102',
    arrDate: '2026/02/10',
    opType: '2',
    operType: '修改',
    deptName: '财务管理部',
    deptStatus: '正常',
    remark: '部门信息调整',
    arrOperName: 'auditor02',
    applyTime: '2026/02/10 10:10:00',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
])

const statusLabelMap: Record<string, string> = {
  '1': '待复核',
  '3': '复核拒绝',
  '4': '已撤销',
}

const fillPendingList = () => {
  const statuses = ['1', '3', '4']
  while (list.value.length < 10) {
    const idx = list.value.length + 1
    const status = statuses[idx % statuses.length] ?? '1'
    list.value.push({
      arrNo: `AP${todayStr.replaceAll('/', '')}${String(idx).padStart(3, '0')}`,
      arrDate: todayStr,
      opType: '1',
      operType: '新增',
      deptName: `今日部门${idx}`,
      deptStatus: status === '4' ? '注销' : '正常',
      remark: status === '3' ? '复核拒绝示例' : status === '4' ? '已撤销示例' : '待复核示例',
      arrOperName: idx % 2 === 0 ? 'superadmin' : 'auditor01',
      applyTime: `${todayStr} 10:${String(idx).padStart(2, '0')}:00`,
      reviewOperName: '-',
      reviewTime: '-',
      revokeTime: status === '4' ? `${todayStr} 11:${String(idx).padStart(2, '0')}:00` : '-',
      status,
      arrStatus: statusLabelMap[status],
    })
  }
}

fillPendingList()

const toDate = (value: string) => {
  if (!value) return null
  const parts = value.split('/')
  if (parts.length !== 3) return null
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null
  return new Date(y, m - 1, d)
}

const filteredList = computed(() => {
  const start = toDate(queryForm.value.startDate)
  const end = toDate(queryForm.value.endDate)

  return list.value
    .filter((item) => {
      if (queryForm.value.arrNo && !item.arrNo.includes(queryForm.value.arrNo)) return false
      if (queryForm.value.deptName && !item.deptName.includes(queryForm.value.deptName))
        return false
      if (queryForm.value.opType !== 'all' && item.opType !== queryForm.value.opType) return false
      if (queryForm.value.status !== 'all' && item.status !== queryForm.value.status) return false
      const arrDate = toDate(item.arrDate)
      if (start && arrDate && arrDate < start) return false
      if (end && arrDate && arrDate > end) return false
      return true
    })
    .sort((a, b) => {
      if (a.arrDate === b.arrDate) {
        return a.arrNo.localeCompare(b.arrNo)
      }
      return a.arrDate.localeCompare(b.arrDate)
    })
})

const currentPage = ref(1)
const pageSize = ref(10)

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const handleQuery = () => {
  currentPage.value = 1
}

const handleReset = () => {
  queryForm.value = {
    startDate: todayStr,
    endDate: todayStr,
    arrNo: '',
    deptName: '',
    opType: 'all',
    status: 'all',
  }
  currentPage.value = 1
}

const handleDownload = () => {
  ElMessage.success('下载成功')
}

const dialogVisible = ref(false)
const dialogMode = ref<'edit' | 'detail'>('edit')
const currentRow = ref<any | null>(null)

const editForm = ref({
  deptName: '',
  remark: '',
})

const editRules = {
  deptName: [{ required: true, message: '请录入部门名称', trigger: 'blur' }],
}

const authTree = ref([
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
      { id: 'A2-2', label: '注销' },
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
  {
    id: 'O2',
    label: '安全管理',
    children: [
      { id: 'O2-1', label: '权限刷新' },
      { id: 'O2-2', label: '审计日志' },
    ],
  },
])

const authChecked = ref<string[]>(['A1-1', 'A2-1'])
const operateChecked = ref<string[]>(['O1-1'])

const canRevoke = (row: any) => row.status === '1' && row.arrOperName === currentUser
const canReview = (row: any) =>
  row.status === '1' && row.arrOperName !== currentUser && row.opType !== '3'

const openReviewDialog = (row: any) => {
  if (!canReview(row)) return
  currentRow.value = row
  dialogMode.value = 'edit'
  editForm.value = { deptName: row.deptName, remark: row.remark }
  authChecked.value = ['A1-1', 'A2-1']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
}

const handleReviewSave = (
  payload: typeof editForm.value & { operateKeys: string[]; authKeys: string[] },
) => {
  if (!currentRow.value) return
  if (
    payload.deptName !== currentRow.value.deptName ||
    payload.remark !== currentRow.value.remark
  ) {
    ElMessage.error('录入复核维护数据与申请数据不一致，复核失败。')
    dialogVisible.value = false
    return
  }

  currentRow.value.status = '2'
  currentRow.value.arrStatus = '复核通过'
  currentRow.value.reviewOperName = currentUser
  currentRow.value.reviewTime = todayStr + ' 10:30:00'
  ElMessage.success('操作成功')
  dialogVisible.value = false
}

const handleRevoke = (row: any) => {
  if (!canRevoke(row)) {
    ElMessage.error('申请记录状态不可进行撤销操作，请查证后重新操作')
    return
  }
  if (row.arrOperName !== currentUser) {
    ElMessage.error('操作用户仅能撤销本人提交的申请')
    return
  }
  row.status = '4'
  row.arrStatus = '已撤销'
  row.revokeTime = todayStr + ' 11:00:00'
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
  width: auto;
  max-width: none;
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
.query-form :deep(.el-select__wrapper),
.query-form :deep(.el-date-editor) {
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px var(--app-border);
  background: var(--app-surface);
}

.query-form :deep(.el-date-editor) {
  width: 100%;
}

.query-form :deep(.el-input__wrapper),
.query-form :deep(.el-select__wrapper) {
  width: auto;
}

.query-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 2px;
}

.toggle-btn {
  padding-left: 4px;
  padding-right: 4px;
}

.toggle-icon {
  margin-left: 4px;
  font-size: 12px;
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
}

.table-wrap {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  min-height: 0;
  max-height: 420px;
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

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px 8px;
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
