// webpack 4
import type { Compiler } from 'webpack4'
import type { AppType, IBaseWebpackPlugin, InternalUserDefinedOptions, UserDefinedOptions } from '@/types'
import fs from 'node:fs'
import path from 'node:path'
import { ConcatSource, RawSource } from 'webpack-sources'
import { pluginName } from '@/constants'
import { getCompilerContext } from '@/context'
import { createDebug } from '@/debug'
import { getGroupedEntries, removeExt } from '@/utils'

const debug = createDebug()

/**
 * @name UnifiedWebpackPluginV4
 * @description webpack4 核心转义插件
 * @link https://tw.icebreaker.top/docs/intro
 */

export class UnifiedWebpackPluginV4 implements IBaseWebpackPlugin {
  options: InternalUserDefinedOptions
  appType?: AppType

  constructor(options: UserDefinedOptions = {}) {
    this.options = getCompilerContext(options)
    this.appType = this.options.appType
  }

  apply(compiler: Compiler) {
    const {
      mainCssChunkMatcher,
      disabled,
      onLoad,
      onUpdate,
      onEnd,
      onStart,
      styleHandler,
      templateHandler,
      jsHandler,
      setMangleRuntimeSet,
      runtimeLoaderPath,
      cache,
      twPatcher,
    } = this.options

    if (disabled) {
      return
    }
    twPatcher.patch()

    function getClassSetInLoader() {
      if (twPatcher.majorVersion !== 4) {
        return twPatcher.getClassSetV3()
      }
    }

    onLoad()
    const loader = runtimeLoaderPath ?? path.resolve(__dirname, './weapp-tw-runtime-loader.js')
    const isExisted = fs.existsSync(loader)
    const WeappTwRuntimeAopLoader = {
      loader,
      options: {
        getClassSet: getClassSetInLoader,
      },
      ident: null,
      type: null,
    }

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(pluginName, (_loaderContext, module) => {
        if (isExisted) {
          // @ts-ignore
          const idx = module.loaders.findIndex(x => x.loader.includes('postcss-loader'))

          if (idx > -1) {
            // @ts-ignore
            module.loaders.unshift(WeappTwRuntimeAopLoader)
          }
        }
      })
    })

    compiler.hooks.emit.tapPromise(pluginName, async (compilation) => {
      onStart()
      debug('start')

      // 第一次进来的时候为 init
      for (const chunk of compilation.chunks) {
        if (chunk.id && chunk.hash) {
          cache.calcHashValueChanged(chunk.id, chunk.hash)
        }
      }
      const assets = compilation.assets
      const entries = Object.entries(assets)
      const groupedEntries = getGroupedEntries(entries, this.options)
      // 再次 build 不转化的原因是此时 set.size 为0
      // 也就是说当开启缓存的时候没有触发 postcss,导致 tailwindcss 并没有触发
      const runtimeSet = await twPatcher.getClassSet()
      setMangleRuntimeSet(runtimeSet)
      debug('get runtimeSet, class count: %d', runtimeSet.size)
      const promises: (void | Promise<void>)[] = []
      if (Array.isArray(groupedEntries.html)) {
        for (const element of groupedEntries.html) {
          const [file, originalSource] = element
          // @ts-ignore
          const rawSource = originalSource.source().toString()

          const hash = cache.computeHash(rawSource)
          const cacheKey = file
          cache.calcHashValueChanged(cacheKey, hash)
          promises.push(
            cache.process(
              cacheKey,
              () => {
                const source = cache.get(cacheKey)
                if (source) {
                  // @ts-ignore
                  compilation.updateAsset(file, source)
                  debug('html cache hit: %s', file)
                }
                else {
                  return false
                }
              },
              // @ts-ignore
              async () => {
                const wxml = await templateHandler(rawSource, {
                  runtimeSet,
                })
                const source = new ConcatSource(wxml)
                // @ts-ignore
                compilation.updateAsset(file, source)

                onUpdate(file, rawSource, wxml)
                debug('html handle: %s', file)

                return {
                  key: cacheKey,
                  source,
                }
              },
            ),
          )
        }
      }

      if (Array.isArray(groupedEntries.js)) {
        for (const element of groupedEntries.js) {
          const [file, originalSource] = element
          const cacheKey = removeExt(file)
          promises.push(
            cache.process(
              cacheKey,
              () => {
                const source = cache.get(cacheKey)
                if (source) {
                  // @ts-ignore
                  compilation.updateAsset(file, source)
                  debug('js cache hit: %s', file)
                }
                else {
                  return false
                }
              },
              // @ts-ignore
              async () => {
                // @ts-ignore
                const rawSource = originalSource.source().toString()
                const mapFilename = `${file}.map`
                const hasMap = Boolean(assets[mapFilename])
                const { code, map } = await jsHandler(rawSource, runtimeSet, {
                  generateMap: hasMap,
                })
                const source = new ConcatSource(code)
                // @ts-ignore
                compilation.updateAsset(file, source)
                onUpdate(file, rawSource, code)
                debug('js handle: %s', file)

                if (hasMap && map) {
                  const source = new RawSource(map.toString())
                  // @ts-ignore
                  compilation.updateAsset(mapFilename, source)
                }
                return {
                  key: cacheKey,
                  source,
                }
              },
            ),
          )
        }
      }

      if (Array.isArray(groupedEntries.css)) {
        for (const element of groupedEntries.css) {
          const [file, originalSource] = element
          // @ts-ignore
          const rawSource = originalSource.source().toString()
          const hash = cache.computeHash(rawSource)
          const cacheKey = file
          cache.calcHashValueChanged(cacheKey, hash)
          promises.push(
            cache.process(
              cacheKey,
              () => {
                const source = cache.get(cacheKey)
                if (source) {
                  // @ts-ignore
                  compilation.updateAsset(file, source)
                  debug('css cache hit: %s', file)
                }
                else {
                  return false
                }
              },
              // @ts-ignore
              async () => {
                const { css } = await styleHandler(rawSource, {
                  isMainChunk: mainCssChunkMatcher(file, this.appType),
                  postcssOptions: {
                    options: {
                      from: file,
                    },
                  },
                  majorVersion: twPatcher.majorVersion,
                })
                const source = new ConcatSource(css)
                // @ts-ignore
                compilation.updateAsset(file, source)

                onUpdate(file, rawSource, css)
                debug('css handle: %s', file)

                return {
                  key: cacheKey,
                  source,
                }
              },
            ),
          )
        }
      }
      await Promise.all(promises)
      debug('end')
      onEnd()
    })
  }
}
