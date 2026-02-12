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
                value-format="yyyy/MM/dd"
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
                value-format="yyyy/MM/dd"
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
        <el-table ref="tableRef" :data="pagedList" border stripe class="dept-table" table-layout="auto">
          <el-table-column class-name="action-col" type="index" label="序号" width="70" fixed="left" />



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
          <el-table-column label="操作" width="1" fixed="right" class-name="action-col action-col--ops">
<template #default="{ row }">
              <el-button link size="small" type="primary" @click="openReviewDialog(row)">复核</el-button>
              <el-button link size="small" type="danger" @click="handleRevoke(row)">撤销</el-button>
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
              <el-select v-model="editForm.deptName" disabled>
                <el-option v-for="dept in deptOptions" :key="dept" :label="dept" :value="dept" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="operCode">
              <el-input v-model="editForm.operCode" maxlength="30" disabled />
            </el-form-item>
            <el-form-item label="用户姓名" prop="operName">
              <el-input v-model="editForm.operName" maxlength="30" />
            </el-form-item>
            <el-form-item label="办公电话">
              <el-input v-model="editForm.telPhone" maxlength="32" />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="editForm.mobile" maxlength="32" />
            </el-form-item>
            <el-form-item label="用户类型">
              <el-select v-model="editForm.userType" disabled>
                <el-option label="部门操作员" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select v-model="editForm.status" disabled>
                <el-option v-for="item in userStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="editForm.remark" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-form>
        </section>

        <section class="panel">
          <div class="panel-title">备选岗位</div>
          <el-checkbox-group v-model="selectedPosts">
            <el-checkbox v-for="post in postOptions" :key="post.id" :label="post.id">
              {{ post.name }}
            </el-checkbox>
          </el-checkbox-group>
        </section>

        <section class="panel">
          <div class="panel-title">操作权限</div>
          <el-tree
            ref="operateTreeRef"
            :data="operateTree"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="{ label: 'label', children: 'children' }"
            :default-checked-keys="operateChecked"
          />
        </section>
      </div>

      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleReviewSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import {
  exportOperatorApplications,
  getOperatorApplications,
  reviewOperatorApplication,
  revokeOperatorApplication,
} from '@/api/userOperator'
import { getPositionList } from '@/api/post'

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
  { value: '8', label: '分配权限' },
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
const deptOptions = ['清算管理部']
const list = ref<any[]>([])
const loading = ref(false)

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
  '4': '冻结',
  '5': '解冻',
  '6': '重置密码',
  '7': '绑定证书',
  '8': '分配权限',
  CREATE: '新增',
  UPDATE: '修改',
  MODIFY: '修改',
  CANCEL: '注销',
  FREEZE: '冻结',
  UNFREEZE: '解冻',
  RESET_PASSWORD: '重置密码',
  BIND_CERT: '绑定证书',
  ASSIGN_PERMISSIONS: '分配权限',
}

const opTypeCodeMap: Record<string, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  CREATE: '1',
  UPDATE: '2',
  MODIFY: '2',
  CANCEL: '3',
  FREEZE: '4',
  UNFREEZE: '5',
  RESET_PASSWORD: '6',
  BIND_CERT: '7',
  ASSIGN_PERMISSIONS: '8',
}

const formatDateTime = (value?: string) => {
  if (!value) return '-'
  return value.replace('T', ' ').replaceAll('-', '/')
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  return formatDateTime(value).split(' ')[0]
}

const normalizeApply = (item: any) => {
  const rawStatus = item.status ?? item.applyStatus ?? item.arrStatus ?? ''
  const rawOpType = item.operationType ?? item.opType ?? item.operType ?? ''
  const statusCode = statusCodeMap[rawStatus] ?? rawStatus ?? ''
  const opTypeCode = opTypeCodeMap[rawOpType] ?? rawOpType ?? ''
  return {
    id: item.id,
    arrNo: item.applyNo ?? item.arrNo ?? '-',
    arrDate: formatDate(item.applyTime ?? item.arrDate),
    opType: opTypeCode,
    operType: opTypeLabelMap[rawOpType] ?? rawOpType ?? '-',
    deptName: item.deptName ?? '-',
    operCode: item.username ?? item.operCode ?? '-',
    operName: item.fullName ?? item.operName ?? '-',
    telPhone: item.officePhone ?? item.telPhone ?? '-',
    mobile: item.mobilePhone ?? item.mobile ?? '-',
    userType: item.userType ?? '3',
    userTypeLabel: '部门操作员',
    userStatus: item.userStatus ?? item.status ?? '-',
    operStatus: item.operStatus ?? '-',
    remark: item.remark ?? '-',
    arrOperName: item.applicantName ?? item.arrOperName ?? '-',
    applyTime: formatDateTime(item.applyTime),
    reviewOperName: item.reviewOperName ?? '-',
    reviewTime: formatDateTime(item.reviewTime),
    revokeTime: formatDateTime(item.revokeTime),
    status: statusCode,
    arrStatus: statusLabelMap[rawStatus] ?? statusLabelMap[statusCode] ?? rawStatus ?? '-',
  }
}

