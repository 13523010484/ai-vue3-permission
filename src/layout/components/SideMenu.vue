<template>
  <div class="side-menu-wrapper">
    <el-menu
      ref="menuRef"
      :class="['side-menu', { 'is-collapsed': collapsed }]"
      :default-active="activeMenu"
      mode="vertical"
      :collapse="collapsed"
      menu-trigger="hover"
      router
      unique-opened
      background-color="transparent"
      text-color="#5f5b53"
      active-text-color="#2f77ff"
      :collapse-transition="false"
      popper-class="side-menu-popper"
      @open="handleMenuOpen"
      @close="handleMenuClose"
    >
      <MenuTree :items="menuTree" :collapsed="collapsed" />
    </el-menu>
    <div class="collapse-btn" @click="collapsed = !collapsed">
      <el-icon>
        <Expand v-if="collapsed" />
        <Fold v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { menuTree } from '../menu'
import MenuTree from './MenuTree.vue'

const route = useRoute()

const props = defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const collapsed = computed({
  get: () => props.collapsed ?? false,
  set: (value: boolean) => emit('update:collapsed', value),
})
const activeMenu = computed(() => route.path)
const menuRef = ref<any>(null)

const handleMenuOpen = (index: string) => {
  // 菜单打开时的处理
}

const handleMenuClose = (index: string) => {
  // 菜单关闭时的处理
}
</script>

<style scoped lang="scss">
.side-menu-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  cursor: pointer;
  color: #8a7a63;
  border-top: 1px solid #ebe6dd;
  margin-top: auto;
  transition: all 0.3s ease;

  &:hover {
    color: #5f5a53;
    background: #f5ede4;
  }

  :deep(.el-icon) {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    transition: transform 0.3s ease;
  }
}

.side-menu {
  flex: 1;
  border-right: none;
  background: transparent;
  overflow: visible !important;
  padding: 0;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d4c5b9;
    border-radius: 3px;

    &:hover {
      background: #b8a898;
    }
  }
}

.side-menu :deep(.el-menu-item),
.side-menu :deep(.el-sub-menu__title) {
  height: 42px;
  line-height: 42px;
  border-radius: 8px;
  margin: 4px 0;
  font-weight: 600;
  background: #f7f5f1;
  color: #5f5b53;
  transition: all 0.2s ease;
}

.side-menu :deep(.el-menu-item.is-active) {
  background: #e9f1ff;
  color: #2f77ff;
  border: 1px solid #cfe0ff !important;
  box-shadow: inset 0 0 0 1px rgba(47, 119, 255, 0.15);
}

.side-menu :deep(.el-menu-item:hover) {
  background: #f0ede7;
}

.side-menu :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  background: #f0ede7;
}

.side-menu :deep(.el-sub-menu__title:hover) {
  background: #f0ede7;
}

.side-menu.is-collapsed :deep(.menu-text) {
  display: none;
}

.side-menu.is-collapsed :deep(.menu-arrow) {
  display: none;
}

:global(.side-menu-popper .menu-text) {
  display: inline;
}

/* 子菜单容器 */
.side-menu :deep(.el-sub-menu) {
  position: relative !important;
}

.side-menu :deep(.el-sub-menu::after) {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  width: 12px;
  height: 100%;
}

/* 当悬浮时显示子菜单 */
.side-menu :deep(.el-sub-menu:hover > .el-sub-menu__popup) {
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: translateX(calc(100% + 4px)) !important;
}

.side-menu :deep(.el-sub-menu__title) {
  position: relative;
  padding-right: 12px !important;
}

/* 隐藏默认箭头 */
.side-menu :deep(.el-sub-menu__icon-arrow) {
  display: none !important;
}

/* 菜单容器设置 */
.side-menu :deep(.el-sub-menu) {
  position: relative !important;
  overflow: visible !important;
}

/* 展开状态下，将内联子菜单改为右侧悬浮弹层 */
.side-menu:not(.is-collapsed) :deep(.el-sub-menu__inline),
.side-menu:not(.is-collapsed) :deep(.el-menu--inline) {
  position: absolute !important;
  left: 100% !important;
  top: 0 !important;
  min-width: 160px !important;
  display: block !important;
  height: 0 !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  z-index: 2000 !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transform: translateX(4px) !important;
  transition:
    visibility 0.2s,
    opacity 0.2s,
    transform 0.2s !important;
}

