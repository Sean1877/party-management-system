<template>
  <div class="user-management">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-section">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入用户名、姓名或手机号"
              clearable
              style="width: 200px;"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="组织">
            <el-select
              v-model="searchForm.organizationId"
              placeholder="请选择组织"
              clearable
              style="width: 150px;"
            >
              <el-option
                v-for="org in organizations"
                :key="org.id"
                :label="org.name"
                :value="org.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="党员状态">
            <el-select
              v-model="searchForm.partyMemberStatus"
              placeholder="请选择状态"
              clearable
              style="width: 120px;"
            >
              <el-option label="入党积极分子" :value="0" />
              <el-option label="发展对象" :value="1" />
              <el-option label="预备党员" :value="2" />
              <el-option label="正式党员" :value="3" />
              <el-option label="转出" :value="4" />
              <el-option label="退党" :value="5" />
              <el-option label="开除党籍" :value="6" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.active"
              placeholder="请选择状态"
              clearable
              style="width: 100px;"
            >
              <el-option label="启用" :value="true" />
              <el-option label="停用" :value="false" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="action-section">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
        <el-button 
          type="danger" 
          :disabled="selectedUsers.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>
    
    <!-- 用户表格 -->
    <el-card class="table-card">
      <el-table
        v-if="Array.isArray(users)"
        ref="userTableRef"
        v-loading="loading"
        :data="users"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="username" label="用户名" width="120" />
        
        <el-table-column prop="realName" label="真实姓名" width="100" />
        
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatarUrl" :icon="UserFilled" />
          </template>
        </el-table-column>
        
        <el-table-column prop="phone" label="手机号" width="120" />
        
        <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip />
        
        <el-table-column label="性别" width="80">
          <template #default="{ row }">
            {{ getGenderText(row.gender) }}
          </template>
        </el-table-column>
        
        <el-table-column label="党员状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getPartyMemberStatusType(row.partyMemberStatus)">
              {{ getPartyMemberStatusText(row.partyMemberStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="organization.name" label="所属组织" width="150" show-overflow-tooltip />
        
        <el-table-column prop="role.name" label="角色" width="100" />
        
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.active ? 'success' : 'danger'">
              {{ row.active ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button 
              :type="row.active ? 'warning' : 'success'" 
              size="small" 
              @click="handleToggleStatus(row)"
            >
              {{ row.active ? '停用' : '启用' }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户表单对话框 -->
    <UserForm
      v-model="formVisible"
      :user="currentUser"
      :organizations="organizations"
      :roles="roles"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, deleteUser, batchDeleteUsers, activateUser, deactivateUser } from '@/api/user'
import { getOrganizationList } from '@/api/organization'
import { formatDate, getGenderText, getPartyMemberStatusText } from '@/utils'
import UserForm from './components/UserForm.vue'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  UserFilled
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const users = ref([])
const organizations = ref([])
const roles = ref([])
const selectedUsers = ref([])
const formVisible = ref(false)
const currentUser = ref(null)
const userTableRef = ref(null)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  organizationId: null,
  partyMemberStatus: null,
  active: null
})

// 分页信息
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 获取党员状态类型
const getPartyMemberStatusType = (status) => {
  const typeMap = {
    0: 'info',
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'info',
    5: 'danger',
    6: 'danger'
  }
  return typeMap[status] || 'info'
}

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page - 1, // 后端从0开始
      size: pagination.size,
      ...searchForm
    }
    
    // 过滤空值
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await getUserList(params)
    // 确保数据是数组，防止 'data2 is not iterable' 错误
    const responseData = response?.data
    if (responseData && typeof responseData === 'object') {
      users.value = Array.isArray(responseData.content) ? responseData.content : []
      pagination.total = responseData.totalElements || 0
    } else {
      users.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
    ElMessage.error('加载用户列表失败')
    // 确保在错误情况下数据也是数组
    users.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 加载组织列表
const loadOrganizations = async () => {
  try {
    const response = await getOrganizationList({ size: 1000 })
    organizations.value = response.data.content || []
  } catch (error) {
    console.error('加载组织列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = key === 'active' ? null : ''
  })
  pagination.page = 1
  loadUsers()
}

// 新增用户
const handleAdd = () => {
  currentUser.value = null
  formVisible.value = true
}

// 编辑用户
const handleEdit = (user) => {
  currentUser.value = { ...user }
  formVisible.value = true
}

// 删除用户
const handleDelete = (user) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.realName}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteUser(user.id)
      ElMessage.success('删除成功')
      loadUsers()
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`,
    '确认批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const ids = selectedUsers.value.map(user => user.id)
      await batchDeleteUsers(ids)
      ElMessage.success('批量删除成功')
      selectedUsers.value = []
      loadUsers()
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  })
}

// 切换用户状态
const handleToggleStatus = async (user) => {
  try {
    if (user.active) {
      await deactivateUser(user.id)
      ElMessage.success('用户已停用')
    } else {
      await activateUser(user.id)
      ElMessage.success('用户已启用')
    }
    loadUsers()
  } catch (error) {
    console.error('切换用户状态失败:', error)
    ElMessage.error('操作失败')
  }
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  // 确保selection是数组，防止null引用错误
  if (Array.isArray(selection)) {
    selectedUsers.value = selection
  } else {
    selectedUsers.value = []
  }
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  loadUsers()
}

// 当前页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  loadUsers()
}

// 表单提交成功
const handleFormSuccess = () => {
  formVisible.value = false
  loadUsers()
}

// 组件挂载时加载数据
onMounted(() => {
  loadUsers()
  loadOrganizations()
})
</script>

<style lang="scss" scoped>
.user-management {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .search-section {
    flex: 1;
  }
  
  .action-section {
    display: flex;
    gap: 8px;
  }
}

.table-card {
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

// 响应式
@media (max-width: $breakpoint-md) {
  .user-management {
    padding: 16px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 16px;
    
    .search-section {
      width: 100%;
      
      .search-form {
        .el-form-item {
          margin-bottom: 8px;
        }
      }
    }
    
    .action-section {
      width: 100%;
      justify-content: flex-start;
    }
  }
}
</style>