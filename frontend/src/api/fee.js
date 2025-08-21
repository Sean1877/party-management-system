import request from '@/utils/request'

// 获取党费标准列表
export function getFeeStandards(params) {
  return request({
    url: '/fee/standards',
    method: 'get',
    params
  })
}

// 创建党费标准
export function createFeeStandard(data) {
  return request({
    url: '/fee/standards',
    method: 'post',
    data
  })
}

// 更新党费标准
export function updateFeeStandard(id, data) {
  return request({
    url: `/fee/standards/${id}`,
    method: 'put',
    data
  })
}

// 删除党费标准
export function deleteFeeStandard(id) {
  return request({
    url: `/fee/standards/${id}`,
    method: 'delete'
  })
}

// 获取党费缴费记录
export function getFeePayments(params) {
  return request({
    url: '/fee/payments',
    method: 'get',
    params
  })
}

// 创建党费缴费记录
export function createFeePayment(data) {
  return request({
    url: '/fee/payments',
    method: 'post',
    data
  })
}

// 更新党费缴费记录
export function updateFeePayment(id, data) {
  return request({
    url: `/fee/payments/${id}`,
    method: 'put',
    data
  })
}

// 删除党费缴费记录
export function deleteFeePayment(id) {
  return request({
    url: `/fee/payments/${id}`,
    method: 'delete'
  })
}

// 导出党费数据
export function exportFeeData(params) {
  return request({
    url: '/fee/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}