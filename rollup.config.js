import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import babel from "rollup-plugin-babel";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import path from "path";

export default {
  input: "src/index.ts", // 入口文件
  output: {
    dir: "lib", // 输出文件
    format: "esm",
    //当入口文件有export时，'umd'格式必须指定name
    //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
    name: "WeTree",
    exports: "named", // 指定导出模式（自动、默认、命名、无）
    preserveModules: true, // 保留模块结构
    preserveModulesRoot: "src", // 将保留的模块放在根级别的此路径下
    sourcemap: true, // 启用源映射
  },
  plugins: [
    resolve(),
    commonjs(),
    alias({
      entries: [{ find: "@/src", replacement: path.resolve(__dirname, "src") }],
    }),
    typescript({
      // tsconfig: "./tsconfig.json",
      outDir: "lib",
      declaration: true,
      declarationDir: "lib",
      sourceMap: true, // 确保 TypeScript 插件也生成源映射
    }),
    babel({
      exclude: "node_modules/**", // 防止打包node_modules下的文件
      runtimeHelpers: true, // 使plugin-transform-runtime生效
      presets: ["@babel/preset-react"], // 添加 React 预设
      plugins: ["@babel/plugin-transform-runtime"],
    }),
    postcss({
      extract: true, // 提取 CSS 到单独的文件
      // modules: false, // 是否启用 CSS 模块
      minimize: false, // 是否压缩 CSS

      extensions: [".less", ".css"],
      use: [
        [
          "less",
          {
            javascriptEnabled: true,
            includes: "src",
            // output: "./lib/styles.css",
          },
        ],
      ],
    }),
    dynamicImportVars({
      // 配置动态导入变量的解析
      include: /\/src\//,
      exclude: /node_modules/,
      preferBuiltins: false,
    }),
  ],
  external: [/^react(\/.+|$)/, /^antd(\/.+|$)/, /^lodash(\/.+|$)/],
};
