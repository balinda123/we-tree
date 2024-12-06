// import { TreeProps } from 'antd';

// 搜索配置
export interface SearchConfig {
  placeholder?: string;
}

// 树节点
// export type TreeDataNode = Omit<TreeProps, 'treeData'> & {
//   pid: string;
// };

export enum YorNCheck {
  Yes = 'Y', // 被勾选时
  No = 'N', // 取消勾选时
}

export enum ParentorSon {
  Null = '', // 都不关联
  Parent = 'p', // 只关联父
  Son = 's', // 只关联子
  ParentAndSon = 'ps', // 父子都关联
}

// TODO: 父子关联关系
export type CheckBoxType = Record<YorNCheck, ParentorSon>;
