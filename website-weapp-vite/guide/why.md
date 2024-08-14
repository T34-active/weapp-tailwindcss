# 为什么选 Weapp-vite {#why-weapp-vite}

## 现实问题 {#the-problems}

嗯，原生的小程序开发方式，令人不愉快

然后跨端框架诸如 `uni-app` / `tarojs` 使用的是兼容 `vue` / `react` 等等 `web` 框架的写法，再编译回小程序，我觉得太重了

`mpxjs` 思路很好，但是我就是想用最原生的写法，加上一些现代工具链的东西而已，并不想上什么框架，学习什么新语法

现在原生小程序越来越强，各个平台差异化比较明显。

微信小程序又是搞 `skyline` 又是搞 `Donut` 的，所有我想就使用一些原生小程序的写法，跟着官方走

然后由微信，转到其他的小程序平台，不考虑 `web`, `app` 靠 `Donut` 或者随缘

反正整体的思路，便是所见即所得，最轻量级的构建，同时也能够带有 `vite` 的插件系统。

可以利用 `vite` 的生态的同时，方便我后续编写插件对里面的语法进行高度自定义。

比如把微信的语法转换成支付宝的语法，这种类似的操作

于是 `weapp-vite` 诞生了