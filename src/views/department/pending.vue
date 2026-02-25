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
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
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
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
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
        <el-table ref="tableRef" :data="pagedList" border stripe class="dept-table" table-layout="auto">
          <el-table-column
            class-name="action-col"
            type="index"
            label="序号"
            width="70"
            fixed="left"
          />

          <el-table-column prop="arrNo" label="申请编号" min-width="160" />
          <el-table-column prop="arrDate" label="申请日期" min-width="120" />
          <el-table-column prop="operType" label="操作类型" min-width="120" />
          <el-table-column prop="deptName" label="部门名称" min-width="160" />
          <el-table-column prop="deptStatus" label="部门状态" min-width="120" />
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column prop="arrOperName" label="申请人" min-width="120" />
          <el-table-column prop="arrDate" label="申请时间" min-width="170" />
          <el-table-column prop="reviewOperName" label="复核人" min-width="120" />
          <el-table-column prop="reviewTime" label="复核时间" min-width="170" />
          <el-table-column prop="revokeTime" label="撤销时间" min-width="170" />
          <el-table-column prop="arrStatus" label="申请状态" min-width="120" />
          <el-table-column label="操作" width="1" fixed="right" class-name="action-col action-col--ops">
            <template #default="{ row }">
              <el-button
                link
                size="small"
                type="primary"
                @click="openReviewDialog(row)"
                :disabled="!canReview(row)"
              >
                复核
              </el-button>
              <el-button
                link
                size="small"
                type="danger"
                @click="handleRevoke(row)"
                :disabled="!canRevoke(row)"
              >
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
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import DeptDialog from './components/DeptDialog.vue'
import { useDepartmentStore } from '@/stores/department'
import { downloadBlob } from '@/utils/download'

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

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

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('userInfo')
    const user = raw ? JSON.parse(raw) : null
    return {
      id: Number(user?.id),
      codes: [
        user?.operCode,
        user?.username,
        user?.userCode,
      ]
        .map((v: any) => String(v ?? '').trim())
        .filter(Boolean),
      names: [
        user?.name,
        user?.fullName,
        user?.realName,
        user?.operName,
        user?.username,
      ]
        .map((v: any) => String(v ?? '').trim())
        .filter(Boolean),
    }
  } catch {
    return { id: NaN, codes: [] as string[], names: [] as string[] }
  }
}

const getCurrentUserName = () => getCurrentUser().names[0] ?? ''
const getCurrentUserCode = () => getCurrentUser().codes[0] ?? ''

const list = ref<any[]>([])
const loading = ref(false)

const store = useDepartmentStore()
const { authTree, operateTree } = storeToRefs(store)

const statusLabelMap: Record<string, string> = {
  '1': '待复核',
  '2': '复核通过',
  '3': '复核拒绝',
  '4': '已撤销',
  PENDING: '待复核',
  APPROVED: '复核通过',
  REJECTED: '复核拒绝',
  REVOKED: '已撤销',
  CANCELED: '已撤销',
}

const statusCodeMap: Record<string, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  PENDING: '1',
  APPROVED: '2',
  REJECTED: '3',
  REVOKED: '4',
  CANCELED: '4',
}

const statusTypeMap: Record<string, string> = {
  '1': 'PENDING',
  '2': 'APPROVED',
  '3': 'REJECTED',
  '4': 'REVOKED',
}

const opTypeLabelMap: Record<string, string> = {
  '1': '新增',
  '2': '修改',
  '3': '注销',
  CREATE: '新增',
  UPDATE: '修改',
  MODIFY: '修改',
  CANCEL: '注销',
}

const opTypeCodeMap: Record<string, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  CREATE: '1',
  UPDATE: '2',
  MODIFY: '2',
  CANCEL: '3',
}

const deptStatusLabelMap: Record<string, string> = {
  NORMAL: '正常',
  CANCELED: '注销',
  '1': '正常',
  '2': '注销',
}

const formatDateTime = (value?: string) => {
  if (!value) return ''
  return value.replace('T', ' ').replaceAll('-', '/')
}

const formatDate = (value?: string) => {
  if (!value) return ''
  return formatDateTime(value).split(' ')[0]
}

