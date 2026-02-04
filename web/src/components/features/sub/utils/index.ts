/**
 * 格式化速度（自动转换单位）
 * 输入单位：KB/s
 */
export function formatSpeed(kbPerSec: number): string {
  if (!kbPerSec || kbPerSec === 0) return '0 KB/s'

  const units = ['KB/s', 'MB/s', 'GB/s', 'TB/s']
  let size = kbPerSec
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * 从URL自动生成订阅名称
 */
export function generateNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    if (hostname === 'raw.githubusercontent.com') {
      const parts = urlObj.pathname.split('/').filter(Boolean)
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`
      }
    }

    if (hostname === 'gist.githubusercontent.com') {
      const parts = urlObj.pathname.split('/').filter(Boolean)
      if (parts.length >= 1) {
        return parts[0] || ''
      }
    }

    const domainParts = hostname.split('.')

    if (domainParts.length >= 3) {
      return domainParts.slice(0, 2).join('.')
    }

    return hostname
  } catch {
    return ''
  }
}