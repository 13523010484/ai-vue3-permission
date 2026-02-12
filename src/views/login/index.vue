<template>
  <div class="login-container">
    <el-card class="login-wrap">
      <template #header>
        <div class="card-header">登录</div>
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

interface LoginForm {
  username: string
  password: string
}

const router = useRouter()

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
    setTimeout(() => {
      loading.value = false
      ElMessage.success('登录成功!')
      router.push('/department/query')
    }, 800)
  } catch (error) {
    console.error('校验失败:', error)
    ElMessage.error('请检查输入')
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
  background: #f3f2ee;
}

.login-wrap {
  width: 420px;
  padding: 20px 22px 10px;
  border-radius: 12px;
}

.card-header {
  text-align: center;
  font-weight: 700;
  color: #6b532b;
}

.large-button {
  width: 100%;
  padding: 15px;
  font-size: 18px;
}
</style>
