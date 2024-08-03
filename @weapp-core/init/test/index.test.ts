import path from 'pathe'
import fs from 'fs-extra'
import { updatePackageJson, updateProjectConfig } from '@/index'

const appsDir = path.resolve(__dirname, '../../../apps')
const fixturesDir = path.resolve(__dirname, './fixtures')
describe('index', () => {
  it.each(['vite-native', 'vite-native-skyline', 'vite-native-ts', 'vite-native-ts-skyline'])('%s', (name) => {
    const root = path.resolve(appsDir, name)
    const p0 = path.resolve(fixturesDir, name, 'package.json')
    updatePackageJson({ root, dest: p0, command: 'weapp-vite' })
    const p1 = path.resolve(fixturesDir, name, 'project.config.json')
    updateProjectConfig({ root, dest: p1 })
    expect(fs.existsSync(p0)).toBe(true)
    expect(fs.existsSync(p1)).toBe(true)
  })
})