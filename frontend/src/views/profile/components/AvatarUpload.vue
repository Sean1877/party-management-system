<template>
  <el-dialog
    v-model="visible"
    title="更换头像"
    width="500px"
    :before-close="handleClose"
  >
    <div class="avatar-upload-container">
      <!-- 当前头像 -->
      <div class="current-avatar">
        <h4>当前头像</h4>
        <el-avatar :size="80" :src="currentAvatar" :icon="UserFilled" />
      </div>
      
      <!-- 上传区域 -->
      <div class="upload-section">
        <h4>选择新头像</h4>
        
        <!-- 文件上传 -->
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :action="uploadAction"
          :headers="uploadHeaders"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :disabled="uploading"
        >
          <div v-if="previewUrl" class="avatar-preview">
            <img :src="previewUrl" alt="预览" />
            <div class="preview-overlay">
              <el-icon><Plus /></el-icon>
              <span>重新选择</span>
            </div>
          </div>
          
          <div v-else class="upload-placeholder">
            <el-icon class="upload-icon"><Plus /></el-icon>
            <div class="upload-text">
              <p>点击选择图片</p>
              <p class="upload-tips">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
            </div>
          </div>
        </el-upload>
        
        <!-- 上传进度 -->
        <div v-if="uploading" class="upload-progress">
          <el-progress :percentage="uploadProgress" :show-text="false" />
          <p>正在上传头像...</p>
        </div>
      </div>
      
      <!-- 裁剪区域 -->
      <div v-if="showCropper" class="cropper-section">
        <h4>调整头像</h4>
        <div class="cropper-container">
          <vue-cropper
            ref="cropperRef"
            :img="originalImage"
            :output-size="1"
            :output-type="'png'"
            :info="true"
            :full="false"
            :can-move="true"
            :can-move-box="true"
            :original="false"
            :auto-crop="true"
            :auto-crop-width="200"
            :auto-crop-height="200"
            :fixed-box="true"
            :fixed="true"
            :fixed-number="[1, 1]"
            :center-box="true"
            :info-true="true"
            :background="'#f0f0f0'"
          />
        </div>
        
        <div class="cropper-actions">
          <el-button @click="rotateLeft">
            <el-icon><RefreshLeft /></el-icon>
            向左旋转
          </el-button>
          <el-button @click="rotateRight">
            <el-icon><RefreshRight /></el-icon>
            向右旋转
          </el-button>
          <el-button @click="resetCropper">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          v-if="showCropper" 
          type="primary" 
          :loading="uploading" 
          @click="handleCropAndUpload"
        >
          确认上传
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { updateUserAvatar } from '@/api/user'
import { getToken } from '@/utils/auth'
import VueCropper from 'vue-cropper'
import {
  UserFilled,
  Plus,
  RefreshLeft,
  RefreshRight,
  Refresh
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success'])

// Store
const userStore = useUserStore()

// 响应式数据
const uploadRef = ref()
const cropperRef = ref()
const visible = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const previewUrl = ref('')
const originalImage = ref('')
const showCropper = ref(false)

// 计算属性
const currentAvatar = computed(() => userStore.userInfo?.avatarUrl)

// 上传配置
const uploadAction = computed(() => `${import.meta.env.VITE_API_BASE_URL}/api/upload/avatar`)
const uploadHeaders = computed(() => ({
  'Authorization': `Bearer ${getToken()}`
}))

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val) {
      resetUpload()
    }
  },
  { immediate: true }
)

// 监听visible变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 重置上传状态
const resetUpload = () => {
  previewUrl.value = ''
  originalImage.value = ''
  showCropper.value = false
  uploading.value = false
  uploadProgress.value = 0
}

// 上传前验证
const beforeUpload = (file) => {
  // 检查文件类型
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  
  // 检查文件大小
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  
  // 读取文件并显示预览
  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target.result
    previewUrl.value = e.target.result
    showCropper.value = true
  }
  reader.readAsDataURL(file)
  
  // 阻止自动上传
  return false
}

// 上传成功
const handleUploadSuccess = (response) => {
  uploading.value = false
  uploadProgress.value = 0
  
  if (response.code === 200) {
    ElMessage.success('头像上传成功')
    emit('success')
    handleClose()
  } else {
    ElMessage.error(response.message || '头像上传失败')
  }
}

// 上传失败
const handleUploadError = (error) => {
  uploading.value = false
  uploadProgress.value = 0
  console.error('头像上传失败:', error)
  ElMessage.error('头像上传失败，请重试')
}

// 裁剪并上传
const handleCropAndUpload = () => {
  if (!cropperRef.value) return
  
  cropperRef.value.getCropBlob((blob) => {
    const formData = new FormData()
    formData.append('file', blob, 'avatar.png')
    
    uploading.value = true
    uploadProgress.value = 0
    
    // 模拟上传进度
    const progressTimer = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)
    
    updateUserAvatar(userStore.userInfo.id, formData)
      .then((response) => {
        clearInterval(progressTimer)
        uploadProgress.value = 100
        handleUploadSuccess(response)
      })
      .catch((error) => {
        clearInterval(progressTimer)
        handleUploadError(error)
      })
  })
}

// 裁剪器操作
const rotateLeft = () => {
  cropperRef.value?.rotateLeft()
}

const rotateRight = () => {
  cropperRef.value?.rotateRight()
}

const resetCropper = () => {
  cropperRef.value?.refresh()
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  resetUpload()
}
</script>

<style lang="scss" scoped>
.avatar-upload-container {
  .current-avatar {
    text-align: center;
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 14px;
    }
  }
  
  .upload-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 14px;
    }
    
    .avatar-uploader {
      display: block;
      
      :deep(.el-upload) {
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s;
        width: 200px;
        height: 200px;
        margin: 0 auto;
        
        &:hover {
          border-color: $primary-color;
        }
      }
    }
    
    .avatar-preview {
      position: relative;
      width: 200px;
      height: 200px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        
        .el-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        span {
          font-size: 14px;
        }
      }
      
      &:hover .preview-overlay {
        opacity: 1;
      }
    }
    
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      
      .upload-icon {
        font-size: 48px;
        color: #c0c4cc;
        margin-bottom: 16px;
      }
      
      .upload-text {
        text-align: center;
        
        p {
          margin: 0;
          
          &:first-child {
            color: #606266;
            font-size: 14px;
            margin-bottom: 4px;
          }
        }
        
        .upload-tips {
          color: #909399;
          font-size: 12px;
        }
      }
    }
    
    .upload-progress {
      margin-top: 16px;
      text-align: center;
      
      p {
        margin: 8px 0 0 0;
        color: #606266;
        font-size: 14px;
      }
    }
  }
  
  .cropper-section {
    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 14px;
    }
    
    .cropper-container {
      width: 100%;
      height: 300px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .cropper-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
      
      .el-button {
        .el-icon {
          margin-right: 4px;
        }
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}

// 响应式
@media (max-width: $breakpoint-sm) {
  .avatar-upload-container {
    .upload-section {
      .avatar-uploader {
        :deep(.el-upload) {
          width: 150px;
          height: 150px;
        }
      }
      
      .avatar-preview {
        width: 150px;
        height: 150px;
      }
    }
    
    .cropper-section {
      .cropper-container {
        height: 250px;
      }
      
      .cropper-actions {
        flex-wrap: wrap;
        
        .el-button {
          flex: 1;
          min-width: 100px;
        }
      }
    }
  }
}
</style>