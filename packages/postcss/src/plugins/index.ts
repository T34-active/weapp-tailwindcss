import type { AcceptedPlugin } from 'postcss'
import type { IStyleHandlerOptions } from '../types'
import postcssPresetEnv from 'postcss-preset-env'
import postcssRem2rpx from 'postcss-rem-to-responsive-pixel'
import { createContext } from './ctx'
import { postcssWeappTailwindcssPostPlugin } from './post'
import { postcssWeappTailwindcssPrePlugin } from './pre'
/**
 * 根据提供的选项生成一组 PostCSS 插件。
 * @param options - 样式处理器选项，包含 PostCSS 插件和其他配置。
 * @returns AcceptedPlugin[] - 生成的 PostCSS 插件数组。
 */
export function getPlugins(options: IStyleHandlerOptions) {
  const ctx = createContext()
  options.ctx = ctx
  const plugins: AcceptedPlugin[] = [
    ...(options.postcssOptions?.plugins ?? []),
    postcssWeappTailwindcssPrePlugin(options),
    postcssPresetEnv({
      features: {
        'cascade-layers': true,
        'is-pseudo-class': {
          specificityMatchingName: 'weapp-tw-ig',
        },
        'oklab-function': true,
        'color-mix': true,
        'custom-properties': false,
      },
      autoprefixer: {
        add: false,
      },
    }),
  ]
  if (options.rem2rpx) {
    plugins.push(
      postcssRem2rpx(
        typeof options.rem2rpx === 'object'
          ? options.rem2rpx
          : {
              rootValue: 32,
              propList: ['*'],
              transformUnit: 'rpx',
            },
      ),
    )
  }
  plugins.push(postcssWeappTailwindcssPostPlugin(options))
  return plugins
}

export { postcssWeappTailwindcssPostPlugin } from './post'
export { postcssWeappTailwindcssPrePlugin } from './pre'

export { default as postcssIsPseudoClass } from '@csstools/postcss-is-pseudo-class'
export { default as postcssRem2rpx } from 'postcss-rem-to-responsive-pixel'
