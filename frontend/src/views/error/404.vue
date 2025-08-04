<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误图标 -->
      <div class="error-icon">
        <svg viewBox="0 0 404 404" class="error-svg">
          <!-- 404数字 -->
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="error-text">
            404
          </text>
          
          <!-- 装饰元素 -->
          <circle cx="100" cy="100" r="20" class="decoration-circle" />
          <circle cx="300" cy="120" r="15" class="decoration-circle" />
          <circle cx="320" cy="300" r="25" class="decoration-circle" />
          <circle cx="80" cy="320" r="18" class="decoration-circle" />
          
          <!-- 星星装饰 -->
          <polygon points="150,50 155,65 170,65 158,75 163,90 150,80 137,90 142,75 130,65 145,65" class="star" />
          <polygon points="350,200 353,210 363,210 355,216 358,226 350,220 342,226 345,216 337,210 347,210" class="star" />
          <polygon points="50,200 53,210 63,210 55,216 58,226 50,220 42,226 45,216 37,210 47,210" class="star" />
        </svg>
      </div>
      
      <!-- 错误信息 -->
      <div class="error-content">
        <h1 class="error-title">页面不存在</h1>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <p class="error-suggestion">
          请检查URL是否正确，或者返回首页继续浏览。
        </p>
        
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
          <el-button @click="refresh">
            <el-icon><Refresh /></el-icon>
            刷新页面
          </el-button>
        </div>
        
        <!-- 快捷导航 -->
        <div class="quick-nav">
          <h3>快捷导航</h3>
          <div class="nav-links">
            <router-link to="/dashboard" class="nav-link">
              <el-icon><Monitor /></el-icon>
              <span>工作台</span>
            </router-link>
            <router-link to="/user" class="nav-link">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </router-link>
            <router-link to="/organization" class="nav-link">
              <el-icon><OfficeBuilding /></el-icon>
              <span>组织管理</span>
            </router-link>
            <router-link to="/activity" class="nav-link">
              <el-icon><Calendar /></el-icon>
              <span>活动管理</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  HomeFilled,
  ArrowLeft,
  Refresh,
  Monitor,
  User,
  OfficeBuilding,
  Calendar
} from '@element-plus/icons-vue'

const router = useRouter()

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

// 刷新页面
const refresh = () => {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  
  .error-svg {
    width: 300px;
    height: 300px;
    
    .error-text {
      font-size: 120px;
      font-weight: bold;
      fill: $primary-color;
      opacity: 0.8;
    }
    
    .decoration-circle {
      fill: none;
      stroke: $primary-color;
      stroke-width: 2;
      opacity: 0.3;
      animation: float 3s ease-in-out infinite;
      
      &:nth-child(2) { animation-delay: 0.5s; }
      &:nth-child(3) { animation-delay: 1s; }
      &:nth-child(4) { animation-delay: 1.5s; }
      &:nth-child(5) { animation-delay: 2s; }
    }
    
    .star {
      fill: #ffd700;
      opacity: 0.6;
      animation: twinkle 2s ease-in-out infinite;
      
      &:nth-child(6) { animation-delay: 0.3s; }
      &:nth-child(7) { animation-delay: 0.6s; }
      &:nth-child(8) { animation-delay: 0.9s; }
    }
  }
}

.error-content {
  flex: 1;
  text-align: left;
  
  .error-title {
    font-size: 48px;
    font-weight: bold;
    color: #303133;
    margin: 0 0 16px 0;
    background: linear-gradient(45deg, $primary-color, #764ba2);
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
    margin: 0 0 32px 0;
    line-height: 1.6;
  }
  
  .error-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 40px;
    flex-wrap: wrap;
    
    .el-button {
      .el-icon {
        margin-right: 8px;
      }
    }
  }
  
  .quick-nav {
    h3 {
      font-size: 18px;
      color: #303133;
      margin: 0 0 16px 0;
    }
    
    .nav-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      
      .nav-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 12px;
        background: #f8f9fa;
        border-radius: 8px;
        text-decoration: none;
        color: #606266;
        transition: all 0.3s;
        
        &:hover {
          background: $primary-color;
          color: white;
          transform: translateY(-2px);
        }
        
        .el-icon {
          font-size: 24px;
          margin-bottom: 8px;
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
  
  .floating-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
    
    &.shape-1 {
      width: 80px;
      height: 80px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    
    &.shape-2 {
      width: 120px;
      height: 120px;
      top: 20%;
      right: 15%;
      animation-delay: 1s;
    }
    
    &.shape-3 {
      width: 60px;
      height: 60px;
      bottom: 30%;
      left: 20%;
      animation-delay: 2s;
    }
    
    &.shape-4 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      right: 10%;
      animation-delay: 3s;
    }
    
    &.shape-5 {
      width: 40px;
      height: 40px;
      top: 50%;
      left: 5%;
      animation-delay: 4s;
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

// 响应式
@media (max-width: $breakpoint-lg) {
  .error-container {
    flex-direction: column;
    gap: 40px;
    padding: 32px;
    
    .error-icon .error-svg {
      width: 250px;
      height: 250px;
      
      .error-text {
        font-size: 100px;
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
    
    .error-icon .error-svg {
      width: 200px;
      height: 200px;
      
      .error-text {
        font-size: 80px;
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
      
      .quick-nav .nav-links {
        grid-template-columns: repeat(2, 1fr);
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
    
    .error-icon .error-svg {
      width: 150px;
      height: 150px;
      
      .error-text {
        font-size: 60px;
      }
    }
    
    .error-content {
      .error-title {
        font-size: 24px;
      }
      
      .quick-nav .nav-links {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>