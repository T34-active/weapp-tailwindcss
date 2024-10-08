import type { UserDefinedOptions } from './types'
import { noop } from './utils'
import { SimpleMappingChars2String } from './escape'

export const defaultOptions: UserDefinedOptions = {
  cssMatcher: file => /.+\.(?:wx|ac|jx|tt|q|c|ty)ss$/.test(file),
  htmlMatcher: file => /.+\.(?:(?:wx|ax|jx|ks|tt|q|ty)ml|swan)$/.test(file),
  jsMatcher: (file) => {
    if (file.includes('node_modules')) {
      return false
    }
    // remove jsx tsx ts case
    return /.+\.[cm]?js?$/.test(file)
  },
  mainCssChunkMatcher: (file, appType) => {
    switch (appType) {
      case 'uni-app': {
        return /^common\/main/.test(file)
      }
      case 'uni-app-vite': {
        // vite 旧版本和新版本对应的样式文件
        return file.startsWith('app') || /^common\/main/.test(file)
      }
      case 'mpx': {
        return file.startsWith('app')
      }
      case 'taro': {
        // app.wxss & app-origin.wxss
        return file.startsWith('app')
      }
      case 'remax': {
        return file.startsWith('app')
      }
      case 'rax': {
        return file.startsWith('bundle')
      }
      case 'native': {
        return file.startsWith('app')
      }
      case 'kbone': {
        return /^(?:common\/)?miniprogram-app/.test(file)
      }
      default: {
        return true
      }
    }
  },
  wxsMatcher: () => {
    return false
  },
  // https://tailwindcss.com/docs/preflight#border-styles-are-reset-globally
  cssPreflight: {
    'box-sizing': 'border-box',
    'border-width': '0',
    'border-style': 'solid',
    'border-color': 'currentColor',
  },

  disabled: false,
  customRuleCallback: noop,
  onLoad: noop,
  onStart: noop,
  onEnd: noop,
  onUpdate: noop,

  customAttributes: {},
  customReplaceDictionary: SimpleMappingChars2String,
  appType: undefined,
  arbitraryValues: {
    allowDoubleQuotes: false,
  },
  cssChildCombinatorReplaceValue: ['view'],
  inlineWxs: false,
  injectAdditionalCssVarScope: false,
  jsPreserveClass: (keyword) => {
    /**
     * 默认保留 keyword
     */
    if (keyword === '*') {
      return true
    }
    return false
  },
  disabledDefaultTemplateHandler: false,
  cssSelectorReplacement: {
    root: 'page',
    universal: ['view', 'text'],
  },
  babelParserOptions: {
    sourceType: 'unambiguous',
  },
  postcssOptions: {},
  cssRemoveHoverPseudoClass: true,
  // jsAstTool: 'ast-grep'
}
