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
                value-format="YYYY/MM/DD"
                placeholder="选择开始日期"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="queryForm.endDate"
                type="date"
                value-format="YYYY/MM/DD"
                placeholder="选择结束日期"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="申请编号">
              <el-input v-model="queryForm.arrNo" maxlength="20" clearable placeholder="请输入申请编号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="岗位名称">
              <el-input v-model="queryForm.postName" maxlength="50" clearable placeholder="模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="操作类型">
              <el-select v-model="queryForm.opType" placeholder="全部" clearable>
                <el-option v-for="item in opTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="申请状态">
              <el-select v-model="queryForm.status" disabled>
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
          <el-button type="success" @click="handleDownload" :disabled="filteredList.length === 0">下载</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table ref="tableRef" :data="pagedList" border stripe class="dept-table">
          <el-table-column type="index" label="序号" width="70" fixed="left" />



<el-table-column prop="arrNo" label="申请编号" min-width="160" />
<el-table-column prop="arrDate" label="申请日期" min-width="120" />
<el-table-column prop="operType" label="操作类型" min-width="120" />
<el-table-column prop="deptName" label="部门名称" min-width="160" />
<el-table-column prop="postName" label="岗位名称" min-width="160" />
<el-table-column prop="postType" label="岗位类型" min-width="120" />
<el-table-column prop="postStatus" label="岗位状态" min-width="120" />
<el-table-column prop="remark" label="备注" min-width="200" />
<el-table-column prop="arrOperName" label="申请人" min-width="120" />
<el-table-column prop="applyTime" label="申请时间" min-width="170" />
<el-table-column prop="reviewOperName" label="复核人" min-width="120" />
<el-table-column prop="reviewTime" label="复核时间" min-width="170" />
<el-table-column prop="revokeTime" label="撤销时间" min-width="170" />
<el-table-column prop="arrStatus" label="申请状态" min-width="120" />
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}/${pad(today.getMonth() + 1)}/${pad(today.getDate())}`

type OpTypeValue = 'all' | '1' | '2' | '3'
type StatusValue = '2'

const queryForm = ref({
  startDate: todayStr,
  endDate: todayStr,
  arrNo: '',
  postName: '',
  opType: 'all' as OpTypeValue,
  status: '2' as StatusValue,
})

const opTypeOptions = [
  { value: 'all', label: '全部' },
  { value: '1', label: '新增' },
  { value: '2', label: '修改' },
  { value: '3', label: '注销' },
]

const statusOptions = [{ value: '2', label: '复核通过' }]

const list = ref([
  {
    arrNo: `PA${todayStr.replaceAll('/', '')}0001`,
    arrDate: todayStr,
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    postName: '清算操作岗',
    postType: '内部',
    postStatus: '正常',
    remark: '今日新增岗位',
    arrOperName: 'superadmin',
    applyTime: `${todayStr} 09:10:00`,
    reviewOperName: 'auditor01',
    reviewTime: `${todayStr} 10:20:00`,
    revokeTime: '-',
    status: '2',
    arrStatus: '复核通过',
  },
  {
    arrNo: 'PA202602090001',
    arrDate: '2026/02/09',
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    postName: '清算操作岗',
    postType: '内部',
    postStatus: '正常',
    remark: '新增岗位',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 09:12:11',
    reviewOperName: 'auditor01',
    reviewTime: '2026/02/09 10:01:00',
    revokeTime: '-',
    status: '2',
    arrStatus: '复核通过',
  },
  {
    arrNo: 'PA202602090002',
    arrDate: '2026/02/09',
    opType: '2',
    operType: '修改',
    deptName: '清算管理部',
    postName: '风控操作岗',
    postType: '内部',
    postStatus: '正常',
    remark: '调整备注',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 09:40:11',
    reviewOperName: 'auditor01',
    reviewTime: '2026/02/09 10:20:00',
    revokeTime: '-',
    status: '2',
    arrStatus: '复核通过',
  },
])

const fillPostReviewedList = () => {
  while (list.value.length < 10) {
    const idx = list.value.length + 1
    list.value.push({
      arrNo: `PA${todayStr.replaceAll('/', '')}${String(idx).padStart(3, '0')}`,
      arrDate: todayStr,
      opType: '1',
      operType: '新增',
      deptName: '清算管理部',
      postName: `今日岗位${idx}`,
      postType: '内部',
      postStatus: '正常',
      remark: '今日复核通过',
      arrOperName: 'superadmin',
      applyTime: `${todayStr} 09:${String(idx).padStart(2, '0')}:00`,
      reviewOperName: 'auditor01',
      reviewTime: `${todayStr} 10:${String(idx).padStart(2, '0')}:00`,
      revokeTime: '-',
      status: '2',
      arrStatus: '复核通过',
    })
  }
}

fillPostReviewedList()

const toDate = (value: string) => {
  if (!value) return null
  const parts = value.split('/')
  if (parts.length !== 3) return null
  const [y, m, d] = parts.map(Number)
  return new Date(y, m - 1, d)
}

const filteredList = computed(() => {
  const start = toDate(queryForm.value.startDate)
  const end = toDate(queryForm.value.endDate)

  return list.value
    .filter((item) => {
      if (queryForm.value.arrNo && !item.arrNo.includes(queryForm.value.arrNo)) return false
      if (queryForm.value.postName && !item.postName.includes(queryForm.value.postName)) return false
      if (queryForm.value.opType !== 'all' && item.opType !== queryForm.value.opType) return false
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
    postName: '',
    opType: 'all',
    status: '2',
  }
  currentPage.value = 1
}

const handleDownload = () => {
  ElMessage.success('下载成功')
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
.query-form :deep(.el-select__wrapper),
.query-form :deep(.el-date-editor) {
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px #e6e2db;
  background: #fff;
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

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px 8px;
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
