<template>
  <div class="login-container">
    <el-card class="login-wrap">
      <template #header>
        <div class="card-header">鐧诲綍</div>
      </template>

      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="auto">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" />
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" @click="handleLogin" :loading="loading" class="large-button">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/login'

interface LoginForm {
  username: string
  password: string
}

const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref<LoginForm>({
  username: '',
  password: '',
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度应在 3 到 20 个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' },
  ],
}

const loading = ref(false)
const loginFormRef = ref()

const handleLogin = async () => {
  if (!loginFormRef.value) return
  try {
    await loginFormRef.value.validate()
    loading.value = true
    const response = await authStore.login({
      operCode: loginForm.value.username,
      password: loginForm.value.password,
    })
    const payload = response?.data ?? response
    if (payload && typeof payload.code !== 'undefined' && payload.code !== 0) {
      ElMessage.error(payload.message || '登录失败')
      return
    }
    const token =
      payload?.token ??
      payload?.accessToken ??
      payload?.data?.token ??
      payload?.data?.accessToken
    if (token) {
      sessionStorage.setItem('token', String(token))
    }
    const userInfo = payload?.user ?? payload?.userInfo ?? payload?.data?.user ?? payload?.data?.userInfo
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
    ElMessage.success('登录成功!')
    router.push('/department/query')
  } catch (error) {
    console.error('鏍￠獙澶辫触:', error)
    const message =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      '请检查输入'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: var(--app-bg);
}

.login-wrap {
  width: 420px;
  padding: 20px 22px 10px;
  border-radius: 12px;
}

.card-header {
  text-align: center;
  font-weight: 700;
  color: var(--app-text-title);
}

.large-button {
  width: 100%;
  padding: 15px;
  font-size: 18px;
}
</style>


