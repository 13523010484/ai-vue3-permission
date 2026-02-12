<template>
  <el-dialog :model-value="modelValue" title="岗位用户" width="760px" @close="emitClose">
    <el-table ref="tableRef" :data="users" border stripe>
          <el-table-column type="index" label="序号" width="70" fixed="left" />



<el-table-column prop="operCode" label="用户名" min-width="160" />
<el-table-column prop="operName" label="用户姓名" min-width="160" />
<el-table-column prop="userType" label="用户类型" min-width="160" />
<el-table-column prop="status" label="用户状态" min-width="160" />
</el-table>
    <template #footer>
      <el-button @click="emitClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  users: Array<{ operCode: string; operName: string; userType: string; status: string }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const emitClose = () => emit('update:modelValue', false)
</script>
