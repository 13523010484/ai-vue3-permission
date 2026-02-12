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
            <el-form-item label="部门名称">
              <el-input v-model="queryForm.deptName" maxlength="50" clearable placeholder="模糊查询" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户名">
              <el-input v-model="queryForm.operCode" maxlength="30" clearable placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户姓名">
              <el-input v-model="queryForm.operName" maxlength="30" clearable placeholder="模糊查询" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16" v-show="showMore">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="用户类型">
              <el-select v-model="queryForm.userType" placeholder="全部" clearable>
                <el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
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
              <el-button v-if="hasMore" link type="primary" class="toggle-btn" @click="showMore = !showMore">
                {{ showMore ? '收起' : '展开' }}
                <el-icon class="toggle-icon">
                  <ArrowUp v-if="showMore" />
                  <ArrowDown v-else />
                </el-icon>
              </el-button>
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
<el-table-column prop="operCode" label="用户名" min-width="120" />
<el-table-column prop="operName" label="用户姓名" min-width="120" />
<el-table-column prop="telPhone" label="办公电话" min-width="140" />
<el-table-column prop="mobile" label="手机" min-width="140" />
<el-table-column prop="userType" label="用户类型" min-width="120" />
<el-table-column prop="operStatus" label="用户状态" min-width="120" />
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
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}/${pad(today.getMonth() + 1)}/${pad(today.getDate())}`

type OpTypeValue = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
type UserTypeValue = 'all' | '2' | '3' | '7'
type StatusValue = '2'

const queryForm = ref({
  startDate: todayStr,
  endDate: todayStr,
  arrNo: '',
  deptName: '',
  operCode: '',
  operName: '',
  userType: 'all' as UserTypeValue,
  opType: 'all' as OpTypeValue,
  status: '2' as StatusValue,
})

const hasMore = true
const showMore = ref(false)

const userTypeOptions = [
  { value: 'all', label: '全部' },
  { value: '2', label: '部门管理员' },
  { value: '3', label: '部门操作员' },
  { value: '7', label: '直联用户' },
]

const opTypeOptions = [
  { value: 'all', label: '全部' },
  { value: '1', label: '新增' },
  { value: '2', label: '修改' },
  { value: '3', label: '注销' },
  { value: '4', label: '冻结' },
  { value: '5', label: '解冻' },
  { value: '6', label: '重置密码' },
  { value: '7', label: '绑定证书' },
  { value: '8', label: '分配权限' },
]

const statusOptions = [{ value: '2', label: '复核通过' }]

const list = ref([
  {
    arrNo: `OP${todayStr.replaceAll('/', '')}0001`,
    arrDate: todayStr,
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    operCode: 'deptopToday',
    operName: '今日新增',
    telPhone: '021-55550010',
    mobile: '13800001000',
    userType: '3',
    userType: '部门操作员',
    userStatus: '4',
    operStatus: '密码重置',
    remark: '今日新增操作员',
    arrOperName: 'superadmin',
    applyTime: `${todayStr} 09:10:00`,
    reviewOperName: 'auditor01',
    reviewTime: `${todayStr} 10:00:00`,
    revokeTime: '-',
    status: '2',
    arrStatus: '复核通过',
  },
  {
    arrNo: 'OP202602090001',
    arrDate: '2026/02/09',
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    operCode: 'deptop01',
    operName: '王宁',
    telPhone: '021-55550001',
    mobile: '13800000001',
    userType: '3',
    userType: '部门操作员',
    userStatus: '4',
    operStatus: '密码重置',
    remark: '新增部门操作员',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 09:12:11',
    reviewOperName: 'auditor01',
    reviewTime: '2026/02/09 10:01:00',
    revokeTime: '-',
    status: '2',
    arrStatus: '复核通过',
  },
  {
    arrNo: 'OP202602090002',
    arrDate: '2026/02/09',
    opType: '2',
    operType: '修改',
    deptName: '清算管理部',
    operCode: 'deptop02',
    operName: '李娜',
    telPhone: '021-55550002',
    mobile: '13800000002',
    userType: '3',
    userType: '部门操作员',
    userStatus: '1',
    operStatus: '正常',
    remark: '更新联系方式',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 09:40:11',
    reviewOperName: 'auditor01',
    reviewTime: '2026/02/09 10:20:00',
    revokeTime: '-',
    status: '2',
    arrStatus: '复核通过',
  },
])

const fillUserOperatorReviewedList = () => {
  while (list.value.length < 10) {
    const idx = list.value.length + 1
    list.value.push({
      arrNo: `OP${todayStr.replaceAll('/', '')}${String(idx).padStart(3, '0')}`,
      arrDate: todayStr,
      opType: '1',
      operType: '新增',
      deptName: '清算管理部',
      operCode: `deptop${String(idx).padStart(2, '0')}`,
      operName: `操作员${idx}`,
      telPhone: '021-55550010',
      mobile: `13800001${String(idx).padStart(3, '0')}`,
      userType: '3',
      userType: '部门操作员',
      userStatus: '4',
      operStatus: '密码重置',
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

fillUserOperatorReviewedList()

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
      if (queryForm.value.deptName && !item.deptName.includes(queryForm.value.deptName)) return false
      if (queryForm.value.operCode && !item.operCode.includes(queryForm.value.operCode)) return false
      if (queryForm.value.operName && !item.operName.includes(queryForm.value.operName)) return false
      if (queryForm.value.userType !== 'all' && item.userType !== queryForm.value.userType) return false
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
    deptName: '',
    operCode: '',
    operName: '',
    userType: 'all',
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

.toggle-btn {
  padding-left: 4px;
  padding-right: 4px;
}

.toggle-icon {
  margin-left: 4px;
  font-size: 14px;
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
