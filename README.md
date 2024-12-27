# mix-tree 组件库

WeTree 是一个基于 React 和 Ant Design 的树形组件库，支持 Typescript，提供了丰富的树形结构组件和树形处理方法类，适用于各种复杂的树形数据展示和操作需求。

1. CheckTree: 基于 antd 组件带半选状态的树组件。
   ![image](https://github.com/user-attachments/assets/3e20aa14-f5d9-4535-839a-cd0c4c70f773)
2. TreeHelper: 树形处理方法类，提供了丰富的树形处理方法，如：树形列表转换、树形数据排序、树形数据过滤等。

## 安装

你可以使用 npm 或 yarn 来安装 WeTree 组件库。

```bash
npm install mix-tree
yarn add mix-tree
```

## 依赖相关库版本支持

"antd": "^4.0.0",
"lodash": "^4.17.21",
"react": "^17.0.0"

## 快速开始

首先，确保你已经安装了 antd 和 react。然后在你的项目中引入并使用 WeTree 组件。

```jsx
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

return <CheckTree treeData={treeData} />;
```

## 组件介绍

### CheckTree

CheckTree 是一个基于 antd tree 组件开发的，带半选状态的树组件。

## API 文档

| 属性名          | 类型                      | 默认值                                             | 描述                                                                         |
| --------------- | ------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------- |
| spcialHalfCheck | boolean                   | false                                              | 选择完全受控情况下，是否增加特殊半勾选逻辑；父子不再关联；业务逻辑特殊半选： |
| openSearch      | boolean                   | false                                              | 是否开启树关键词搜索                                                         |
| searchConfig    | { placeholder?: string; } | undefined                                          | 搜索配置                                                                     |
| onCustomCheck   | TreeProps["onCheck"]      | ( checked: { checked: Key[]; halfChecked: Key[]; } | Key[], info: CheckInfo<DataNode>) => void                                    | 自定义选择的一些逻辑 |
| checkBoxType    | TODO                      |                                                    |                                                                              |
