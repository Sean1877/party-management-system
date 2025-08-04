<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误图标 -->
      <div class="error-icon">
        <div class="lock-container">
          <div class="lock-body">
            <div class="lock-shackle"></div>
            <div class="lock-keyhole"></div>
          </div>
          <div class="error-number">403</div>
        </div>
      </div>
      
      <!-- 错误信息 -->
      <div class="error-content">
        <h1 class="error-title">访问被拒绝</h1>
        <p class="error-description">
          抱歉，您没有权限访问此页面。
        </p>
        <p class="error-suggestion">
          请联系系统管理员获取相应权限，或返回您有权限访问的页面。
        </p>
        
        <!-- 权限说明 -->
        <div class="permission-info">
          <h3>可能的原因：</h3>
          <ul>
            <li>您的账户权限不足</li>
            <li>页面需要特定角色权限</li>
            <li>会话已过期，请重新登录</li>
            <li>系统正在维护中</li>
          </ul>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
          <el-button @click="reLogin">
            <el-icon><User /></el-icon>
            重新登录
          </el-button>
        </div>
        
        <!-- 联系信息 -->
        <div class="contact-info">
          <h3>需要帮助？</h3>
          <div class="contact-methods">
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <span>联系电话：400-123-4567</span>
            </div>
            <div class="contact-item">
              <el-icon><Message /></el-icon>
              <span>邮箱：support@example.com</span>
            </div>
            <div class="contact-item">
              <el-icon><Service /></el-icon>
              <span>在线客服：工作日 9:00-18:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="warning-icon warning-1">
        <el-icon><Warning /></el-icon>
      </div>
      <div class="warning-icon warning-2">
        <el-icon><Lock /></el-icon>
      </div>
      <div class="warning-icon warning-3">
        <el-icon><Warning /></el-icon>
      </div>
      <div class="warning-icon warning-4">
        <el-icon><Lock /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  HomeFilled,
  ArrowLeft,
  User,
  Phone,
  Message,
  Service,
  Warning,
  Lock
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 返回首页
const goHome = () => {
  router.push('/dashboard')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

// 重新登录
const reLogin = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  position: relative;
  overflow: hidden;
}

.error-container {
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1000px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 2;
}

.error-icon {
  flex-shrink: 0;
  
  .lock-container {
    position: relative;
    width: 300px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .lock-body {
      width: 120px;
      height: 140px;
      background: #ff6b6b;
      border-radius: 20px;
      position: relative;
      box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
      animation: shake 3s ease-in-out infinite;
      
      .lock-shackle {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 80px;
        border: 12px solid #ff6b6b;
        border-bottom: none;
        border-radius: 40px 40px 0 0;
        background: transparent;
      }
      
      .lock-keyhole {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        
        &::after {
          content: '';
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 20px;
          background: white;
          border-radius: 0 0 3px 3px;
        }
      }
    }
    
    .error-number {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 48px;
      font-weight: bold;
      color: #ff6b6b;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

.error-content {
  flex: 1;
  
  .error-title {
    font-size: 48px;
    font-weight: bold;
    color: #303133;
    margin: 0 0 16px 0;
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .error-description {
    font-size: 18px;
    color: #606266;
    margin: 0 0 12px 0;
    line-height: 1.6;
  }
  
  .error-suggestion {
    font-size: 16px;
    color: #909399;
    margin: 0 0 24px 0;
    line-height: 1.6;
  }
  
  .permission-info {
    background: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    
    h3 {
      font-size: 16px;
      color: #ff6b6b;
      margin: 0 0 12px 0;
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
      
      li {
        color: #606266;
        margin-bottom: 8px;
        line-height: 1.5;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .error-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    
    .el-button {
      .el-icon {
        margin-right: 8px;
      }
    }
  }
  
  .contact-info {
    h3 {
      font-size: 18px;
      color: #303133;
      margin: 0 0 16px 0;
    }
    
    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .contact-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #606266;
        
        .el-icon {
          color: #ff6b6b;
          font-size: 16px;
        }
        
        span {
          font-size: 14px;
        }
      }
    }
  }
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  .warning-icon {
    position: absolute;
    font-size: 40px;
    color: rgba(255, 255, 255, 0.1);
    animation: float 4s ease-in-out infinite;
    
    &.warning-1 {
      top: 15%;
      left: 10%;
      animation-delay: 0s;
    }
    
    &.warning-2 {
      top: 25%;
      right: 15%;
      animation-delay: 1s;
    }
    
    &.warning-3 {
      bottom: 30%;
      left: 20%;
      animation-delay: 2s;
    }
    
    &.warning-4 {
      bottom: 20%;
      right: 10%;
      animation-delay: 3s;
    }
  }
}

// 动画
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

// 响应式
@media (max-width: $breakpoint-lg) {
  .error-container {
    flex-direction: column;
    gap: 40px;
    padding: 32px;
    
    .error-icon .lock-container {
      width: 250px;
      height: 250px;
      
      .lock-body {
        width: 100px;
        height: 120px;
        
        .lock-shackle {
          width: 70px;
          height: 70px;
          border-width: 10px;
        }
      }
      
      .error-number {
        font-size: 36px;
      }
    }
    
    .error-content {
      text-align: center;
      
      .error-title {
        font-size: 36px;
      }
    }
  }
}

@media (max-width: $breakpoint-md) {
  .error-container {
    padding: 24px;
    margin: 20px;
    
    .error-icon .lock-container {
      width: 200px;
      height: 200px;
      
      .lock-body {
        width: 80px;
        height: 100px;
        
        .lock-shackle {
          width: 60px;
          height: 60px;
          border-width: 8px;
        }
      }
      
      .error-number {
        font-size: 28px;
      }
    }
    
    .error-content {
      .error-title {
        font-size: 28px;
      }
      
      .error-description {
        font-size: 16px;
      }
      
      .error-actions {
        flex-direction: column;
        
        .el-button {
          width: 100%;
        }
      }
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .error-page {
    padding: 16px;
  }
  
  .error-container {
    padding: 20px;
    
    .error-icon .lock-container {
      width: 150px;
      height: 150px;
      
      .lock-body {
        width: 60px;
        height: 80px;
        
        .lock-shackle {
          width: 45px;
          height: 45px;
          border-width: 6px;
          top: -30px;
        }
        
        .lock-keyhole {
          width: 15px;
          height: 15px;
          
          &::after {
            width: 4px;
            height: 15px;
            top: 12px;
          }
        }
      }
      
      .error-number {
        font-size: 24px;
      }
    }
    
    .error-content {
      .error-title {
        font-size: 24px;
      }
    }
  }
}
</style>