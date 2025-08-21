<template>
  <div class="organization-management">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-section">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入组织名称或编码"
              clearable
              style="width: 200px;"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="组织类型">
            <el-select
              v-model="searchForm.type"
              placeholder="请选择类型"
              clearable
              style="width: 150px;"
            >
              <el-option label="党委" :value="0" />
              <el-option label="党总支" :value="1" />
              <el-option label="党支部" :value="2" />
              <el-option label="党小组" :value="3" />
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
          新增组织
        </el-button>
        <el-button 
          type="danger" 
          :disabled="selectedOrganizations.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button @click="handleExpandAll">
          <el-icon><Expand /></el-icon>
          {{ expandAll ? '折叠全部' : '展开全部' }}
        </el-button>
      </div>
    </div>
    
    <!-- 组织树表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="organizations"
        @selection-change="handleSelectionChange"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="expandAll"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="name" label="组织名称" width="250" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="org-name">
              <el-icon class="org-icon">
                <OfficeBuilding />
              </el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="code" label="组织编码" width="150" />
        
        <el-table-column label="组织类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getOrganizationTypeColor(row.type)">
              {{ getOrganizationTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="level" label="层级" width="80" />
        
        <el-table-column prop="secretary.realName" label="书记" width="100" />
        
        <el-table-column prop="memberCount" label="成员数" width="80" />
        
        <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
        
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
        
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="handleAddChild(row)">
              添加下级
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
    </el-card>
    
    <!-- 组织表单对话框 -->
    <OrganizationForm
      v-model="formVisible"
      :organization="currentOrganization"
      :parent-organization="parentOrganization"
      :organizations="flatOrganizations"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getOrganizationTree, 
  deleteOrganization, 
  batchDeleteOrganizations, 
  activateOrganization, 
  deactivateOrganization 
} from '@/api/organization'
import { formatDate, getOrganizationTypeText } from '@/utils'
import OrganizationForm from './components/OrganizationForm.vue'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Expand,
  OfficeBuilding
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const organizations = ref([])
const selectedOrganizations = ref([])
const formVisible = ref(false)
const currentOrganization = ref(null)
const parentOrganization = ref(null)
const expandAll = ref(false)
const tableRef = ref()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: null,
  active: null
})

// 扁平化组织列表（用于表单选择父组织）
const flatOrganizations = computed(() => {
  const flatten = (orgs, level = 0) => {
    let result = []
    orgs.forEach(org => {
      result.push({
        ...org,
        displayName: '　'.repeat(level) + org.name
      })
      if (org.children && org.children.length > 0) {
        result = result.concat(flatten(org.children, level + 1))
      }
    })
    return result
  }
  return flatten(organizations.value)
})

// 获取组织类型颜色
const getOrganizationTypeColor = (type) => {
  const colorMap = {
    0: 'danger',   // 党委
    1: 'warning',  // 党总支
    2: 'primary',  // 党支部
    3: 'info'      // 党小组
  }
  return colorMap[type] || 'info'
}

// 加载组织树
const loadOrganizations = async () => {
  try {
    loading.value = true
    const params = { ...searchForm }
    
    // 过滤空值
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await getOrganizationTree(params)
    organizations.value = response.data || []
  } catch (error) {
    console.error('加载组织树失败:', error)
    ElMessage.error('加载组织树失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  loadOrganizations()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = key === 'active' ? null : ''
  })
  loadOrganizations()
}

// 新增组织
const handleAdd = () => {
  currentOrganization.value = null
  parentOrganization.value = null
  formVisible.value = true
}

// 添加下级组织
const handleAddChild = (organization) => {
  currentOrganization.value = null
  parentOrganization.value = organization
  formVisible.value = true
}

// 编辑组织
const handleEdit = (organization) => {
  currentOrganization.value = { ...organization }
  parentOrganization.value = null
  formVisible.value = true
}

// 删除组织
const handleDelete = (organization) => {
  ElMessageBox.confirm(
    `确定要删除组织 "${organization.name}" 吗？删除后其下级组织也将被删除。`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteOrganization(organization.id)
      ElMessage.success('删除成功')
      loadOrganizations()
    } catch (error) {
      console.error('删除组织失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedOrganizations.value.length} 个组织吗？`,
    '确认批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const ids = selectedOrganizations.value.map(org => org.id)
      await batchDeleteOrganizations(ids)
      ElMessage.success('批量删除成功')
      selectedOrganizations.value = []
      loadOrganizations()
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  })
}

// 切换组织状态
const handleToggleStatus = async (organization) => {
  try {
    if (organization.active) {
      await deactivateOrganization(organization.id)
      ElMessage.success('组织已停用')
    } else {
      await activateOrganization(organization.id)
      ElMessage.success('组织已启用')
    }
    loadOrganizations()
  } catch (error) {
    console.error('切换组织状态失败:', error)
    ElMessage.error('操作失败')
  }
}

// 展开/折叠全部
const handleExpandAll = () => {
  expandAll.value = !expandAll.value
  
  // 使用nextTick确保DOM更新完成后再操作表格状态
  nextTick(() => {
    if (tableRef.value && tableRef.value.store && tableRef.value.store.states) {
      try {
        if (expandAll.value) {
          // 展开所有行
          tableRef.value.store.states.defaultExpandAll.value = true
          // 确保expandRows是数组
          if (!Array.isArray(tableRef.value.store.states.expandRows.value)) {
            tableRef.value.store.states.expandRows.value = []
          }
        } else {
          // 折叠所有行
          tableRef.value.store.states.defaultExpandAll.value = false
          // 确保expandRows是数组
          if (!Array.isArray(tableRef.value.store.states.expandRows.value)) {
            tableRef.value.store.states.expandRows.value = []
          } else {
            tableRef.value.store.states.expandRows.value = []
          }
        }
      } catch (error) {
        console.error('操作表格展开状态时出错:', error)
        // 重置为安全状态
        expandAll.value = false
      }
    }
  })
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  // 确保selection是数组，防止null引用错误
  if (Array.isArray(selection)) {
    selectedOrganizations.value = selection
  } else {
    selectedOrganizations.value = []
  }
}

// 表单提交成功
const handleFormSuccess = () => {
  formVisible.value = false
  loadOrganizations()
}

// 组件挂载时加载数据
onMounted(() => {
  loadOrganizations()
})
</script>

<style lang="scss" scoped>
.organization-management {
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
  .org-name {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .org-icon {
      color: $primary-color;
    }
  }
}

// 响应式
@media (max-width: $breakpoint-md) {
  .organization-management {
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