const getDeptId = () => {
  const raw = localStorage.getItem('deptId')
  const val = raw ? Number(raw) : NaN
  return Number.isFinite(val) && val > 0 ? val : undefined
}

const getOperatorId = () => {
  try {
    const raw = localStorage.getItem('userInfo')
    const user = raw ? JSON.parse(raw) : null
    const id = Number(user?.id)
    return Number.isFinite(id) && id > 0 ? id : 1
  } catch {
    return 1
  }
}

const buildQueryParams = () => {
  const startDate = queryForm.value.startDate?.replaceAll('/', '-')
  const endDate = queryForm.value.endDate?.replaceAll('/', '-')
  const statusType =
    queryForm.value.status !== 'all' ? statusTypeMap[queryForm.value.status] : undefined
  const operationType =
    queryForm.value.opType !== 'all'
      ? ({
          '1': 'CREATE',
          '2': 'UPDATE',
          '3': 'CANCEL',
          '4': 'FREEZE',
          '5': 'UNFREEZE',
          '6': 'RESET_PASSWORD',
          '7': 'BIND_CERT',
          '8': 'ASSIGN_PERMISSIONS',
        } as Record<string, string>)[queryForm.value.opType]
      : undefined
  return {
    deptId: getDeptId(),
    startDate,
    endDate,
    applyNo: queryForm.value.arrNo || undefined,
    username: queryForm.value.operCode || undefined,
    operationType,
    statusType,
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const response = await getOperatorApplications(buildQueryParams())
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    list.value = (items ?? []).map(normalizeApply)
  } catch (error) {
    list.value = []
    ElMessage.error('获取操作员申请列表失败')
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
  fetchList()
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
    const response = await exportOperatorApplications(buildQueryParams())
    const payload = response?.data ?? response
    const blob = payload instanceof Blob ? payload : new Blob([payload])
    downloadBlob(blob, `操作员申请_${todayStr.replaceAll('/', '')}.xlsx`)
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

const dialogVisible = ref(false)
const currentRow = ref<any | null>(null)
const editFormRef = ref()
const editForm = ref({
  deptName: deptOptions[0],
  operCode: '',
  operName: '',
  telPhone: '',
  mobile: '',
  userType: '3',
  status: '4',
  remark: '',
})

const editRules = {
  deptName: [{ required: true, message: '请选择部门名称', trigger: 'change' }],
  operCode: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  operName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
}

const postOptions = ref<{ id: string; name: string }[]>([])

const selectedPosts = ref<string[]>([])

const operateTreeRef = ref()
const operateTree = ref<any[]>([])
const operateChecked = ref<string[]>([])

const reviewableOpTypes = ['1', '2', '7', '8']
const canRevoke = (row: any) => row.status === '1' && row.arrOperName === currentUser
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
  selectedPosts.value = ['P001']
  operateChecked.value = ['O1-1']
  dialogVisible.value = true
  nextTick(() => {
    operateTreeRef.value?.setCheckedKeys?.(operateChecked.value)
  })
}

const handleReviewSave = async () => {
  if (!editFormRef.value) return
  try {
    await editFormRef.value.validate()
    if (!currentRow.value) return

    if (
      editForm.value.operName !== currentRow.value.operName ||
      editForm.value.telPhone !== currentRow.value.telPhone ||
      editForm.value.mobile !== currentRow.value.mobile ||
      editForm.value.remark !== currentRow.value.remark
    ) {
      ElMessage.error('录入复核维护数据与申请数据不一致，复核失败。')
      dialogVisible.value = false
      return
    }

    reviewOperatorApplication(currentRow.value.id, {
      approved: true,
      reviewerId: getOperatorId(),
      reviewerName: currentUser,
      reviewRemark: '',
      username: editForm.value.operCode,
      fullName: editForm.value.operName,
      officePhone: editForm.value.telPhone,
      mobilePhone: editForm.value.mobile,
      remark: editForm.value.remark,
      positionIds: selectedPosts.value,
      certIds: [],
    })
      .then(() => {
        currentRow.value.status = '2'
        currentRow.value.arrStatus = '复核通过'
        currentRow.value.reviewOperName = currentUser
        currentRow.value.reviewTime = todayStr + ' 10:30:00'
        ElMessage.success('操作成功')
      })
      .catch(() => {
        ElMessage.error('复核失败')
      })
      .finally(() => {
        dialogVisible.value = false
      })
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
  revokeOperatorApplication(row.id, getOperatorId())
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

const dialogTitle = computed(() => '复核')
const closeDialog = () => {
  dialogVisible.value = false
}

const loadPosts = async () => {
  try {
    const response = await getPositionList({ deptId: getDeptId() })
    const payload = response?.data ?? response
    const items = Array.isArray(payload) ? payload : payload?.data
    postOptions.value =
      items?.map((item: any) => ({ id: String(item.id), name: item.name ?? '-' })) ?? []
  } catch {
    postOptions.value = []
  }
}

onMounted(() => {
  fetchList()
  loadPosts()
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
