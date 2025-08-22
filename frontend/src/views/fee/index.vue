<template>
  <div class="fee-management">
    <div class="page-header">
      <h2>党费管理</h2>
      <p>管理党费标准和缴费记录</p>
    </div>

    <el-tabs v-model="activeTab" class="fee-tabs">
      <!-- 党费标准 -->
      <el-tab-pane label="党费标准" name="standards">
        <div class="tab-content">
          <div class="toolbar">
            <el-button type="primary" @click="showStandardDialog = true">
              <el-icon><Plus /></el-icon>
              添加标准
            </el-button>
            <el-button @click="loadStandards">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>

          <el-table :data="standards" stripe style="width: 100%">
            <el-table-column prop="name" label="标准名称" width="200" />
            <el-table-column prop="baseAmount" label="基础金额" width="120">
              <template #default="{ row }">
                ¥{{ row.baseAmount }}
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="比例(%)" width="100" />
            <el-table-column prop="minAmount" label="最低金额" width="120">
              <template #default="{ row }">
                ¥{{ row.minAmount }}
              </template>
            </el-table-column>
            <el-table-column prop="maxAmount" label="最高金额" width="120">
              <template #default="{ row }">
                ¥{{ row.maxAmount || '无限制' }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'info'">
                  {{ row.status === 'ACTIVE' ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="editStandard(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteStandard(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 缴费记录 -->
      <el-tab-pane label="缴费记录" name="payments">
        <div class="tab-content">
          <!-- 统计卡片 -->
          <el-row :gutter="20" class="stats-row">
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-number">¥{{ statistics.totalAmount }}</div>
                  <div class="stats-label">总缴费金额</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-number">{{ statistics.totalPayments }}</div>
                  <div class="stats-label">总缴费次数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-number">¥{{ statistics.currentMonthAmount }}</div>
                  <div class="stats-label">本月缴费</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-number">{{ statistics.unpaidCount }}</div>
                  <div class="stats-label">未缴费人数</div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <div class="toolbar">
            <el-button type="primary" @click="showPaymentDialog = true">
              <el-icon><Plus /></el-icon>
              添加缴费记录
            </el-button>
            <el-button @click="loadPayments">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
            <el-button @click="exportPayments">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </div>

          <el-table :data="payments" stripe style="width: 100%">
            <el-table-column prop="memberName" label="党员姓名" width="120" />
            <el-table-column prop="standardName" label="缴费标准" width="150" />
            <el-table-column prop="amount" label="缴费金额" width="120">
              <template #default="{ row }">
                ¥{{ row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="paymentDate" label="缴费日期" width="120">
              <template #default="{ row }">
                {{ formatDate(row.paymentDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="缴费方式" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getPaymentStatusType(row.status)">
                  {{ getPaymentStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="editPayment(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deletePayment(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 党费标准对话框 -->
    <el-dialog 
      v-model="showStandardDialog" 
      :title="standardForm.id ? '编辑党费标准' : '添加党费标准'"
      width="600px"
    >
      <el-form :model="standardForm" :rules="standardRules" ref="standardFormRef" label-width="100px">
        <el-form-item label="标准名称" prop="name">
          <el-input v-model="standardForm.name" placeholder="请输入标准名称" />
        </el-form-item>
        <el-form-item label="基础金额" prop="baseAmount">
          <el-input-number v-model="standardForm.baseAmount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="比例(%)" prop="percentage">
          <el-input-number v-model="standardForm.percentage" :min="0" :max="100" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="最低金额" prop="minAmount">
          <el-input-number v-model="standardForm.minAmount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="最高金额" prop="maxAmount">
          <el-input-number v-model="standardForm.maxAmount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="standardForm.status" style="width: 100%">
            <el-option label="启用" value="ACTIVE" />
            <el-option label="禁用" value="INACTIVE" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="standardForm.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showStandardDialog = false">取消</el-button>
        <el-button type="primary" @click="saveStandard">保存</el-button>
      </template>
    </el-dialog>

    <!-- 缴费记录对话框 -->
    <el-dialog 
      v-model="showPaymentDialog" 
      :title="paymentForm.id ? '编辑缴费记录' : '添加缴费记录'"
      width="600px"
    >
      <el-form :model="paymentForm" :rules="paymentRules" ref="paymentFormRef" label-width="100px">
        <el-form-item label="党员" prop="memberId">
          <el-select v-model="paymentForm.memberId" filterable placeholder="请选择党员" style="width: 100%">
            <el-option 
              v-for="member in members" 
              :key="member.id" 
              :label="member.realName" 
              :value="member.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费标准" prop="standardId">
          <el-select v-model="paymentForm.standardId" placeholder="请选择缴费标准" style="width: 100%">
            <el-option 
              v-for="standard in activeStandards" 
              :key="standard.id" 
              :label="standard.name" 
              :value="standard.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费金额" prop="amount">
          <el-input-number v-model="paymentForm.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="缴费日期" prop="paymentDate">
          <el-date-picker 
            v-model="paymentForm.paymentDate" 
            type="date" 
            placeholder="请选择缴费日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="缴费方式" prop="paymentMethod">
          <el-select v-model="paymentForm.paymentMethod" placeholder="请选择缴费方式" style="width: 100%">
            <el-option label="现金" value="CASH" />
            <el-option label="银行转账" value="BANK_TRANSFER" />
            <el-option label="支付宝" value="ALIPAY" />
            <el-option label="微信" value="WECHAT" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="paymentForm.status" style="width: 100%">
            <el-option label="已缴费" value="PAID" />
            <el-option label="待确认" value="PENDING" />
            <el-option label="已退款" value="REFUNDED" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="paymentForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPaymentDialog = false">取消</el-button>
        <el-button type="primary" @click="savePayment">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Download } from '@element-plus/icons-vue'
import { formatDate } from '@/utils'

// 响应式数据
const activeTab = ref('standards')
const showStandardDialog = ref(false)
const showPaymentDialog = ref(false)
const standardFormRef = ref()
const paymentFormRef = ref()

// 党费标准数据
const standards = ref([])
const standardForm = reactive({
  id: null,
  name: '',
  baseAmount: 0,
  percentage: 0,
  minAmount: 0,
  maxAmount: null,
  status: 'ACTIVE',
  description: ''
})

// 缴费记录数据
const payments = ref([])
const paymentForm = reactive({
  id: null,
  memberId: null,
  standardId: null,
  amount: 0,
  paymentDate: new Date(),
  paymentMethod: 'CASH',
  status: 'PAID',
  remark: ''
})

// 统计数据
const statistics = ref({
  totalAmount: 0,
  totalPayments: 0,
  currentMonthAmount: 0,
  unpaidCount: 0
})

// 党员列表
const members = ref([])

// 计算属性
const activeStandards = computed(() => {
  // 确保standards.value是数组，防止 'data2 is not iterable' 错误
  const standardsData = Array.isArray(standards.value) ? standards.value : []
  return standardsData.filter(s => s.status === 'ACTIVE')
})

// 表单验证规则
const standardRules = {
  name: [{ required: true, message: '请输入标准名称', trigger: 'blur' }],
  baseAmount: [{ required: true, message: '请输入基础金额', trigger: 'blur' }],
  percentage: [{ required: true, message: '请输入比例', trigger: 'blur' }],
  minAmount: [{ required: true, message: '请输入最低金额', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const paymentRules = {
  memberId: [{ required: true, message: '请选择党员', trigger: 'change' }],
  standardId: [{ required: true, message: '请选择缴费标准', trigger: 'change' }],
  amount: [{ required: true, message: '请输入缴费金额', trigger: 'blur' }],
  paymentDate: [{ required: true, message: '请选择缴费日期', trigger: 'change' }],
  paymentMethod: [{ required: true, message: '请选择缴费方式', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 方法
const loadStandards = async () => {
  try {
    // 模拟API调用
    const responseData = [
      {
        id: 1,
        name: '基础党费标准',
        baseAmount: 100,
        percentage: 0.5,
        minAmount: 2,
        maxAmount: 1000,
        status: 'ACTIVE',
        description: '按月收入0.5%缴纳，最低2元，最高1000元'
      },
      {
        id: 2,
        name: '学生党费标准',
        baseAmount: 10,
        percentage: 0,
        minAmount: 2,
        maxAmount: 10,
        status: 'ACTIVE',
        description: '学生党员固定缴费标准'
      }
    ]
    // 确保数据是数组，防止 'data2 is not iterable' 错误
    if (Array.isArray(responseData)) {
      standards.value = responseData
    } else {
      standards.value = []
    }
  } catch (error) {
    ElMessage.error('加载党费标准失败')
    // 确保在错误情况下数据也是数组
    standards.value = []
  }
}

const loadPayments = async () => {
  try {
    // 模拟API调用
    const responseData = [
      {
        id: 1,
        memberName: '张三',
        standardName: '基础党费标准',
        amount: 50,
        paymentDate: '2024-01-15',
        paymentMethod: 'BANK_TRANSFER',
        status: 'PAID',
        remark: '按时缴费'
      },
      {
        id: 2,
        memberName: '李四',
        standardName: '学生党费标准',
        amount: 10,
        paymentDate: '2024-01-10',
        paymentMethod: 'CASH',
        status: 'PAID',
        remark: ''
      }
    ]
    
    // 确保数据是数组，防止 'data2 is not iterable' 错误
    if (Array.isArray(responseData)) {
      payments.value = responseData
    } else {
      payments.value = []
    }
    
    // 加载统计数据
    statistics.value = {
      totalAmount: 15680,
      totalPayments: 156,
      currentMonthAmount: 2340,
      unpaidCount: 8
    }
  } catch (error) {
    ElMessage.error('加载缴费记录失败')
    // 确保在错误情况下数据也是数组
    payments.value = []
  }
}

const loadMembers = async () => {
  try {
    // 模拟API调用
    const responseData = [
      { id: 1, realName: '张三' },
      { id: 2, realName: '李四' },
      { id: 3, realName: '王五' }
    ]
    // 确保数据是数组，防止 'data2 is not iterable' 错误
    if (Array.isArray(responseData)) {
      members.value = responseData
    } else {
      members.value = []
    }
  } catch (error) {
    ElMessage.error('加载党员列表失败')
    // 确保在错误情况下数据也是数组
    members.value = []
  }
}

const editStandard = (row) => {
  Object.assign(standardForm, row)
  showStandardDialog.value = true
}

const saveStandard = async () => {
  try {
    await standardFormRef.value.validate()
    // 模拟API调用
    ElMessage.success('保存成功')
    showStandardDialog.value = false
    resetStandardForm()
    loadStandards()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const deleteStandard = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个党费标准吗？', '确认删除', {
      type: 'warning'
    })
    // 模拟API调用
    ElMessage.success('删除成功')
    loadStandards()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const editPayment = (row) => {
  Object.assign(paymentForm, row)
  showPaymentDialog.value = true
}

const savePayment = async () => {
  try {
    await paymentFormRef.value.validate()
    // 模拟API调用
    ElMessage.success('保存成功')
    showPaymentDialog.value = false
    resetPaymentForm()
    loadPayments()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const deletePayment = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条缴费记录吗？', '确认删除', {
      type: 'warning'
    })
    // 模拟API调用
    ElMessage.success('删除成功')
    loadPayments()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const exportPayments = () => {
  ElMessage.info('导出功能开发中...')
}

const resetStandardForm = () => {
  Object.assign(standardForm, {
    id: null,
    name: '',
    baseAmount: 0,
    percentage: 0,
    minAmount: 0,
    maxAmount: null,
    status: 'ACTIVE',
    description: ''
  })
}

const resetPaymentForm = () => {
  Object.assign(paymentForm, {
    id: null,
    memberId: null,
    standardId: null,
    amount: 0,
    paymentDate: new Date(),
    paymentMethod: 'CASH',
    status: 'PAID',
    remark: ''
  })
}

const getPaymentStatusType = (status) => {
  const statusMap = {
    'PAID': 'success',
    'PENDING': 'warning',
    'REFUNDED': 'info'
  }
  return statusMap[status] || 'info'
}

const getPaymentStatusText = (status) => {
  const statusMap = {
    'PAID': '已缴费',
    'PENDING': '待确认',
    'REFUNDED': '已退款'
  }
  return statusMap[status] || '未知'
}

// 生命周期
onMounted(() => {
  loadStandards()
  loadPayments()
  loadMembers()
})
</script>

<style scoped>
.fee-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.page-header p {
  margin: 0;
  color: #909399;
}

.fee-tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.tab-content {
  margin-top: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  text-align: center;
}

.stats-content {
  padding: 10px;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}
</style>