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
              <el-select v-model="queryForm.status" placeholder="全部" clearable>
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
<el-table-column label="操作" min-width="200" fixed="right">
<template #default="{ row }">
              <el-button link type="primary" @click="openReviewDialog(row)">复核</el-button>
              <el-button link type="danger" @click="handleRevoke(row)">撤销</el-button>
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
                <el-option label="部门操作员" value="3" />
                <el-option label="直联用户" value="7" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select v-model="editForm.status" disabled>
                <el-option v-for="item in userStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button type="primary" :disabled="dialogMode === 'detail'" @click="handleReviewSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const today = new Date()
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const todayStr = `${today.getFullYear()}/${pad(today.getMonth() + 1)}/${pad(today.getDate())}`

type OpTypeValue = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
type UserTypeValue = 'all' | '2' | '3' | '7'
type StatusValue = 'all' | '1' | '3' | '4'

const queryForm = ref({
  startDate: todayStr,
  endDate: todayStr,
  arrNo: '',
  deptName: '',
  operCode: '',
  operName: '',
  userType: 'all' as UserTypeValue,
  opType: 'all' as OpTypeValue,
  status: 'all' as StatusValue,
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
  { value: '8', label: '解绑证书' },
]

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: '1', label: '待复核' },
  { value: '3', label: '复核拒绝' },
  { value: '4', label: '已撤销' },
]

const userStatusOptions = [
  { value: '1', label: '正常' },
  { value: '2', label: '冻结' },
  { value: '3', label: '注销' },
  { value: '4', label: '密码重置' },
]

const currentUser = 'superadmin'
const deptOptions = ['清算管理部', '技术保障部', '风控管理部']

