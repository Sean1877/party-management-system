<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误图标 -->
      <div class="error-icon">
        <div class="server-container">
          <div class="server-rack">
            <div class="server-unit" v-for="i in 3" :key="i" :class="`unit-${i}`">
              <div class="server-lights">
                <div class="light red" :class="{ blink: i === 2 }"></div>
                <div class="light yellow" :class="{ blink: i === 1 }"></div>
                <div class="light green"></div>
              </div>
              <div class="server-slots">
                <div class="slot" v-for="j in 4" :key="j"></div>
              </div>
            </div>
          </div>
          <div class="error-number">500</div>
          <div class="error-sparks">
            <div class="spark" v-for="i in 6" :key="i" :class="`spark-${i}`">⚡</div>
          </div>
        </div>
      </div>
      
      <!-- 错误信息 -->
      <div class="error-content">
        <h1 class="error-title">服务器错误</h1>
        <p class="error-description">
          抱歉，服务器遇到了一个内部错误，无法完成您的请求。
        </p>
        <p class="error-suggestion">
          我们的技术团队已经收到通知，正在紧急处理这个问题。
        </p>
        
        <!-- 错误详情 -->
        <div class="error-details">
          <h3>错误信息：</h3>
          <div class="error-code">
            <code>{{ errorMessage }}</code>
          </div>
          <div class="error-time">
            <span>发生时间：{{ errorTime }}</span>
            <span>错误ID：{{ errorId }}</span>
          </div>
        </div>
        
        <!-- 建议操作 -->
        <div class="suggestions">
          <h3>您可以尝试：</h3>
          <ul>
            <li>刷新页面重试</li>
            <li>稍后再次访问</li>
            <li>检查网络连接</li>
            <li>联系技术支持</li>
          </ul>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" @click="refresh">
            <el-icon><Refresh /></el-icon>
            刷新页面
          </el-button>
          <el-button @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          <el-button @click="reportError">
            <el-icon><Warning /></el-icon>
            报告问题
          </el-button>
        </div>
        
        <!-- 联系支持 -->
        <div class="support-info">
          <h3>技术支持</h3>
          <div class="support-methods">
            <div class="support-item">
              <el-icon><Phone /></el-icon>
              <span>紧急热线：400-123-4567</span>
            </div>
            <div class="support-item">
              <el-icon><Message /></el-icon>
              <span>技术邮箱：tech@example.com</span>
            </div>
            <div class="support-item">
              <el-icon><Clock /></el-icon>
              <span>服务时间：7×24小时</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="error-wave wave-1"></div>
      <div class="error-wave wave-2"></div>
      <div class="error-wave wave-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  HomeFilled,
  Warning,
  Phone,
  Message,
  Clock
} from '@element-plus/icons-vue'

const router = useRouter()

// 错误信息
const errorMessage = ref('Internal Server Error: Database connection failed')
const errorTime = ref('')
const errorId = ref('')

// 生成错误ID和时间
const generateErrorInfo = () => {
  errorTime.value = new Date().toLocaleString()
  errorId.value = 'ERR-' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

// 刷新页面
const refresh = () => {
  window.location.reload()
}

// 返回首页
const goHome = () => {
  router.push('/dashboard')
}

// 报告错误
const reportError = () => {
  ElMessage.info('错误报告已提交，感谢您的反馈')
  // 这里可以实现错误报告的逻辑
}

// 组件挂载时生成错误信息
onMounted(() => {
  generateErrorInfo()
})
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  position: relative;
  overflow: hidden;
}

.error-container {
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1200px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 2;
}

