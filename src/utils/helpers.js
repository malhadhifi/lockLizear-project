import { format } from 'date-fns'
import { DATE_FORMATS } from '../constants'

/**
 * Format date for display
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return '-'
  try {
    return format(new Date(date), formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Format file size (bytes to human readable)
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Check if user has specific role
 */
export const hasRole = (user, role) => {
  if (!user || !user.role) return false
  return user.role === role
}

/**
 * Get user status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-success-500',
    inactive: 'bg-gray-500',
    suspended: 'bg-danger-500',
    expired: 'bg-warning-500',
  }
  return colors[status] || 'bg-gray-500'
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

/**
 * Download file from blob
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
