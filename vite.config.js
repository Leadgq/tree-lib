import { resolve } from 'path'
import { defineConfig } from 'vite'
import { terser } from "rollup-plugin-terser"
/** @type {import('vite').UserConfig} */

export default defineConfig({
  build: {
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'main.js'),
      name: 'treeLib',
      fileName: 'tree-lib',
    },
    rollupOptions: {
      plugins: [
        terser({
          format: {
            comments: /\/\*[^\/]*\*\/|\/\/.+\n?/g
          },
          compress: true
        })
      ],
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
