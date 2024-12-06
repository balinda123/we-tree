import type { Key } from "react";
import React, { useEffect, useMemo, useState } from "react";
import type { TreeProps } from "antd";
import { Input, Tree } from "antd";
import type { DataNode } from "antd/lib/tree";
import { isArray, isEmpty } from "lodash";

import type { CheckBoxType, SearchConfig } from "./data";
import TreeHelper from "@/src/utils/TreeHelper";
import "./index.less";

// 3个状态选择，1.未选中 2.选中 3.半勾选（两种状态，1--背景灰色-当前没选中，子节点未全选； 2--背景灰色加对勾-当前选中，子节点未全选）
// 全部选中 || 父选中，子也全选中 => （正常蓝色）
// 父部门选中子部门未全选中：（灰背景蓝勾中）
// 父部门没选中子部门未全选中：（灰背景无勾）
export interface CheckTreeProps extends TreeProps {
  spcialHalfCheck?: boolean; // 父子不在关联；业务逻辑特殊半选： 选择完全受控情况下，是否增加特殊半勾选逻辑
  openSearch?: boolean; //是否开启搜索
  searchConfig?: SearchConfig; // 搜索配置
  onCustomCheck?: TreeProps["onCheck"];
  checkBoxType?: CheckBoxType;
}

