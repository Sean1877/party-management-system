<template>
  <div class="statistics">
    <div class="page-header">
      <h2>统计分析</h2>
      <p>党建管理系统数据统计与分析</p>
      <div class="header-actions">
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
        <el-button type="primary" @click="exportReport">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="statistics-tabs">
      <!-- 总体概览 -->
      <el-tab-pane label="总体概览" name="overview">
        <div class="tab-content">
          <!-- 统计卡片 -->
          <el-row :gutter="20" class="stats-cards">
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-icon primary">
                    <el-icon><User /></el-icon>
                  </div>
                  <div class="stats-info">
                    <div class="stats-number">{{ overallStats.totalMembers }}</div>
                    <div class="stats-label">党员总数</div>
                    <div class="stats-change positive">+{{ overallStats.newMembersThisMonth }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-icon success">
                    <el-icon><OfficeBuilding /></el-icon>
                  </div>
                  <div class="stats-info">
                    <div class="stats-number">{{ overallStats.totalOrganizations }}</div>
                    <div class="stats-label">组织数量</div>
                    <div class="stats-change positive">+{{ overallStats.newOrganizationsThisMonth }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-icon warning">
                    <el-icon><Calendar /></el-icon>
                  </div>
                  <div class="stats-info">
                    <div class="stats-number">{{ overallStats.totalActivities }}</div>
                    <div class="stats-label">活动总数</div>
                    <div class="stats-change positive">+{{ overallStats.newActivitiesThisMonth }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-content">
                  <div class="stats-icon danger">
                    <el-icon><Money /></el-icon>
                  </div>
                  <div class="stats-info">
                    <div class="stats-number">¥{{ overallStats.totalFeeAmount }}</div>
                    <div class="stats-label">党费总额</div>
                    <div class="stats-change positive">+¥{{ overallStats.feeAmountThisMonth }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 图表区域 -->
          <el-row :gutter="20" class="charts-row">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>党员发展趋势</span>
                </template>
                <div class="chart-container">
                  <v-chart :option="memberTrendOption" style="height: 300px;" />
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>党费收缴情况</span>
                </template>
                <div class="chart-container">
                  <v-chart :option="feeCollectionOption" style="height: 300px;" />
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="charts-row">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>组织分布</span>
                </template>
                <div class="chart-container">
                  <v-chart :option="organizationDistributionOption" style="height: 300px;" />
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>活动参与度</span>
                </template>
                <div class="chart-container">
                  <v-chart :option="activityTrendOption" style="height: 300px;" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 组织统计 -->
      <el-tab-pane label="组织统计" name="organization">
        <div class="tab-content">
          <el-table :data="organizationStats" stripe style="width: 100%">
            <el-table-column prop="name" label="组织名称" width="200" />
            <el-table-column prop="memberCount" label="党员数量" width="120" />
            <el-table-column prop="activityCount" label="活动数量" width="120" />
            <el-table-column prop="feeAmount" label="党费金额" width="120">
              <template #default="{ row }">
                ¥{{ row.feeAmount }}
              </template>
            </el-table-column>
            <el-table-column prop="activeRate" label="活跃度" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.activeRate" :stroke-width="8" />
              </template>
            </el-table-column>
            <el-table-column prop="lastActivityDate" label="最近活动" width="150">
              <template #default="{ row }">
                {{ formatDate(row.lastActivityDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'info'">
                  {{ row.status === 'ACTIVE' ? '活跃' : '不活跃' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 党员活动 -->
      <el-tab-pane label="党员活动" name="member">
        <div class="tab-content">
          <el-table :data="memberActivityStats" stripe style="width: 100%">
            <el-table-column prop="name" label="党员姓名" width="120" />
            <el-table-column prop="organization" label="所属组织" width="150" />
            <el-table-column prop="activityCount" label="参与活动" width="120" />
            <el-table-column prop="feeStatus" label="缴费状态" width="120">
              <template #default="{ row }">
                <el-tag :type="row.feeStatus === 'PAID' ? 'success' : 'warning'">
                  {{ row.feeStatus === 'PAID' ? '已缴费' : '未缴费' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastActivityDate" label="最近参与" width="150">
              <template #default="{ row }">
                {{ formatDate(row.lastActivityDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="joinDate" label="入党时间" width="150">
              <template #default="{ row }">
                {{ formatDate(row.joinDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="activeScore" label="活跃度评分" width="120">
              <template #default="{ row }">
                <el-rate v-model="row.activeScore" disabled show-score />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 党费分析 -->
      <el-tab-pane label="党费分析" name="fee">
        <div class="tab-content">
          <!-- 党费统计卡片 -->
          <el-row :gutter="20" class="fee-stats">
            <el-col :span="8">
              <el-card class="fee-stats-card">
                <div class="fee-stats-content">
                  <div class="fee-stats-number">¥{{ feeStats.totalAmount }}</div>
                  <div class="fee-stats-label">总收缴金额</div>
                  <div class="fee-stats-detail">较上月增长 {{ feeStats.growthRate }}%</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="fee-stats-card">
                <div class="fee-stats-content">
                  <div class="fee-stats-number">{{ feeStats.paidCount }}</div>
                  <div class="fee-stats-label">已缴费人数</div>
                  <div class="fee-stats-detail">缴费率 {{ feeStats.paymentRate }}%</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="fee-stats-card">
                <div class="fee-stats-content">
                  <div class="fee-stats-number">{{ feeStats.unpaidCount }}</div>
                  <div class="fee-stats-label">未缴费人数</div>
                  <div class="fee-stats-detail">需要催缴</div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 党费趋势图表 -->
          <el-row :gutter="20" class="fee-charts">
            <el-col :span="24">
              <el-card>
                <template #header>
                  <span>党费收缴趋势</span>
                </template>
                <div class="chart-container">
                  <v-chart :option="feeTrendOption" style="height: 400px;" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Download, User, OfficeBuilding, Calendar, Money } from '@element-plus/icons-vue'
import { formatDate } from '@/utils'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 响应式数据
const activeTab = ref('overview')

// 总体统计数据
const overallStats = ref({
  totalMembers: 0,
  totalOrganizations: 0,
  totalActivities: 0,
  totalFeeAmount: 0,
  newMembersThisMonth: 0,
  newOrganizationsThisMonth: 0,
  newActivitiesThisMonth: 0,
  feeAmountThisMonth: 0
})

// 组织统计数据
const organizationStats = ref([])

// 党员活动统计数据
const memberActivityStats = ref([])

// 党费统计数据
const feeStats = ref({
  totalAmount: 0,
  paidCount: 0,
  unpaidCount: 0,
  paymentRate: 0,
  growthRate: 0
})

// 图表配置
const memberTrendOption = ref({
  title: {
    text: '党员发展趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增党员', '累计党员'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增党员',
      type: 'bar',
      data: [12, 8, 15, 10, 18, 22]
    },
    {
      name: '累计党员',
      type: 'line',
      data: [120, 128, 143, 153, 171, 193]
    }
  ]
})

const feeCollectionOption = ref({
  title: {
    text: '党费收缴情况',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['应收金额', '实收金额'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '应收金额',
      type: 'bar',
      data: [2400, 2600, 2800, 2500, 2900, 3100]
    },
    {
      name: '实收金额',
      type: 'bar',
      data: [2200, 2400, 2600, 2300, 2700, 2900]
    }
  ]
})

const organizationDistributionOption = ref({
  title: {
    text: '组织分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '组织分布',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 35, name: '机关党支部' },
        { value: 28, name: '企业党支部' },
        { value: 22, name: '学校党支部' },
        { value: 15, name: '社区党支部' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const activityTrendOption = ref({
  title: {
    text: '活动参与度',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['活动数量', '参与人次'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: [
    {
      type: 'value',
      name: '活动数量'
    },
    {
      type: 'value',
      name: '参与人次'
    }
  ],
  series: [
    {
      name: '活动数量',
      type: 'bar',
      data: [8, 12, 15, 10, 18, 20]
    },
    {
      name: '参与人次',
      type: 'line',
      yAxisIndex: 1,
      data: [120, 180, 225, 150, 270, 300]
    }
  ]
})

const feeTrendOption = ref({
  title: {
    text: '党费收缴趋势分析',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['应收金额', '实收金额', '缴费率'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: [
    {
      type: 'value',
      name: '金额(元)'
    },
    {
      type: 'value',
      name: '缴费率(%)',
      max: 100
    }
  ],
  series: [
    {
      name: '应收金额',
      type: 'bar',
      data: [2400, 2600, 2800, 2500, 2900, 3100, 3200, 3000, 3300, 3500, 3400, 3600]
    },
    {
      name: '实收金额',
      type: 'bar',
      data: [2200, 2400, 2600, 2300, 2700, 2900, 3000, 2800, 3100, 3300, 3200, 3400]
    },
    {
      name: '缴费率',
      type: 'line',
      yAxisIndex: 1,
      data: [92, 92, 93, 92, 93, 94, 94, 93, 94, 94, 94, 94]
    }
  ]
})

// 方法
const loadOverallStats = async () => {
  try {
    // 模拟API调用
    overallStats.value = {
      totalMembers: 193,
      totalOrganizations: 12,
      totalActivities: 85,
      totalFeeAmount: 32500,
      newMembersThisMonth: 8,
      newOrganizationsThisMonth: 1,
      newActivitiesThisMonth: 5,
      feeAmountThisMonth: 2800
    }
  } catch (error) {
    ElMessage.error('加载总体统计数据失败')
  }
}

const loadOrganizationStats = async () => {
  try {
    // 模拟API调用
    organizationStats.value = [
      {
        id: 1,
        name: '机关第一党支部',
        memberCount: 35,
        activityCount: 12,
        feeAmount: 8500,
        activeRate: 85,
        lastActivityDate: '2024-01-15',
        status: 'ACTIVE'
      },
      {
        id: 2,
        name: '企业党支部',
        memberCount: 28,
        activityCount: 8,
        feeAmount: 6800,
        activeRate: 75,
        lastActivityDate: '2024-01-10',
        status: 'ACTIVE'
      },
      {
        id: 3,
        name: '学校党支部',
        memberCount: 22,
        activityCount: 15,
        feeAmount: 4400,
        activeRate: 90,
        lastActivityDate: '2024-01-18',
        status: 'ACTIVE'
      }
    ]
  } catch (error) {
    ElMessage.error('加载组织统计数据失败')
  }
}

const loadMemberActivityStats = async () => {
  try {
    // 模拟API调用
    memberActivityStats.value = [
      {
        id: 1,
        name: '张三',
        organization: '机关第一党支部',
        activityCount: 8,
        feeStatus: 'PAID',
        lastActivityDate: '2024-01-15',
        joinDate: '2020-05-10',
        activeScore: 4
      },
      {
        id: 2,
        name: '李四',
        organization: '企业党支部',
        activityCount: 5,
        feeStatus: 'UNPAID',
        lastActivityDate: '2024-01-08',
        joinDate: '2019-03-15',
        activeScore: 3
      },
      {
        id: 3,
        name: '王五',
        organization: '学校党支部',
        activityCount: 12,
        feeStatus: 'PAID',
        lastActivityDate: '2024-01-18',
        joinDate: '2021-07-20',
        activeScore: 5
      }
    ]
  } catch (error) {
    ElMessage.error('加载党员活动统计数据失败')
  }
}

const loadFeeStats = async () => {
  try {
    // 模拟API调用
    feeStats.value = {
      totalAmount: 32500,
      paidCount: 178,
      unpaidCount: 15,
      paymentRate: 92,
      growthRate: 8.5
    }
  } catch (error) {
    ElMessage.error('加载党费统计数据失败')
  }
}

const refreshData = async () => {
  await Promise.all([
    loadOverallStats(),
    loadOrganizationStats(),
    loadMemberActivityStats(),
    loadFeeStats()
  ])
  ElMessage.success('数据刷新成功')
}

const exportReport = () => {
  ElMessage.info('导出报告功能开发中...')
}

// 窗口大小变化处理
const handleResize = () => {
  // 触发图表重绘
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)
}

// 生命周期
onMounted(async () => {
  // 等待 DOM 完全渲染后再初始化图表
  await nextTick()
  // 延迟一小段时间确保容器尺寸正确
  setTimeout(() => {
    refreshData()
  }, 100)
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.statistics {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.header-actions {
  display: flex;
  gap: 10px;
}

.statistics-tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.tab-content {
  margin-top: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  border-radius: 8px;
  overflow: hidden;
}

.stats-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.stats-icon.primary {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.stats-icon.success {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.stats-icon.warning {
  background: linear-gradient(135deg, #e6a23c, #ebb563);
}

.stats-icon.danger {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stats-change {
  font-size: 12px;
  color: #67c23a;
}

.stats-change.positive {
  color: #67c23a;
}

.stats-change.negative {
  color: #f56c6c;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 300px;
  min-width: 400px;
  min-height: 300px;
  position: relative;
  overflow: hidden;
}

.fee-stats {
  margin-bottom: 20px;
}

.fee-stats-card {
  text-align: center;
  border-radius: 8px;
}

.fee-stats-content {
  padding: 20px;
}

.fee-stats-number {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.fee-stats-label {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
}

.fee-stats-detail {
  font-size: 14px;
  color: #909399;
}

.fee-charts {
  margin-top: 20px;
}
</style>