<template>
  <template v-for="item in items" :key="item.key">
    <el-sub-menu v-if="item.children" :index="item.key">
      <template #title>
        <div class="menu-title">
          <el-icon v-if="item.icon" class="menu-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="menu-text">{{ item.label }}</span>
          <span class="menu-arrow" aria-hidden="true">›</span>
        </div>
      </template>
      <MenuTree :items="item.children" :collapsed="collapsed" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
      <el-icon v-if="item.icon" class="menu-icon">
        <component :is="item.icon" />
      </el-icon>
      <span class="menu-text">{{ item.label }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { MenuItem } from '../menu'

defineOptions({
  name: 'MenuTree',
})

defineProps<{
  items: MenuItem[]
  collapsed?: boolean
}>()
</script>

<style scoped lang="scss">
.menu-title {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-icon {
  font-size: 16px;
  width: 16px;
  height: 16px;
}

.menu-text {
  flex: 1;
}

.menu-arrow {
  margin-left: auto;
  font-size: 18px;
  color: #b7a995;
}
</style>
