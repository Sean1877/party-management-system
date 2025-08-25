import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export function formatDate(date, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format)
}

export function getRelativeTime(date) {
  const now = dayjs()
  const target = dayjs(date)
  const diffDays = now.diff(target, 'day')
  
  if (diffDays <= 7) {
    return target.fromNow()
  } else {
    return target.format('YYYY-MM-DD')
  }
}

export function isDateInRange(date, startDate, endDate) {
  const target = dayjs(date)
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  
  return target.isAfter(start) && target.isBefore(end)
}

export function getDaysFromNow(date) {
  return dayjs().diff(dayjs(date), 'day')
}

export function addDays(date, days) {
  return dayjs(date).add(days, 'day').toDate()
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isThisWeek(date) {
  return dayjs(date).isSame(dayjs(), 'week')
}

export function isThisMonth(date) {
  return dayjs(date).isSame(dayjs(), 'month')
}

export function getStartOfDay(date) {
  return dayjs(date).startOf('day').toDate()
}

export function getEndOfDay(date) {
  return dayjs(date).endOf('day').toDate()
}