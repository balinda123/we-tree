import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";

export default {
  input: "src/index.ts", // 入口文件
  output: {
    dir: "lib", // 输出文件
    format: "umd",
    name: "WeTree",
    //当入口文件有export时，'umd'格式必须指定name
    //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
  },
  plugins: [
    resolve(),
    commonjs(),

    typescript({
      tsconfig: "./tsconfig.json",
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
