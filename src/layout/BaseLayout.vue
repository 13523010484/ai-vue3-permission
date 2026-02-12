<template>
  <div class="base-layout">
    <header class="layout-header">
      <div class="brand">
        <div class="logo"></div>
        <div class="brand-text">
          <div class="cn">上海清算所</div>
          <div class="en">SHANGHAI CLEARING HOUSE</div>
        </div>
      </div>
      <div class="top-nav">
        <span class="module">基础管理</span>
      </div>
      <div class="user-area">
        <span class="hello">Hi~ guoyu, 下午好!</span>
        <div class="avatar">G</div>
        <span class="user-name">guoyu</span>
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
        <div v-if="tabs.length" class="tabs">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            class="tab"
            :class="{ active: isActive(tab.path) }"
          >
            {{ tab.label }}
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SideMenu from './components/SideMenu.vue'
import { findMenuPath, getTabItems } from './menu'

const route = useRoute()
const isCollapsed = ref(false)

const isActive = (path: string) => route.path === path

const tabs = computed(() => getTabItems(route.path))

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
  background: #f3f2ee;
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
  background: #ffffff;
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
  background: #efe2c9;
  color: #7a5a2e;
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
  color: #fff;
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
  background: #ffffff;
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
  gap: 10px;
}

.tab {
  padding: 8px 16px;
  border-radius: 6px;
  background: #f6efe4;
  color: #7a5a2e;
  font-weight: 600;
  text-decoration: none;
}

.tab.active {
  background: #d7b26a;
  color: #fff;
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
