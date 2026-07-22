import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '丁一诺 · 产品经理',
  description: 'AI 应用 / 医药数字化 / 搜索策略 · 个人简历',
  lang: 'zh-CN',
  base: '/dino-resume/',
  appearance: false,
  head: [
    ['script', { defer: '', src: 'https://cloud.umami.is/script.js', 'data-website-id': '0579b4a3-e1c4-4c38-83a2-fe6c25dc67bf' }],
  ],
  themeConfig: {},
})
