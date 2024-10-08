<p align="center">

<a href="https://weapp-tw.icebreaker.top">

<img src="./assets/logo.png" alt="weapp-tailwindcss-logo" width="128">
</a>

<br>

<h1 align="center">weapp-tailwindcss</h1>

</p>

> [简体中文(zh-cn)](./README.md) | English

![star](https://badgen.net/github/stars/sonofmagic/weapp-tailwindcss)
![dm0](https://badgen.net/npm/dm/weapp-tailwindcss)
![dm1](https://badgen.net/npm/dm/weapp-tailwindcss-webpack-plugin)
![license](https://badgen.net/npm/license/weapp-tailwindcss)
[![test](https://github.com/sonofmagic/weapp-tailwindcss/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/sonofmagic/weapp-tailwindcss/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/sonofmagic/weapp-tailwindcss/branch/main/graph/badge.svg?token=zn05qXYznt)](https://codecov.io/gh/sonofmagic/weapp-tailwindcss)

> `weapp` + `tailwindcss` all-round solution.

\[[Docs deployed in China](https://weapp-tw.icebreaker.top)\] \| \[[Github Page](https://sonofmagic.github.io/weapp-tailwindcss/)\] \| \[[1.x Docs]('./v1.md')\]

- [Features](#features)
  - [Plugin Introduction](#plugin-introduction)
- [Installation and usage](#installation-and-usage)
- [Migrating from v1 to v2](#migrating-from-v1-to-v2)
- [Configuration reference](#configuration-reference)
- [Tailwindcss arbitrary values](#tailwindcss-arbitrary-values)
- [FAQ](#faq)
- [Changelog](#changelog)
- [Related projects](#related-projects)
  - [CLI tools](#cli-tools)
  - [template](#template)
    - [how to choose？](#how-to-choose)
    - [Use `uni-app cli` to build `vscode` development](#use-uni-app-cli-to-build-vscode-development)
    - [Build and develop with `hbuilderx`](#build-and-develop-with-hbuilderx)
    - [Use `tarojs` to build `vscode` development](#use-tarojs-to-build-vscode-development)
    - [Native applet development template](#native-applet-development-template)
  - [tailwindcss plugin](#tailwindcss-plugin)
  - [tailwindcss preset](#tailwindcss-preset)
- [Bugs \& Issues](#bugs--issues)
- [License](#license)

## Features

| not only `webpack`                                  | Mainstream framework and native development support |
| --------------------------------------------------- | --------------------------------------------------- |
| ![wepback+vite+gulp](./assets/weapp-tw-plugins.png) | ![frameworks](./assets/weapp-tw-frameworks.png)     |

This plugin allows you to use tailwindcss in `weapp`. At the same time, it provides the functions of tailwindcss class name escape and mangle.

> What's [`weapp`](https://mp.weixin.qq.com/cgi-bin/wx) ?
> it is a program running in [`WeChat`](https://en.wikipedia.org/wiki/WeChat),[Alipay](https://en.wikipedia.org/wiki/Alipay) or other third-party applications.
> `weapp` is a new open capability. Developers can quickly develop a small program. Mini Programs can be easily obtained and disseminated within WeChat. At the same time, have an excellent user experience.

The core plugin supports `webpack`/`vite`/`gulp` for building, covering almost all mainstream development frameworks for weapp.

These plugins can automatically identify and accurately handle all `tailwindcss` tool classes to adapt to the applet environment. At the same time, these plugins also can compress and confuse the tool class names generated by `tailwindcss`. This ability shortens the length of `css` selectors, reduces the size of generated styles, and makes class names unreadable in production.

### Plugin Introduction

The `UnifiedWebpackPluginV5` exported from `weapp-tailwindcss/webpack` is a core plugin that can be used by all frameworks that use `webpack` for packaging.

The `UnifiedViteWeappTailwindcssPlugin` exported from `weapp-tailwindcss/vite` is a dedicated plugin for `vite`, and the configuration items and usage are consistent with the `webpack` plugin.

And our `gulp` plugin method, can be exported from `weapp-tailwindcss/gulp`.

Currently, these plugins support the latest version of the `tailwindcss v3.x.x` version and `webpack5`, `vite`, and `gulp`.

> If you are still using the `tailwindcss@2` version, then you should use the `1.x` version of this plugin. Also, make sure your `nodejs` version `>=16`. At present, the long-term maintenance version (`even-numbered version`) below `16` has ended its life cycle. It is recommended to install the `LTS` version of `nodejs`, See [nodejs/release](<https://github.com/> nodejs/release)

## [Installation and usage](https://weapp-tw.icebreaker.top/docs/quick-start/install)

## [Migrating from v1 to v2](https://weapp-tw.icebreaker.top/docs/migrations/v1)

## [Configuration reference](https://weapp-tw.icebreaker.top/docs/api/interfaces/UserDefinedOptions)

## [Tailwindcss arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)

## [FAQ](https://weapp-tw.icebreaker.top/docs/issues/)

## [Changelog](./CHANGELOG.md)

## Related projects

### CLI tools

[weapp-ide-cli](https://github.com/sonofmagic/utils/tree/main/packages/weapp-ide-cli): A WeChat developer cli tool. Quickly and conveniently starts the ide directly for login, development, preview, upload code, and other functions.

### template

#### how to choose？

If you just develop a combination of `weapp` + `h5`, then using `vscode` template is enough

If the key platform of your project is `app`, it is recommended to use the `hbuilderx` template, because `hbuilderx` comes with a toolchain for `app` construction and debugging, which can better support your development.

#### Use `uni-app cli` to build `vscode` development

[uni-app-vite-vue3-tailwind-vscode-template](https://github.com/sonofmagic/uni-app-vite-vue3-tailwind-vscode-template)

[uni-app-vue2-tailwind-vscode-template](https://github.com/sonofmagic/uni-app-vue2-tailwind-vscode-template)

#### Build and develop with `hbuilderx`

[uni-app-vue3-tailwind-hbuilder-template](https://github.com/sonofmagic/uni-app-vue3-tailwind-hbuilder-template)

#### Use `tarojs` to build `vscode` development

[taro-react-tailwind-vscode-template](https://github.com/sonofmagic/taro-react-tailwind-vscode-template)

#### Native applet development template

[weapp-tailwindcss-gulp-template(gulp打包)](https://github.com/sonofmagic/weapp-tailwindcss/tree/main/demo/gulp-app)

[weapp-native-mina-tailwindcss-template(webpack打包)](https://github.com/sonofmagic/weapp-native-mina-tailwindcss-template)

### tailwindcss plugin

[weapp-tailwindcss-children](https://github.com/sonofmagic/weapp-tailwindcss-children)

### tailwindcss preset

[tailwindcss-miniprogram-preset](https://github.com/sonofmagic/tailwindcss-miniprogram-preset)

## Bugs & Issues

This plugin is currently under rapid development, if you encounter a `Bug` or want to raise an `Issue`, Welcome to submit [here](https://github.com/sonofmagic/weapp-tailwindcss/issues)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, [ice breaker](https://github.com/sonofmagic)