.error-icon {
  flex-shrink: 0;
  
  .server-container {
    position: relative;
    width: 300px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .server-rack {
      width: 120px;
      height: 180px;
      background: #2c3e50;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 10px 20px rgba(44, 62, 80, 0.3);
      
      .server-unit {
        width: 100%;
        height: 50px;
        background: #34495e;
        margin-bottom: 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        position: relative;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        &.unit-2 {
          background: #e74c3c;
          animation: serverError 2s ease-in-out infinite;
        }
        
        .server-lights {
          display: flex;
          gap: 4px;
          
          .light {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            
            &.red {
              background: #e74c3c;
              
              &.blink {
                animation: blink 1s ease-in-out infinite;
              }
            }
            
            &.yellow {
              background: #f39c12;
              
              &.blink {
                animation: blink 1.5s ease-in-out infinite;
              }
            }
            
            &.green {
              background: #27ae60;
            }
          }
        }
        
        .server-slots {
          display: flex;
          gap: 2px;
          margin-left: auto;
          
          .slot {
            width: 12px;
            height: 3px;
            background: #7f8c8d;
            border-radius: 1px;
          }
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
      color: #e74c3c;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .error-sparks {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      
      .spark {
        position: absolute;
        font-size: 20px;
        color: #f39c12;
        animation: sparkle 2s ease-in-out infinite;
        
        &.spark-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        &.spark-2 {
          top: 30%;
          right: 15%;
          animation-delay: 0.3s;
        }
        
        &.spark-3 {
          top: 60%;
          left: 20%;
          animation-delay: 0.6s;
        }
        
        &.spark-4 {
          bottom: 30%;
          right: 10%;
          animation-delay: 0.9s;
        }
        
        &.spark-5 {
          top: 50%;
          left: 5%;
          animation-delay: 1.2s;
        }
        
        &.spark-6 {
          bottom: 20%;
          left: 50%;
          animation-delay: 1.5s;
        }
      }
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
    background: linear-gradient(45deg, #e74c3c, #c0392b);
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
  
  .error-details {
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    
    h3 {
      font-size: 16px;
      color: #e74c3c;
      margin: 0 0 12px 0;
    }
    
    .error-code {
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 12px;
      
      code {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 14px;
        color: #e74c3c;
        word-break: break-all;
      }
    }
    
    .error-time {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: #666;
      
      span {
        &:first-child {
          color: #606266;
        }
      }
    }
  }
  
  .suggestions {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    
    h3 {
      font-size: 16px;
      color: #0369a1;
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
  
  .support-info {
    h3 {
      font-size: 18px;
      color: #303133;
      margin: 0 0 16px 0;
    }
    
    .support-methods {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .support-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #606266;
        
        .el-icon {
          color: #e74c3c;
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
  
  .error-wave {
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(231, 76, 60, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    animation: wave 8s ease-in-out infinite;
    
    &.wave-1 {
      top: -50%;
      left: -50%;
      animation-delay: 0s;
    }
    
    &.wave-2 {
      top: -30%;
      right: -50%;
      animation-delay: 2s;
    }
    
    &.wave-3 {
      bottom: -50%;
      left: -30%;
      animation-delay: 4s;
    }
  }
}

// 动画
@keyframes serverError {
  0%, 100% {
    background: #e74c3c;
  }
  50% {
    background: #c0392b;
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

@keyframes wave {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.2;
  }
}

// 响应式
@media (max-width: $breakpoint-lg) {
  .error-container {
    flex-direction: column;
    gap: 40px;
    padding: 32px;
    
    .error-icon .server-container {
      width: 250px;
      height: 250px;
      
      .server-rack {
        width: 100px;
        height: 150px;
        
        .server-unit {
          height: 40px;
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
    
    .error-icon .server-container {
      width: 200px;
      height: 200px;
      
      .server-rack {
        width: 80px;
        height: 120px;
        
        .server-unit {
          height: 32px;
          
          .server-lights .light {
            width: 6px;
            height: 6px;
          }
          
          .server-slots .slot {
            width: 8px;
            height: 2px;
          }
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
      
      .error-details .error-time {
        flex-direction: column;
        gap: 8px;
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
    
    .error-icon .server-container {
      width: 150px;
      height: 150px;
      
      .server-rack {
        width: 60px;
        height: 90px;
        
        .server-unit {
          height: 24px;
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