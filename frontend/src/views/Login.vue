<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- 左侧背景区域 -->
      <div class="login-bg">
        <div class="bg-content">
          <h1 class="title">党建管理系统</h1>
          <p class="subtitle">现代化党组织管理平台</p>
          <div class="features">
            <div class="feature-item">
              <el-icon><UserFilled /></el-icon>
              <span>党员信息管理</span>
            </div>
            <div class="feature-item">
              <el-icon><OfficeBuilding /></el-icon>
              <span>组织架构管理</span>
            </div>
            <div class="feature-item">
              <el-icon><Calendar /></el-icon>
              <span>活动组织管理</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录表单 -->
      <div class="login-form-wrapper">
        <div class="login-form">
          <div class="form-header">
            <h2>用户登录</h2>
            <p>请输入您的账号和密码</p>
          </div>
          
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            size="large"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
                clearable
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                show-password
                clearable
              />
            </el-form-item>
            
            <el-form-item>
              <div class="form-options">
                <el-checkbox v-model="loginForm.rememberMe">
                  记住我
                </el-checkbox>
                <el-link type="primary" :underline="false">
                  忘记密码？
                </el-link>
              </div>
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="handleLogin"
                class="login-btn"
              >
                {{ loading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <p>还没有账号？<el-link type="primary" :underline="false">立即注册</el-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { UserFilled, OfficeBuilding, Calendar } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref()

// 加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    await userStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    ElMessage.success('登录成功')
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  min-height: 600px;
}

.login-bg {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  }
}

.bg-content {
  text-align: center;
  z-index: 1;
  position: relative;
  
  .title {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 16px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .subtitle {
    font-size: 18px;
    margin-bottom: 40px;
    opacity: 0.9;
  }
  
  .features {
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .feature-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 16px;
      
      .el-icon {
        font-size: 20px;
      }
    }
  }
}

.login-form-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  
  .form-header {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 28px;
      font-weight: bold;
      color: $text-color-primary;
      margin-bottom: 8px;
    }
    
    p {
      color: $text-color-secondary;
      font-size: 14px;
    }
  }
  
  .form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  
  .login-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
  }
  
  .form-footer {
    text-align: center;
    margin-top: 24px;
    
    p {
      color: $text-color-secondary;
      font-size: 14px;
    }
  }
}

// 响应式设计
@media (max-width: $breakpoint-md) {
  .login-wrapper {
    flex-direction: column;
    max-width: 400px;
  }
  
  .login-bg {
    min-height: 200px;
    
    .bg-content {
      .title {
        font-size: 32px;
      }
      
      .features {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        
        .feature-item {
          font-size: 14px;
          
          .el-icon {
            font-size: 16px;
          }
        }
      }
    }
  }
  
  .login-form-wrapper {
    padding: 20px;
  }
}

@media (max-width: $breakpoint-sm) {
  .login-container {
    padding: 10px;
  }
  
  .login-bg {
    .bg-content {
      .features {
        .feature-item {
          span {
            display: none;
          }
        }
      }
    }
  }
}
</style>