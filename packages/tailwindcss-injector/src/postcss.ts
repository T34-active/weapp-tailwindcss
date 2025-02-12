import type { PluginCreator } from 'postcss'
import type { Config } from 'tailwindcss'
import type { Options } from './types'
import postcss from 'postcss'
import set from 'set-value'
import tailwindcss from 'tailwindcss'
import { loadConfig } from 'tailwindcss-config'
import { getConfig } from './config'
import { postcssPlugin } from './constants'
import { regExpTest, removeFileExtension } from './utils'
import { getDepFiles } from './wxml'

// function isObject(obj: any): obj is object {
//   return typeof obj === 'object' && obj !== null
// }
export type {
  Options,
}

const creator: PluginCreator<Partial<Options>> = (options) => {
  const { config, filter, directiveParams, cwd, extensions, insertAfterAtRulesNames, insertAfterComments } = getConfig(options)

  const extensionsGlob = `{${extensions.join(',')}}`

  return {
    postcssPlugin,
    plugins: [
      {
        postcssPlugin: `${postcssPlugin}:post`,
        async Once(root, helpers) {
          if (filter(root.source?.input)) {
            const atruleLastIndex = root.nodes.findLastIndex(x => x.type === 'atrule' && insertAfterAtRulesNames.includes(x.name))
            const commentLastIndex = root.nodes.findLastIndex(x => x.type === 'comment' && regExpTest(insertAfterComments, x.text))
            const lastIndex = Math.max(atruleLastIndex, commentLastIndex)
            for (const params of directiveParams) {
              const node = root.nodes.find(x => x.type === 'atrule' && x.params === params)
              if (!node) {
                const atRule = helpers.atRule({ name: 'tailwind', params })
                if (lastIndex < 0) {
                  root.prepend(atRule)
                }
                else {
                  root.insertAfter(lastIndex, atRule)
                }
              }
            }

            const cfg = typeof config === 'function' ? config(root.source?.input) : config
            let tailwindcssConfig: Config | undefined
            if (typeof cfg === 'string') {
              const result = await loadConfig({
                cwd,
                config: cfg,
              })
              if (result) {
                tailwindcssConfig = result.config
              }
            }
            else {
              tailwindcssConfig = (cfg ?? {
                content: [],
              }) as Config
            }

            if (tailwindcssConfig && root.source?.input && root.source.input.file) {
              const basename = removeFileExtension(root.source.input.file)
              set(tailwindcssConfig, 'content', [
                `${basename}.${extensionsGlob}`,
              ])

              // 分析模板
              const deps = await getDepFiles(`${basename}.wxml`)
              for (const dep of deps) {
                if (Array.isArray(tailwindcssConfig.content)) {
                  tailwindcssConfig.content.push(`${removeFileExtension(dep)}.${extensionsGlob}`)
                }
              }

              await postcss([
                tailwindcss(tailwindcssConfig),
              ]).process(root, {
                from: root.source.input.file,
              }).async()
            }
          }
        },
      },
    ],
  }
}
creator.postcss = true

export default creator
