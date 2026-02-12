<template>
  <div class="placeholder-page">
    <el-card class="placeholder-card" shadow="never">
      <div class="title">{{ title }}</div>
      <div v-if="subtitle" class="desc">{{ subtitle }}</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
  }>(),
  {
    subtitle: '页面开发中',
  },
)
</script>

<style scoped lang="scss">
.placeholder-page {
  padding: 16px;
}

.placeholder-card {
  border-radius: 10px;
  border: 1px solid #e6e2db;
  background: #ffffff;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #6b532b;
}

.desc {
  margin-top: 8px;
  color: #a08b6b;
}
</style>
