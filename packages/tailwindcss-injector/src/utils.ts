import crypto from 'node:crypto'
import { defu, defuOverrideArray, isRegexp, regExpTest } from '@weapp-tailwindcss/shared'
import path from 'pathe'

export {
  defu,
  defuOverrideArray,
  isRegexp,
  regExpTest,
}

export function removeFileExtension(filePath: string) {
  if (!filePath) {
    // 如果路径为空，直接返回空字符串
    return ''
  }
  let baseName = path.basename(filePath) // 获取基础文件名（包含所有扩展名）
  let ext = path.extname(baseName) // 获取当前文件名的扩展名

  // 持续移除扩展名，直到没有扩展名
  while (ext) {
    baseName = baseName.slice(0, -ext.length) // 去掉最后的扩展名部分
    ext = path.extname(baseName) // 重新获取新的扩展名
  }

  const dir = path.dirname(filePath) // 获取目录名
  return path.join(dir, baseName) // 拼接路径
}

/**
 * 计算字符串的 MD5 哈希值
 * @param {string} input - 要计算哈希的字符串
 * @returns {string} - 字符串的 MD5 哈希值
 */
export function md5(input: crypto.BinaryLike) {
  // 使用 crypto 模块创建 MD5 哈希
  const hash = crypto.createHash('md5')
  hash.update(input) // 更新哈希内容
  return hash.digest('hex') // 返回哈希值
}
