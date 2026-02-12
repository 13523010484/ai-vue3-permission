<template>
  <el-dialog :model-value="modelValue" :title="title" width="980px" @close="emitClose">
    <div class="dialog-grid">
      <section class="panel">
        <div class="panel-title">基本信息</div>
        <el-form
          :model="localForm"
          :rules="isDetail ? undefined : rules"
          ref="formRef"
          label-width="90px"
        >
          <el-form-item label="部门名称" prop="deptName">
            <el-input
              v-model="localForm.deptName"
              maxlength="400"
              placeholder="请输入部门名称"
              :disabled="isDetail"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="localForm.remark"
              type="textarea"
              :rows="6"
              maxlength="500"
              show-word-limit
              :disabled="isDetail"
            />
          </el-form-item>
        </el-form>
      </section>

      <section class="panel">
        <div class="panel-title">操作权限</div>
        <div :class="{ 'tree-disabled': isDetail }">
          <el-tree
            ref="operateTreeRef"
            :data="operateTree"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="{ label: 'label', children: 'children' }"
            :default-checked-keys="operateChecked"
            :disabled="isDetail"
          />
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">授权权限</div>
        <div :class="{ 'tree-disabled': isDetail }">
          <el-tree
            ref="authTreeRef"
            :data="authTree"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="{ label: 'label', children: 'children' }"
            :default-checked-keys="authChecked"
            :disabled="isDetail"
          />
        </div>
      </section>
    </div>

    <template #footer>
      <el-button @click="emitClose">取消</el-button>
      <el-button type="primary" :disabled="isDetail" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  mode: 'add' | 'edit' | 'detail'
  form: {
    deptName: string
    remark: string
  }
  rules: Record<string, any>
  authTree: any[]
  operateTree: any[]
  authChecked: string[]
  operateChecked: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: typeof props.form & { operateKeys: string[]; authKeys: string[] }): void
}>()

const isDetail = computed(() => props.mode === 'detail')
const title = computed(() =>
  props.mode === 'add' ? '新增' : props.mode === 'edit' ? '修改' : '详情',
)

const formRef = ref()
const operateTreeRef = ref()
const authTreeRef = ref()
const localForm = ref({ ...props.form })

watch(
  () => props.form,
  (val) => {
    localForm.value = { ...val }
  },
  { deep: true, immediate: true },
)

watch(
  () => [props.operateChecked, props.authChecked, props.mode],
  async () => {
    await nextTick()
    operateTreeRef.value?.setCheckedKeys?.(props.operateChecked || [])
    authTreeRef.value?.setCheckedKeys?.(props.authChecked || [])
  },
  { deep: true, immediate: true },
)

const emitClose = () => emit('update:modelValue', false)

const handleSave = async () => {
  if (isDetail.value || !formRef.value) return
  try {
    await formRef.value.validate()
    console.log('localForm.value::', localForm.value)
    emit('save', {
      ...localForm.value,
      operateKeys: operateTreeRef.value?.getCheckedKeys?.() || [],
      authKeys: authTreeRef.value?.getCheckedKeys?.() || [],
    })
  } catch {
    ElMessage.error('请检查必填项')
  }
}
</script>

<style scoped lang="scss">
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
.tree-disabled :deep(.el-tree-node__label) {
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
  .dialog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
