import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

// 配置dayjs
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(duration)

/**
 * 格式化日期
 * @param {string|Date} date 日期
 * @param {string} format 格式
 * @returns {string}
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 格式化相对时间
 * @param {string|Date} date 日期
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return ''
  return dayjs(date).fromNow()
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 是否立即执行
 * @returns {Function}
 */
export function debounce(func, wait, immediate) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间间隔
 * @returns {Function}
 */
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 * @returns {any}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 生成随机字符串
 * @param {number} length 长度
 * @returns {string}
 */
export function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean}
 */
export function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean}
 */
export function validateEmail(email) {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 * @returns {boolean}
 */
export function validateIdCard(idCard) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 获取性别文本
 * @param {number} gender 性别代码
 * @returns {string}
 */
export function getGenderText(gender) {
  const genderMap = {
    0: '男',
    1: '女',
    2: '其他'
  }
  return genderMap[gender] || '未知'
}

/**
 * 获取党员状态文本
 * @param {number} status 状态代码
 * @returns {string}
 */
export function getPartyMemberStatusText(status) {
  const statusMap = {
    0: '入党积极分子',
    1: '发展对象',
    2: '预备党员',
    3: '正式党员',
    4: '转出',
    5: '退党',
    6: '开除党籍'
  }
  return statusMap[status] || '未知'
}

/**
 * 获取组织类型文本
 * @param {number} type 类型代码
 * @returns {string}
 */
export function getOrganizationTypeText(type) {
  const typeMap = {
    0: '党委',
    1: '党总支',
    2: '党支部',
    3: '党小组'
  }
  return typeMap[type] || '未知'
}

/**
 * 获取活动类型文本
 * @param {number} type 类型代码
 * @returns {string}
 */
export function getActivityTypeText(type) {
  const typeMap = {
    0: '学习教育',
    1: '组织生活',
    2: '志愿服务',
    3: '文体活动',
    4: '其他活动'
  }
  return typeMap[type] || '未知'
}

/**
 * 获取活动状态文本
 * @param {number} status 状态代码
 * @returns {string}
 */
export function getActivityStatusText(status) {
  const statusMap = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '已取消'
  }
  return statusMap[status] || '未知'
}

/**
 * 下载文件
 * @param {string} url 文件URL
 * @param {string} filename 文件名
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 复制到剪贴板
 * @param {string} text 要复制的文本
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (err) {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}