const normalizeApply = (item: any) => {
  const rawStatus = item.status ?? item.applyStatus ?? item.arrStatus ?? ''
  const rawOpType = item.operationType ?? item.opType ?? item.operType ?? ''
  const statusCode = statusCodeMap[rawStatus] ?? rawStatus ?? ''
  const opTypeCode = opTypeCodeMap[rawOpType] ?? rawOpType ?? ''
  return {
    id: item.id,
    userId: item.userId ?? item.applicantId ?? item.arrOperId ?? item.operId ?? item.createdById,
    arrNo: item.applyNo ?? item.arrNo ?? '',
    arrDate: formatDate(item.applyTime ?? item.arrDate),
    opType: opTypeCode,
    operType: opTypeLabelMap[rawOpType] ?? rawOpType ?? '',
    deptName: item.deptName ?? item.name ?? '',
    deptStatus:
      deptStatusLabelMap[item.deptStatus as string] ??
      deptStatusLabelMap[item.status as string] ??
      item.deptStatus ??
      '-',
    remark: item.remark ?? item.deptRemark ?? '',
    arrOperId:
      item.applicantId ?? item.arrOperId ?? item.operId ?? item.userId ?? item.createdById,
    arrOperCode:
      item.applicantCode ??
      item.applicantUsername ??
      item.operCode ??
      item.username ??
      item.userCode ??
      item.createdBy ??
      '',
    arrOperName:
      item.applicantName ??
      item.arrOperName ??
      item.operName ??
      item.fullName ??
      item.username ??
      item.createdOperName ??
      '-',
    applyTime: formatDateTime(item.applyTime ?? item.applyTime),
    reviewOperName: item.reviewOperName ?? '',
    reviewTime: formatDateTime(item.reviewTime),
    revokeTime: formatDateTime(item.revokeTime),
    status: statusCode,
    arrStatus: statusLabelMap[rawStatus] ?? statusLabelMap[statusCode] ?? rawStatus ?? '',
  }
}

const isSelfApply = (row: any) => {
  const currentCode = String(getCurrentUserCode()).trim().toLowerCase()
  const applyCode = String(row.arrOperCode ?? '').trim().toLowerCase()
  return !!currentCode && !!applyCode && currentCode === applyCode
}

const buildQueryParams = () => {
  const startDate = queryForm.value.startDate?.replaceAll('/', '-')
  const endDate = queryForm.value.endDate?.replaceAll('/', '-')
  const statusType =
    queryForm.value.status !== 'all' ? statusTypeMap[queryForm.value.status] : undefined
  const operationType =
    queryForm.value.opType !== 'all'
      ? ({ '1': 'CREATE', '2': 'UPDATE', '3': 'CANCEL' } as Record<string, string>)[
          queryForm.value.opType
        ]
      : undefined
  return {
    startDate,
    endDate,
    applyNo: queryForm.value.arrNo || undefined,
    deptName: queryForm.value.deptName || undefined,
    operationType,
    statusType,
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const response = await store.fetchApplications(buildQueryParams())
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    list.value = (items ?? []).map(normalizeApply)
  } catch (error) {
    list.value = []
    ElMessage.error('获取部门申请列表失败')
  } finally {
    loading.value = false
  }
}

const toDate = (value: string) => {
  if (!value) return null
  const normalized = value.replaceAll('-', '/')
  const parts = normalized.split('/')
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
  fetchList()
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
  fetchList()
}

const handleDownload = async () => {
  try {
    const response = await store.exportApplications(buildQueryParams())
    const payload = response?.data ?? response
    downloadBlob(payload, `部门申请_${todayStr.replaceAll('/', '')}.xlsx`)
  } catch (error) {
    ElMessage.error('下载失败')
  }
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

const authChecked = ref<string[]>([])
const operateChecked = ref<string[]>([])

const isPending = (row: any) => {
  const status = String(row.status ?? '')
  if (['1', 'PENDING', 'WAIT_REVIEW', 'WAITING', 'APPLYING'].includes(status)) return true
  const label = String(row.arrStatus ?? '')
  return label.includes('待复核')
}
const canRevoke = (row: any) => isPending(row) && isSelfApply(row)
const canReview = (row: any) => {
  return isPending(row) && !isSelfApply(row)
}

const openReviewDialog = (row: any) => {
  if (!canReview(row)) {
    if (!isPending(row)) {
      ElMessage.error('仅能对待复核状态数据进行复核操作，请重新选择记录进行复核操作。')
    } else if (isSelfApply(row)) {
      ElMessage.error('不能复核自己提交的申请记录。')
    }
    return
  }
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
  store
    .reviewApplication(currentRow.value.id, {
      approved: true,
      reviewerName: getCurrentUserName(),
      reviewRemark: '',
      name: payload.deptName,
      deptRemark: payload.remark,
    })
    .then(() => {
      currentRow.value.status = '2'
      currentRow.value.arrStatus = '复核通过'
      currentRow.value.reviewOperName = getCurrentUserName()
      currentRow.value.reviewTime = todayStr + ' 10:30:00'
      ElMessage.success('操作成功')
    })
    .catch(() => {
      ElMessage.error('复核失败')
    })
    .finally(() => {
      dialogVisible.value = false
    })
}

const handleRevoke = (row: any) => {
  if (!canRevoke(row)) {
    ElMessage.error('申请记录状态不可进行撤销操作，请查证后重新操作')
    return
  }
  if (!isSelfApply(row)) {
    ElMessage.error('操作用户仅能撤销本人提交的申请')
    return
  }
  store
    .revokeApplication(row.id)
    .then(() => {
      row.status = '4'
      row.arrStatus = '已撤销'
      row.revokeTime = todayStr + ' 11:00:00'
      ElMessage.success('操作成功')
    })
    .catch(() => {
      ElMessage.error('撤销失败')
    })
}

onMounted(() => {
  fetchList()
  store.fetchTrees()
})
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