.side-menu:not(.is-collapsed) :deep(.el-sub-menu:hover > .el-sub-menu__inline),
.side-menu:not(.is-collapsed) :deep(.el-sub-menu__inline:hover),
.side-menu:not(.is-collapsed) :deep(.el-sub-menu:hover > .el-menu--inline),
.side-menu:not(.is-collapsed) :deep(.el-menu--inline:hover) {
  height: auto !important;
  overflow: visible !important;
  padding: 6px 0 !important;
  border: 1px solid #d6e4ff !important;
  border-radius: 10px !important;
  background: #ffffff !important;
  box-shadow: 0 6px 16px rgba(64, 120, 255, 0.2) !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: translateX(8px) !important;
}

.side-menu:not(.is-collapsed) :deep(.el-sub-menu__inline .el-menu-item),
.side-menu:not(.is-collapsed) :deep(.el-sub-menu__inline .el-sub-menu__title),
.side-menu:not(.is-collapsed) :deep(.el-menu--inline .el-menu-item),
.side-menu:not(.is-collapsed) :deep(.el-menu--inline .el-sub-menu__title) {
  background: transparent !important;
  border-radius: 0 !important;
  margin: 0 !important;
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 16px !important;
  font-weight: 500 !important;
  color: #6b5b45 !important;
}

.side-menu:not(.is-collapsed) :deep(.el-sub-menu__inline .el-menu-item:hover),
.side-menu:not(.is-collapsed) :deep(.el-sub-menu__inline .el-sub-menu__title:hover),
.side-menu:not(.is-collapsed) :deep(.el-menu--inline .el-menu-item:hover),
.side-menu:not(.is-collapsed) :deep(.el-menu--inline .el-sub-menu__title:hover) {
  background: #e9f2ff !important;
  color: #2f77ff !important;
}

.side-menu:not(.is-collapsed) :deep(.el-sub-menu__inline .el-menu-item.is-active),
.side-menu:not(.is-collapsed) :deep(.el-menu--inline .el-menu-item.is-active) {
  background: #e9f2ff !important;
  color: #2f77ff !important;
}

/* 子菜单弹出样式 - 横向从右侧打开 */
.side-menu :deep(.el-sub-menu__popup) {
  position: absolute !important;
  left: 100% !important;
  right: auto !important;
  top: 0 !important;
  background: #ffffff !important;
  border: 1px solid #ebe6dd !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
  margin-left: 0 !important;
  margin-top: -4px !important;
  min-width: 160px !important;
  z-index: 2000 !important;
  transform: translateX(calc(100% + 4px)) !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition:
    visibility 0.3s,
    opacity 0.3s,
    transform 0.3s !important;
}

/* 子菜单中的菜单项 */
.side-menu :deep(.el-sub-menu__popup .el-menu-item),
.side-menu :deep(.el-sub-menu__popup .el-sub-menu__title) {
  background: transparent !important;
  border-radius: 0 !important;
  margin: 0 !important;
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 16px !important;
  font-weight: 500 !important;
  color: #5f5b53 !important;
}

.side-menu :deep(.el-sub-menu__popup .el-menu-item:hover),
.side-menu :deep(.el-sub-menu__popup .el-sub-menu__title:hover) {
  background: #f5ede4 !important;
}

.side-menu :deep(.el-sub-menu__popup .el-menu-item.is-active) {
  background: #e9f1ff !important;
  color: #2f77ff !important;
}

/* 处理 Popper 容器 - 确保菜单从右侧显示 */
:global(.el-menu--popup) {
  margin-left: 4px !important;
}

:global(.side-menu-popper) {
  background: #ffffff !important;
  border: 1px solid #ebe6dd !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
  padding: 4px 0 !important;
}

:global(.side-menu-popper .el-menu) {
  border: none !important;
  background: transparent !important;
}

:global(.side-menu-popper .el-menu-item) {
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 16px !important;
  font-weight: 500 !important;
  background: transparent !important;
  color: #5f5b53 !important;
}

:global(.side-menu-popper .el-menu-item:hover) {
  background: #f5ede4 !important;
}

:global(.side-menu-popper .el-menu-item.is-active) {
  background: #e9f1ff !important;
  color: #2f77ff !important;
}
</style>