const CheckTree: React.FC<CheckTreeProps> = props => {
  const [checkKeys, setCheckKeys] = useState<Key[]>([]); // 选中的key
  const [showDeptData, setShowDeptData] = useState<DataNode[]>(
    props?.treeData || []
  ); // 展示得树节点
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(
    props?.autoExpandParent || true
  ); // 自动展开父节点
  const [keyWord, setKeyWord] = useState<string>(""); // 搜索关键字

  // const fieldNamesConfig = props?.fieldNames || {
  //   title: 'title',
  //   key: 'key',
  //   children: 'children',
  // }; // 字段配置

  const onPropsCheck: TreeProps["onCheck"] = (_, info) => {
    const curNode = info.node;
    // 1. 选中节点
    const curNodeChildKeys =
      (curNode?.children || [])?.length > 0
        ? TreeHelper.treeToList(curNode.children).map((it: DataNode) => it.key)
        : [];
    const curSelKeys = [curNode.key, ...curNodeChildKeys]; // 当前应该选中的keys
    let selectKeys = [...checkKeys, ...curSelKeys];
    selectKeys = [...new Set(selectKeys)]; //去重

    if (!info?.checked) {
      selectKeys = selectKeys.filter(it => !curSelKeys.includes(it));
    }
    setCheckKeys(selectKeys);

    // 2. 半选节点
    // data - 当前父节点的所有子节点
    // const curPNode = findNodeAll(showDeptData, (node) => node.key === curNode?.parentKey)[0];
    // console.log(curPNode, '>curPNode');

    // const curPNodeChildKeys =
    //   (curPNode?.children || [])?.length > 0
    //     ? treeToList(curPNode.children).map((it) => it.key)
    //     : [];
    // console.log(curPNodeChildKeys, '>curPNodeChildKeys');

    // //  data -当前父节点是否被选中
    // const isPNodeSelect = curNode?.parentKey && selectKeys.includes(curNode?.parentKey);
    // console.log(isPNodeSelect, '>>isPNodeSelect');

    // // 背景灰色-当前父节点没选中，当前点击的父的子节点未全选；
    // let curHalfKeys: Key[] = [];
    // if (!isPNodeSelect) {
    //   // 半选其子节点的所有父节点
    //   curHalfKeys = [...new Set([...normalHalfCheckKeys, curNode?.parentKey])];
    //   // 如果当前是半选变全选,则删除半选
    //   if (curNode.halfChecked) {
    //     curHalfKeys = curHalfKeys.filter((it) => it !== curNode?.key);
    //   }
    //   // 当前父节点的子节点至少选中一个：一个都没有选中则去掉父节点的半选
    //   const hasChildSel = curPNodeChildKeys.some((it) => selectKeys.includes(it));
    //   if (!hasChildSel) {
    //     curHalfKeys = curHalfKeys.filter((it) => it !== curNode?.parentKey);
    //   }
    //   setNormalHalfCheckKeys(curHalfKeys);
    // }

    // callback会选择节点
    if (props?.onCustomCheck) {
      // const callBackChecked =
      //   curHalfKeys.length > 0
      //     ? { checked: selectKeys, halfChecked: curHalfKeys }
      //     : selectKeys;
      props?.onCustomCheck(selectKeys, info);
    }
  };

  // check相关配置
  const checkProps = useMemo(() => {
    if (!!props?.spcialHalfCheck) {
      // 继承传递的选中key, 半选自定义
      // const propsCheckKeys = props?.checkedKeys;
      // const curChecked = isArray(propsCheckKeys) ? propsCheckKeys : propsCheckKeys?.checked || [];

      return {
        checkable: true,
        checkStrictly: true,
        // checkedKeys: { checked: checkKeys, halfChecked: normalHalfCheckKeys },
        checkedKeys: checkKeys,
        onCheck: onPropsCheck,
      };
    }
  }, [props?.spcialHalfCheck, checkKeys]);

  // search相关配置
  const searchProps = useMemo(() => {
    if (!props?.openSearch) {
      return {};
    }

    return {
      autoExpandParent: autoExpandParent,
      expandedKeys: expandedKeys,
      onExpand: (expandedKeysTo: any, info: any) => {
        setExpandedKeys(expandedKeysTo);
        setAutoExpandParent(false);

        if (props?.onExpand) {
          props?.onExpand(expandedKeysTo, info);
        }
      },
    };
  }, [props?.openSearch, autoExpandParent, expandedKeys, keyWord]);

  useEffect(() => {
    setExpandedKeys(props?.expandedKeys || []);
  }, [props?.expandedKeys]);

  // 改变展示的数据
  const changeTreeData = (data: DataNode[], type: "keyword" | "checked") => {
    const list = TreeHelper.treeMap(data, {
      conversion: (node: DataNode) => {
        const { title, key } = node;
        let changeVal = {};
        // 关键字搜索后 title截取字体变化
        if (type === "keyword") {
          const index = (title as string).indexOf(keyWord);
          const beforeStr = (title as string).substring(0, index);
          const afterStr = (title as string).substring(index + keyWord.length);
          const titleKeyWord =
            index > -1 ? (
              <>
                {beforeStr}
                <span className="keyword">{keyWord}</span>
                {afterStr}
              </>
            ) : (
              title
            );
          changeVal = { title: titleKeyWord };
        }

        // 背景灰色加对勾- 该点已被选中，其子节点未全选
        // 背景灰色 - 该点没选中，其子节点至少有一个选中
        // 半选状态修改
        if (type === "checked") {
          let spcialClassName = "";
          const hasChild = (node?.children || []).length > 0;
          if (hasChild) {
            const isNodeCheck = checkKeys.includes(key),
              curNodeAllChildKeys: Key[] = TreeHelper.treeToList(
                node.children
              ).map((it: DataNode) => it.key),
              isChildAllSelect = curNodeAllChildKeys.every(curKey =>
                checkKeys.includes(curKey)
              ),
              isChildSomeSelect = curNodeAllChildKeys.some(curKey =>
                checkKeys.includes(curKey)
              );

            // 背景灰色加对勾- 该点已被选中，其子节点未全选
            if (isNodeCheck && hasChild && !isChildAllSelect) {
              spcialClassName = "half-check";
            }
            // 背景灰色 - 该点没选中，其子节点至少有一个选中
            if (!isNodeCheck && hasChild && isChildSomeSelect) {
              spcialClassName = "half-un-check";
            }
          }

          changeVal = { className: spcialClassName };
        }

        return {
          ...node,
          ...changeVal,
        };
      },
    });

    return list;
  };

  // 初始化显示数据
  useEffect(() => {
    if (props?.treeData && !isEmpty(props?.treeData)) {
      setShowDeptData(props?.treeData);
    }
  }, [props?.treeData]);

  // 部门搜索
  useEffect(() => {
    if (!props?.treeData) {
      return;
    }
    if (!keyWord) {
      setAutoExpandParent(false);
      setShowDeptData(props?.treeData);
      setExpandedKeys([]);
      return;
    }
    setAutoExpandParent(true);
    // 搜索数据结果
    const searchNodes = TreeHelper.filterTree(props?.treeData, node => {
      return (node.title as string)?.indexOf(keyWord) > -1;
    });
    setShowDeptData(changeTreeData(searchNodes, "keyword"));
    // 搜索后默认展开的节点
    const expandKeys = TreeHelper.treeToList(searchNodes).map(
      (item: DataNode) => item.key
    );
    setExpandedKeys(expandKeys);
  }, [keyWord]);

  // 监听选中状态变化, 改变半选样式
  useEffect(() => {
    setShowDeptData(changeTreeData(showDeptData, "checked"));
  }, [checkKeys]);

  // 编辑用：初始化显示选中的节点
  useEffect(() => {
    const propsCheckKeys = props?.checkedKeys;
    const curChecked = isArray(propsCheckKeys)
      ? propsCheckKeys
      : propsCheckKeys?.checked || [];

    // 当前选中
    setCheckKeys(curChecked);
  }, [props?.checkedKeys]);

  return (
    <>
      {props?.openSearch && (
        <Input.Search
          {...props?.searchConfig}
          style={{ marginBottom: 15 }}
          onChange={e => {
            setKeyWord(e.target.value);
          }}
        />
      )}
      {/* <Spin> */}
      <Tree
        className="custom-tree"
        {...props}
        {...checkProps}
        {...searchProps}
        treeData={showDeptData}
      />
      {/* </Spin> */}
    </>
  );
};

export default CheckTree;
