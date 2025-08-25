<template>
  <div class="operation-log">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
        </div>
      </template>
      
      <!-- 搜索筛选区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="queryParams" @submit.prevent>
          <el-form-item label="用户名">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select v-model="queryParams.operationType" placeholder="请选择" clearable>
              <el-option label="创建" value="CREATE" />
              <el-option label="更新" value="UPDATE" />
              <el-option label="删除" value="DELETE" />
              <el-option label="查看" value="READ" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作模块">
            <el-select v-model="queryParams.operationModule" placeholder="请选择" clearable>
              <el-option label="用户管理" value="USER_MANAGEMENT" />
              <el-option label="活动管理" value="ACTIVITY_MANAGEMENT" />
              <el-option label="费用管理" value="FEE_MANAGEMENT" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格数据 -->
      <el-table
        v-loading="loading"
        :data="logList"
        border
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="getOperationTypeTag(scope.row.operationType)">
              {{ getOperationTypeText(scope.row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationModule" label="操作模块" width="150">
          <template #default="scope">
            <el-tag type="info">
              {{ getOperationModuleText(scope.row.operationModule) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationDescription" label="操作描述" />
        <el-table-column prop="requestMethod" label="请求方式" width="100" />
        <el-table-column prop="ipAddress" label="IP地址" width="130" />
        <el-table-column prop="executionTime" label="执行时间(ms)" width="120" />
        <el-table-column prop="createdAt" label="操作时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleView(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="操作日志详情" width="800px">
      <div v-if="currentLog" class="log-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">
            {{ currentLog.id }}
          </el-descriptions-item>
          <el-descriptions-item label="用户名">
            {{ currentLog.username }}
          </el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <el-tag :type="getOperationTypeTag(currentLog.operationType)">
              {{ getOperationTypeText(currentLog.operationType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作模块">
            <el-tag type="info">
              {{ getOperationModuleText(currentLog.operationModule) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作描述" :span="2">
            {{ currentLog.operationDescription }}
          </el-descriptions-item>
          <el-descriptions-item label="请求方式">
            <el-tag :type="currentLog.requestMethod === 'GET' ? 'success' : 'warning'">
              {{ currentLog.requestMethod }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="请求URL">
            {{ currentLog.requestUrl }}
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">
            {{ currentLog.ipAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="执行时间">
            {{ currentLog.executionTime }}ms
          </el-descriptions-item>
          <el-descriptions-item label="响应状态">
            <el-tag :type="currentLog.responseStatus === 200 ? 'success' : 'danger'">
              {{ currentLog.responseStatus }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">
            {{ currentLog.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="请求参数" :span="2">
            <pre class="json-content">{{ formatJson(currentLog.requestParams) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="用户代理" :span="2">
            {{ currentLog.userAgent }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'OperationLog',
  setup() {
    const loading = ref(false)
    const logList = ref([])
    const total = ref(0)
    const detailVisible = ref(false)
    const currentLog = ref(null)

    const queryParams = reactive({
      page: 1,
      size: 20,
      username: '',
      operationType: '',
      operationModule: ''
    })

    // 获取操作日志列表
    const getLogList = async () => {
      loading.value = true
      try {
        // 这里应该调用API获取数据，暂时使用模拟数据
        const mockData = {
          content: [
            {
              id: 1,
              username: 'admin',
              operationType: 'CREATE',
              operationModule: 'USER_MANAGEMENT',
              operationDescription: '创建用户',
              requestMethod: 'POST',
              requestUrl: '/api/users',
              requestParams: '{"username":"test","email":"test@example.com"}',
              responseStatus: 200,
              executionTime: 125,
              ipAddress: '192.168.1.100',
              userAgent: 'Mozilla/5.0',
              createdAt: '2024-01-01 10:00:00'
            }
          ],
          totalElements: 1
        }
        logList.value = mockData.content
        total.value = mockData.totalElements
      } catch (error) {
        ElMessage.error('获取操作日志失败')
      } finally {
        loading.value = false
      }
    }

    // 查询
    const handleQuery = () => {
      queryParams.page = 1
      getLogList()
    }

    // 重置查询
    const resetQuery = () => {
      Object.assign(queryParams, {
        page: 1,
        size: 20,
        username: '',
        operationType: '',
        operationModule: ''
      })
      getLogList()
    }

    // 页面大小改变
    const handleSizeChange = (val) => {
      queryParams.size = val
      getLogList()
    }

    // 当前页改变
    const handleCurrentChange = (val) => {
      queryParams.page = val
      getLogList()
    }

    // 查看详情
    const handleView = (row) => {
      currentLog.value = row
      detailVisible.value = true
    }

    // 获取操作类型标签
    const getOperationTypeTag = (type) => {
      const tagMap = {
        CREATE: 'success',
        UPDATE: 'warning',
        DELETE: 'danger',
        READ: 'info'
      }
      return tagMap[type] || 'info'
    }

    // 获取操作类型文本
    const getOperationTypeText = (type) => {
      const textMap = {
        CREATE: '创建',
        UPDATE: '更新',
        DELETE: '删除',
        READ: '查看'
      }
      return textMap[type] || type
    }

    // 获取操作模块文本
    const getOperationModuleText = (module) => {
      const textMap = {
        USER_MANAGEMENT: '用户管理',
        ACTIVITY_MANAGEMENT: '活动管理',
        FEE_MANAGEMENT: '费用管理'
      }
      return textMap[module] || module
    }

    // 格式化JSON
    const formatJson = (jsonStr) => {
      try {
        return JSON.stringify(JSON.parse(jsonStr), null, 2)
      } catch {
        return jsonStr
      }
    }

    onMounted(() => {
      getLogList()
    })

    return {
      loading,
      logList,
      total,
      queryParams,
      detailVisible,
      currentLog,
      handleQuery,
      resetQuery,
      handleSizeChange,
      handleCurrentChange,
      handleView,
      getOperationTypeTag,
      getOperationTypeText,
      getOperationModuleText,
      formatJson
    }
  }
}
</script>

<style scoped>
.operation-log {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.log-detail {
  padding: 20px;
}

.json-content {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}
</style>