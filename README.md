# mix-tree (WeTree) 组件库

`mix-tree` (WeTree) 是一个基于 React 和 Ant Design (v4) 封装的树形组件库，内置了完整的 TypeScript 类型支持。它提供了丰富的树形结构组件和树形处理方法类，适用于各种复杂的树形数据展示和操作需求。

## 📦 安装

你可以使用 npm, yarn 或 pnpm 来安装 `mix-tree` 组件库：

```bash
npm install mix-tree
# 或
yarn add mix-tree
# 或
pnpm add mix-tree
```

## 🔨 依赖相关库版本要求

本组件库依赖于以下库，请确保你的项目中已安装了兼容的版本：

- `"antd": "^4.0.0"`
- `"lodash": "^4.17.21"`
- `"react": "^17.0.0"` (兼容 React 18)

## 🚀 快速开始

首先，确保你已经安装了 `antd` 和 `react`。然后在你的项目中引入并使用 WeTree 组件：

```tsx
import React from "react";
import { CheckTree } from "mix-tree";

const treeData = [
  {
    title: "Parent Node",
    key: "0-0",
    children: [
      {
        title: "Child Node 1",
        key: "0-0-0",
      },
      {
        title: "Child Node 2",
        key: "0-0-1",
      },
    ],
  },
];

const App = () => {
  return (
    <CheckTree 
      treeData={treeData} 
      openSearch={true} 
      searchConfig={{ placeholder: "请输入搜索关键字" }} 
    />
  );
};

export default App;
```

## 🧩 组件介绍

### CheckTree

`CheckTree` 是基于 antd `Tree` 组件开发的增强版树组件。它内置了特殊的半选状态处理、搜索过滤等高级业务功能。

![image](https://github.com/user-attachments/assets/3e20aa14-f5d9-4535-839a-cd0c4c70f773)

### CheckTree API 文档

`CheckTree` 继承了 antd `TreeProps` 的所有属性，并在此基础上扩展了以下属性：

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `spcialHalfCheck` | `boolean` | `false` | 开启特殊半选模式：在受控模式下脱离父子关联，实现特定的业务半选状态（如：灰底蓝勾等）。 |
| `openSearch` | `boolean` | `false` | 是否开启树节点关键词搜索功能。 |
| `searchConfig` | `SearchConfig` (`{ placeholder?: string }`) | `undefined` | 搜索输入框的配置，例如占位符文字。 |
| `onCustomCheck` | `(checkedKeys, info) => void` | `undefined` | 触发自定义选择逻辑的回调函数，类似 `onCheck`。 |
| `checkBoxType` | `CheckBoxType` | `undefined` | 配置自定义的父子节点联动关联规则（待实现细节）。 |

### TreeHelper (工具类)

`TreeHelper` 是一个树形数据处理的方法合集，提供了如树形列表转换、树形数据排序、树形数据过滤等丰富的方法，可以直接在业务中导入使用：

```tsx
import { TreeHelper } from "mix-tree";

// 例如：将平面列表转换为树形结构，或过滤树节点
const filteredTree = TreeHelper.filterTree(treeData, (node) => node.title.includes('keyword'));
```

## 📄 License

MIT
