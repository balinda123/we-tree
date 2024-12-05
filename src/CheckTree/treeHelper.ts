type Fn<T> = (n: T) => any;

interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

// 列表变树
export function listToTree<T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, children, pid } = conf;

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent[children] : result).push(node);
  }
  return result;
}

// 树变列表
export function treeToList<T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T {
  const finalConfig = getConfig(config); // 使用新变量存储配置
  const { children } = finalConfig;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}
export function findNode<T = any>(
  tree: any,
  func: Fn<T>,
  config: Partial<TreeHelperConfig> = {},
): T | null {
  const finalConfig = getConfig(config); // 使用新变量存储配置
  const { children } = finalConfig;
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

export function findNodeAll<T = any>(
  tree: any,
  func: Fn<T>,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const finalConfig = getConfig(config); // 使用新变量存储配置
  const { children } = finalConfig;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    func(node) && result.push(node);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

export function findPath<T = any>(
  tree: any,
  func: Fn<T>,
  config: Partial<TreeHelperConfig> = {},
): T | T[] | null {
  const finalConfig = getConfig(config); // 使用新变量存储配置
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = finalConfig;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

export function findPathAll(tree: any, func: Fn<any>, config: Partial<TreeHelperConfig> = {}) {
  const finalConfig = getConfig(config); // 使用新变量存储配置
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const visitedSet = new Set(),
    { children } = finalConfig;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      func(node) && result.push([...path]);
    }
  }
  return result;
}

// 筛选树形数据
export function filterTree<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}, // Partial 将 T 中的所有属性设为可选
): T[] {
  // 获取配置
  const finalConfig = getConfig(config); // 使用新变量存储配置
  const children = finalConfig.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        // 递归调用 对含有children项  进行再次调用自身函数 listFilter
        node[children] = node[children] && listFilter(node[children]);
        // 执行传入的回调 func 进行过滤
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

// 遍历树
export function forEach<T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {},
): void {
  const finalConfig = getConfig(config); // 使用新变量存储配置
  const list: any[] = [...tree];
  const { children } = finalConfig;
  for (let i = 0; i < list.length; i++) {
    //func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
  }
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMap<T = any>(
  treeData: T[],
  opt: { children?: string; conversion: Fn<T> },
): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn<any> },
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        }),
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}
