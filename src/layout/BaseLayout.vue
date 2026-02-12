<template>
  <div class="base-layout">
    <header class="layout-header">
      <div class="brand">
        <div class="logo"></div>
        <div class="brand-text">
          <div class="cn">ai-vue3-elementplus</div>
        </div>
      </div>
      <div class="top-nav"></div>
      <div class="user-area">
        <span class="hello">Hi~ ai, 下午好!</span>
        <div class="avatar">G</div>
        <span class="user-name">ai</span>
      </div>
    </header>

    <div class="layout-body" :class="{ 'is-collapsed': isCollapsed }">
      <aside class="layout-aside">
        <SideMenu v-model:collapsed="isCollapsed" />
      </aside>

      <main class="layout-main">
        <div class="crumbs">
          <template v-for="(label, index) in crumbs" :key="label">
            <span class="crumb" :class="{ current: index === crumbs.length - 1 }">{{ label }}</span>
            <span v-if="index < crumbs.length - 1" class="sep">›</span>
          </template>
        </div>
        <div v-if="tabs.length" ref="tabsRef" class="tabs" @wheel="handleTabWheel">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            class="tab"
            :data-path="tab.path"
            :class="{ active: isActive(tab.path) }"
          >
            <span class="tab-label">{{ tab.label }}</span>
            <button class="tab-close" type="button" @click.stop.prevent="closeTab(tab.path)">
              ×
            </button>
          </RouterLink>
        </div>
        <div class="content">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideMenu from './components/SideMenu.vue'
import { findMenuPath, getTabItems } from './menu'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(false)
const tabsRef = ref<HTMLElement | null>(null)

const isActive = (path: string) => route.path === path

type TabItem = { path: string; label: string }
const tabs = ref<TabItem[]>([])

const getCurrentTab = (path: string): TabItem | null => {
  const trail = findMenuPath(path)
  const current = trail?.[trail.length - 1]
  if (current?.path && current.label) {
    const parentLabel =
      trail && trail.length > 1 ? trail[trail.length - 2]?.label ?? '' : ''
    const label = parentLabel ? `${parentLabel}-${current.label}` : current.label
    return { path: current.path, label }
  }
  return null
}

watch(
  () => route.path,
  (path) => {
    const current = getCurrentTab(path)
    if (!current) return
    if (!tabs.value.some((tab) => tab.path === current.path)) {
      tabs.value.push(current)
    }
    nextTick(() => {
      const container = tabsRef.value
      if (!container) return
      const activeEl = container.querySelector<HTMLElement>(
        `.tab[data-path="${CSS.escape(path)}"]`,
      )
      activeEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    })
  },
  { immediate: true },
)

const closeTab = (path: string) => {
  tabs.value = tabs.value.filter((tab) => tab.path !== path)
  if (route.path === path) {
    const next = tabs.value[tabs.value.length - 1]?.path
    if (next) {
      router.push(next)
    } else {
      router.push('/')
    }
  }
}

const handleTabWheel = (event: WheelEvent) => {
  const target = event.currentTarget as HTMLElement | null
  if (!target) return
  if (event.deltaY !== 0) {
    event.preventDefault()
    target.scrollLeft += event.deltaY
  }
}

const crumbs = computed(() => {
  const trail = findMenuPath(route.path)
  if (!trail) return []
  return trail.map((item) => item.label)
})
</script>

<style scoped lang="scss">
.base-layout {
  height: 100vh;
  width: 100vw;
  background: var(--app-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  --layout-aside-width-expanded: 240px;
  --layout-aside-width-collapsed: 84px;
  --layout-aside-width: var(--layout-aside-width-expanded);
  --layout-main-padding: 24px;
}

.layout-header {
  height: 68px;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  align-items: center;
  padding: 0 22px;
  background: var(--app-surface);
  border-bottom: 1px solid #ebe6dd;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #d9b36a 0%, #b88a41 100%);
}

.brand-text .cn {
  font-weight: 700;
  color: #7a5a2e;
  letter-spacing: 1px;
}

.brand-text .en {
  font-size: 11px;
  color: #b49b73;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-nav .module {
  padding: 8px 20px;
  border-radius: 18px;
  background: var(--brand-gold-200);
  color: var(--brand-brown);
  font-weight: 600;
}

.user-area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  color: #7a6b56;
  font-size: 14px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #d7b26a;
  color: var(--app-surface);
  display: grid;
  place-items: center;
  font-weight: 700;
}

.layout-body {
  flex: 1;
  display: grid;
  grid-template-columns: var(--layout-aside-width) 1fr;
  min-height: 0;
}

.layout-body.is-collapsed {
  --layout-aside-width: var(--layout-aside-width-collapsed);
}

.layout-aside {
  background: var(--app-surface);
  border-right: 1px solid #ebe6dd;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: visible !important;
}

.seal {
  width: 96px;
  height: 96px;
  border-radius: 14px;
  background: #f1f3f6;
  color: #d3d9e2;
  display: grid;
  place-items: center;
  font-size: 38px;
  font-weight: 700;
  align-self: center;
  border: 1px dashed #e3e7ee;
  margin-top: 12px;
}

.layout-main {
  padding: var(--layout-main-padding);
  display: flex;
  flex-direction: column;
  min-height: 0;
  --page-width: calc(100vw - var(--layout-aside-width) - (var(--layout-main-padding) * 2));
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8a7a63;
  font-weight: 600;
}

.crumbs .sep {
  color: #c0b39c;
}

.tabs {
  margin-top: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;
  padding-bottom: 4px;
  width: var(--page-width);
  align-self: flex-start;
}

.tabs::-webkit-scrollbar {
  height: 0;
}

.tab {
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
  border: 1px solid var(--el-color-primary-light-5);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tab.active {
  background: var(--el-color-primary);
  color: #ffffff;
  border-color: var(--el-color-primary);
}

.tab-label {
  line-height: 1;
}

.tab-close {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  padding: 0 2px;
}

.tab-close:hover {
  opacity: 0.75;
}

.content {
  margin-top: 16px;
  flex: 1;
  min-height: 0;
}

@media (max-width: 1200px) {
  .layout-header {
    grid-template-columns: 1fr;
    height: auto;
    padding: 10px 16px;
    gap: 8px;
  }

  .layout-body {
    --layout-aside-width: 200px;
  }
}

@media (max-width: 900px) {
  .layout-body {
    --layout-aside-width: 0px;
    grid-template-columns: 1fr;
  }

  .layout-aside {
    display: none;
  }
}
</style>