const list = ref([
  {
    arrNo: `UA${todayStr.replaceAll('/', '')}0101`,
    arrDate: todayStr,
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    operCode: 'deptadminToday',
    operName: '今日新增',
    telPhone: '021-55550010',
    mobile: '13800001000',
    userType: '2',
    userType: '部门管理员',
    userStatus: '4',
    operStatus: '密码重置',
    remark: '今日新增部门管理员',
    arrOperName: 'superadmin',
    applyTime: `${todayStr} 09:05:00`,
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
  {
    arrNo: 'UA202602090101',
    arrDate: '2026/02/09',
    opType: '1',
    operType: '新增',
    deptName: '清算管理部',
    operCode: 'deptadmin01',
    operName: '王宁',
    telPhone: '021-55550001',
    mobile: '13800000001',
    userType: '2',
    userType: '部门管理员',
    userStatus: '4',
    operStatus: '密码重置',
    remark: '新增部门管理员',
    arrOperName: 'superadmin',
    applyTime: '2026/02/09 09:12:11',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
  {
    arrNo: 'UA202602090102',
    arrDate: '2026/02/09',
    opType: '2',
    operType: '修改',
    deptName: '技术保障部',
    operCode: 'deptadmin02',
    operName: '李娜',
    telPhone: '021-55550002',
    mobile: '13800000002',
    userType: '3',
    userType: '部门操作员',
    userStatus: '1',
    operStatus: '正常',
    remark: '更新联系方式',
    arrOperName: 'auditor01',
    applyTime: '2026/02/09 09:40:11',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
  {
    arrNo: 'UA202602100101',
    arrDate: '2026/02/10',
    opType: '3',
    operType: '注销',
    deptName: '风控管理部',
    operCode: 'direct01',
    operName: '赵敏',
    telPhone: '021-55550003',
    mobile: '13800000003',
    userType: '7',
    userType: '直联用户',
    userStatus: '3',
    operStatus: '注销',
    remark: '注销直联用户',
    arrOperName: 'superadmin',
    applyTime: '2026/02/10 09:00:00',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '2026/02/10 09:30:00',
    status: '4',
    arrStatus: '已撤销',
  },
  {
    arrNo: 'UA202602100102',
    arrDate: '2026/02/10',
    opType: '5',
    operType: '解冻',
    deptName: '清算管理部',
    operCode: 'deptadmin03',
    operName: '陈琳',
    telPhone: '021-55550004',
    mobile: '13800000004',
    userType: '2',
    userType: '部门管理员',
    userStatus: '2',
    operStatus: '冻结',
    remark: '解冻申请',
    arrOperName: 'auditor02',
    applyTime: '2026/02/10 11:20:00',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '3',
    arrStatus: '复核拒绝',
  },
  {
    arrNo: 'UA202602100103',
    arrDate: '2026/02/10',
    opType: '7',
    operType: '绑定证书',
    deptName: '清算管理部',
    operCode: 'deptadmin04',
    operName: '孙倩',
    telPhone: '021-55550005',
    mobile: '13800000005',
    userType: '2',
    userType: '部门管理员',
    userStatus: '1',
    operStatus: '正常',
    remark: '绑定证书申请',
    arrOperName: 'auditor03',
    applyTime: '2026/02/10 13:00:00',
    reviewOperName: '-',
    reviewTime: '-',
    revokeTime: '-',
    status: '1',
    arrStatus: '待复核',
  },
])

const userAdminStatusLabelMap: Record<string, string> = {
  '1': '待复核',
  '3': '复核拒绝',
  '4': '已撤销',
}

const fillUserAdminPendingList = () => {
  const statuses = ['1', '3', '4']
  while (list.value.length < 10) {
    const idx = list.value.length + 1
    const status = statuses[idx % statuses.length]
    list.value.push({
      arrNo: `UA${todayStr.replaceAll('/', '')}${String(idx).padStart(3, '0')}`,
      arrDate: todayStr,
      opType: '1',
      operType: '新增',
      deptName: '清算管理部',
      operCode: `deptadmin${idx}`,
      operName: `管理员${idx}`,
      telPhone: '021-55550010',
      mobile: `13800001${String(idx).padStart(3, '0')}`,
      userType: '2',
      userType: '部门管理员',
      userStatus: '4',
      operStatus: '密码重置',
      remark: status === '3' ? '复核拒绝示例' : status === '4' ? '已撤销示例' : '待复核示例',
      arrOperName: idx % 2 === 0 ? 'superadmin' : 'auditor01',
      applyTime: `${todayStr} 10:${String(idx).padStart(2, '0')}:00`,
      reviewOperName: '-',
      reviewTime: '-',
      revokeTime: status === '4' ? `${todayStr} 11:${String(idx).padStart(2, '0')}:00` : '-',
      status,
      arrStatus: userAdminStatusLabelMap[status],
    })
  }
}

fillUserAdminPendingList()

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
    operCode: '',
    operName: '',
    userType: 'all',
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

const editFormRef = ref()
const editForm = ref({
  deptName: deptOptions[0],
  operCode: '',
  operName: '',
  telPhone: '',
  mobile: '',
  userType: '2',
  status: '4',
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

const canRevoke = (row: any) => row.status === '1' && row.arrOperName === currentUser
const reviewableOpTypes = ['1', '2', '7']
const canReview = (row: any) =>
  row.status === '1' && row.arrOperName !== currentUser && reviewableOpTypes.includes(row.opType)

const openReviewDialog = (row: any) => {
  if (!canReview(row)) {
    if (row.status !== '1') {
      ElMessage.error('仅能对待复核状态数据进行复核操作，请重新选择记录进行复核操作。')
    } else if (row.arrOperName === currentUser) {
      ElMessage.error('不能复核自己提交的申请记录。')
    } else if (!reviewableOpTypes.includes(row.opType)) {
      ElMessage.error('该操作类型不支持录入复核。')
    }
    return
  }
  currentRow.value = row
  dialogMode.value = 'edit'
  editForm.value = {
    deptName: row.deptName,
    operCode: row.operCode,
    operName: row.operName,
    telPhone: row.telPhone,
    mobile: row.mobile,
    userType: row.userType,
    status: row.userStatus,
    remark: row.remark,
  }
  authChecked.value = ['A1-1']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
}

const handleReviewSave = async () => {
  if (!editFormRef.value) return
  try {
    await editFormRef.value.validate()
    if (!currentRow.value) return

    if (
      editForm.value.operCode !== currentRow.value.operCode ||
      editForm.value.operName !== currentRow.value.operName ||
      editForm.value.telPhone !== currentRow.value.telPhone ||
      editForm.value.mobile !== currentRow.value.mobile ||
      editForm.value.remark !== currentRow.value.remark
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
  } catch {
    ElMessage.error('请检查必填项')
  }
}

const handleRevoke = (row: any) => {
  if (!canRevoke(row)) {
    if (row.status !== '1') {
      ElMessage.error('申请记录状态不可进行撤销操作，请查证后重新操作。')
    } else {
      ElMessage.error('操作用户仅能撤销本人提交的申请。')
    }
    return
  }
  row.status = '4'
  row.arrStatus = '已撤销'
  row.revokeTime = todayStr + ' 11:00:00'
  ElMessage.success('操作成功')
}

const dialogTitle = computed(() => (dialogMode.value === 'detail' ? '详情' : '复核'))

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

