import {
    isAbleArray,
    isAbleObject,
    isAbleString,
    isAbleFn,
    arrayLength,
    isAbleNumber,
    strToArr,
    objIsContainsKey
} from "./base"

import {
    cloneTree,
    handlerTargetType
} from "./tree-check"

/**
 * @param {Array | Object} tree  树数组或者树对象
 * @returns {Array} 压平的树
 * @description 前序遍历 ==> 广度优先遍历、非递归
 */
export const flattenTree = (tree) => {
    const queue = cloneTree(tree);
    const result = [];
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        if (isAbleArray(node?.children)) {
            queue.push(...node.children);
        }
    }
    return result;
}

/**
 * @param {Array | Object} tree  树数组或者树对象
 * @returns {Array} 压平的树
 * @description 前序遍历 ==> 深度遍历、非递归
 */
export const flattenTreeByDepth = (tree) => {
    const queue = cloneTree(tree);
    const result = [];
    while (queue.length > 0) {
        const node = queue.pop();
        result.push(node);
        if (isAbleArray(node?.children)) {
            queue.push(...node.children);
        }
    }
    return result;
}

/**
 * @param {Array | Object} tree  树数组或者树对象
 * @returns {Array} 压平的树
 * @description 后序遍历、非递归
 */
export const flattenTreeByPostOrder = (tree) => {
    const stack = cloneTree(tree);
    let result = []
    while (stack.length > 0) {
        const node = stack.pop();
        result.unshift(node)
        if (node.children) {
            stack.push(...node.children)
        }
    }
    return result;
}

/**
 * @param {Array} tree
 * @description 递归
 * @returns {Array} 压平的树
*/
export const reduceFlattenTree = (tree) => {
    const treeData = cloneTree(tree);
    return treeData.reduce((prev, cur) => {
        return isAbleArray(cur?.children) ? prev.concat(cur, reduceFlattenTree(cur.children)) : prev.concat(cur)
    }, [])
}

/**
 * @param {Array} flatTreeData 压平的树
 * @param {String} key 要查找的key
 * @param {String | Number} value 要查找的value
 */
export const findTreeByFlatArray = (flatTreeData, key, value) => flatTreeData.find(item => item[key] === value)

/**
 * @param {Array} tree 树数组
 * @param {String} parentId  当前节点的父节点id、这个节点parentId应来来自于点击时候的parentId
 * @param {Boolean} showDetail 是否返回当前节点的详细信息
 * @returns {Array} 路径
 * @description 默认情况下记录当前节点的路径id集合 、showDetail为true时候返回当前节点的详细信息
 */
export const findParent = (tree, parentId, showDetail = false) => {
    if (!isAbleArray(tree) && !isAbleObject(tree)) {
        console.warn(`tree  is not a array or arr is empty`);
        return [];
    }
    if (!parentId) throw new Error(`parentId is not a able value`);
    const treeData = flattenTree(tree);
    let container = [];
    let parent = treeData.find(item => item.id === parentId);
    while (parent) {
        showDetail ? container = [parent, ...container] : container = [parent.id, ...container];
        parent = treeData.find(item => item.id === parent.parentId);
    }
    return container;
}

/**
 * @param {Array} tree  树数组(正常树)
 * @param {String} key 要查找的key
 * @param {String | Number} value 要查找的value
 * @return 返回当前节点对象
 * @description 广度优先遍历、非递归
 * @example [{id:1,children:[{id:2}] }] findTreeByTreeData(tree,'id',2) ==> {id:2}
*/
export const findTreeByTreeData = (tree, key, value) => {
    const queue = cloneTree(tree);
    let result = null;
    while (queue.length > 0) {
        const node = queue.shift();
        if (node[key] === value) {
            result = node;
            break;
        }
        if (isAbleArray(node?.children)) {
            queue.push(...node.children);
        }
    }
    return result;
}

/**
 * @param {Array} tree  树数组(正常树)
 * @param {function(*): boolean} callback 回调函数
 * @return Array<node>
 * @description 返回节点数组
 * @example [{id:1,children:[{id:2}]}]
 * @example findTreeByFn(tree,(node)=>node.id === 2) ==> [{id:2}]
 */
export const findTreeByFn = (tree, callback) => {
    const queue = cloneTree(tree);
    if (!callback || !isAbleFn(callback)) {
        throw new Error(` ${callback} is not a function`);
    }
    const result = [];
    while (queue.length > 0) {
        const node = queue.shift();
        if (callback(node)) result.push(node);
        if (isAbleArray(node?.children)) {
            queue.push(...node.children);
        }
    }
    return result;
}

/**
 * @param {Array} tree 树数组(正常树)
 * @param {String} key
 * @param {String | Number} value
 * @param {Boolean} showDetail 是否返回当前节点的详细信息 默认true
 * @returns {Array} 返回当前节点的所有子节点
 * @description 深度优先遍历、非递归
 * @example findChildrenList([{id:1,children:[{id:2,children:[{id:3}]}]}],'id',1)  [{id:2},{id:3}]
 */
export const findChildrenList = (tree, key, value, showDetail = true) => {
    if (!isAbleString(key)) {
        throw new Error(` ${key} is not a string`);
    }
    if (!value && value !== 0) {
        throw new Error(` ${value} is not a able value`);
    }
    return findChildListResult({ tree, key, value, showDetail });
}

/**
 * @param {Array} treeData 树数组(正常树)
 * @param {callBack} callBack 回调函数
 * @description 深度优先遍历、非递归
 * @example findChildrenListByFn(tree, (item) =>  item.check === false && (item.key === '1'))
 * @returns {Array} 返回当前节点的所有子节点
 */
export const findChildrenListByFn = (tree, callBack) => {
    if (!isAbleFn(callBack)) {
        throw new Error(` ${callBack} is not a function`);
    }
    return findChildListResult({ tree, callBack });
}
const findChildListResult = ({ tree, key, value, callBack, showDetail = true }) => {
    let result = [];
    const treeData = cloneTree(tree);
    while (treeData.length > 0) {
        const node = treeData.shift();
        if (key && value) {
            if (node[key] === value && isAbleArray(node?.children)) {
                if (showDetail) {
                    result = [...flattenTree(node.children)];
                } else {
                    result = flattenTree(node.children).map(item => item[key]);
                }
                break;
            }
        } else if (callBack) {
            if (callBack(node) && isAbleArray(node?.children)) {
                result = [...result, ...flattenTree(node.children)];
            }
        }
        if (isAbleArray(node?.children)) treeData.unshift(...node.children);
    }
    return result;
}

/**
 * @description 用于处理联动
 * @param {Array} tree 树数组(正常树)
 * @param {Object} item 当前节点
 * @param {string} indeterminate 你的半选状态的key
 * @param {string} checked 你的选中状态的key
 * @param {string | undefined | null } rootId 根节点的parentId
 * @param {string} key 你的唯一标识key
 * @description rootParentId 用于判断当前节点是否是根节点
 * @detail 一棵树必须包含主键（id）、parentId、children三个字段 否则无法使用
 */
export const handlerLinkage = (treeData, item, indeterminate, checked, rootParentId, key) => {
    if (!isAbleArray(treeData)) throw new Error('treeData is not a array or treeData is empty');
    if (!isAbleObject(item)) throw new Error('item is not a object or item is empty');
    if (!isAbleString(indeterminate)) throw new Error('indeterminate is not a string or indeterminate is empty');
    if (!isAbleString(checked)) throw new Error('checked is not a string or checked is empty');
    if (!isAbleString(key)) throw new Error('key is not a string or key is empty');
    // 无子节点、并且不是根节点
    if (!isAbleArray(item.children) && item.parentId) {
        handlerParentTreeNodeState(treeData, item, indeterminate, checked, key);
    } else if (item.parentId !== rootParentId && isAbleArray(item.children)) {
        // 如果不是根节点
        handlerAllChildrenNode(treeData, item, indeterminate, checked, key);
        handlerParentTreeNodeState(treeData, item, indeterminate, checked, key);
    } else if (item.parentId === rootParentId && isAbleArray(item.children)) {
        // 如果是根节点
        handlerAllChildrenNode(treeData, item, indeterminate, checked, key);
    }
}
// 处理所有子节点
const handlerAllChildrenNode = (treeData, item, indeterminate, checked, key) => {
    item[indeterminate] = false;
    const childrenList = findChildrenList(treeData, key, item[key]);
    childrenList.forEach(tree => {
        if (tree[indeterminate]) tree[indeterminate] = false;
        tree[checked] = item[checked];
    });
}
// 处理父节点
const handlerParentTreeNodeState = (treeData, item, indeterminate, checked, key) => {
    let parentNodes = findParent(treeData, item.parentId, true).sort((a, b) => b[key] - a[key]);
    if (isAbleArray(parentNodes)) {
        parentNodes.forEach(item => {
            const childrenNode = findChildrenList(treeData, key, item[key]);
            const state = childrenNode.every(tree => tree[checked]);
            const indeterminateState = childrenNode.some(tree => tree[checked]);
            if (indeterminateState) {
                item[checked] = false;
                item[indeterminate] = true;
            }
            //  如果全部选择
            if (state) {
                item[indeterminate] = false;
                item[checked] = true;
            }
            // 如果一个没选
            if (!indeterminateState && !state) {
                item[indeterminate] = false;
                item[checked] = false;
            }
        });
    }
}

const deps = (obj, path, target, key) => {
    let result = '';
    function dfs(obj, path, target, key) {
        if (!obj) return;
        if (obj[key] === target) {
            path += obj[key];
            result += path;
            return;
        }
        path += obj[key] + '->';
        obj.children && obj.children.forEach((ele) => {
            dfs(ele, path, target, key);
        })
    }
    dfs(obj, path, target, key)
    if (result) return result;
}

/**
 * @param {Array} tree 树数组(正常树)
 * @param {string | Object } node  节点的值或者节点对象
 * @param {string} key 你的唯一标识key
 * @param {boolean} showDetail 是否显示路径的详细信息
 * @param {boolean} isIncludeMyself 是否包含自身
 * @description  递归
 * @example findPath([{a:1,children:[{a:2,children:[{a:3}]}]}],3,'a') => [1,2]
 * @example findPath([{a:1,children:[{a:2,children:[{a:3}]}]}],3,'a',true) => [{a:1},{a:2}]
 * @returns {Array} 返回路径
 */
export const findPath = (tree, node, key, showDetail, isIncludeMyself = false) => {
    const treeData = cloneTree(tree);
    let target = handlerTargetType(node, key);
    let depPath = '';
    for (const treeNode of treeData) {
        depPath = deps(treeNode, '', target, key);
        if (depPath) {
            break;
        }
    }
    if (depPath) {
        let depPathArray = strToArr(depPath, "->");
        const depPathArrayLength = arrayLength(depPathArray);
        if (depPathArrayLength === 1) {
            depPath = depPathArray[0];
        } else if (depPathArrayLength > 1) {
            if (!isIncludeMyself) {
                depPathArray.pop();
            }
            if (showDetail) {
                depPath = depPathArray.map(item => findTreeByTreeData(treeData, key, item));
            } else {
                depPath = depPathArray;
            }
        }
    } else {
        throw new Error('no find target node please check your target');
    }
    return depPath;
}

/**
 *
 * @param {Object} node
 * @returns {Boolean}
 * @description 返回当前节点在树中是否是父节点
 */
export const isParentNode = (node) => {
    if (!isAbleObject(node)) {
        throw new Error(`param node is ${node} is not a object`);
    }
    const isHaveChildrenList = node.children && isAbleArray(node.children);
    return !!isHaveChildrenList;
}

/**
 * @param {Array | Object}  treeData
 * @param {Object | string } node 值或者节点对象
 * @param { String } key
 * @returns {Boolean}
 * @description 返回当前节点在树中是否是子节点
 */
export const isChildNode = (treeData, node, key) => {
    const tree = cloneTree(treeData);
    const target = handlerTargetType(node, key);
    if (target) {
        const isParentListOrRoot = findPath(tree, target, key);
        const isRoot = isAbleString(isParentListOrRoot)
        let isHaveChildrenList;
        // 兼容传入的是对象或者普通的值
        if (isAbleObject(target)) {
            isHaveChildrenList = target.children && isAbleArray(node.children);
        } else if (isAbleString(target) || isAbleNumber(target)) {
            const node = findTreeByTreeData(tree, key, target);
            isHaveChildrenList = node.children && isAbleArray(node.children);
        }
        if (isRoot) {
            return false;
        } else if (isHaveChildrenList || isParentListOrRoot) {
            return true;
        }
    } else {
        throw new Error(`The value obtained from the current object is empty 、 please check the key value of the current object `);
    }
}

/**
 * @param { Array | Object }  tree
 * @param  { Function  } handlerTreeFn
 * @description  重做树结构
 */
export const redoTreeData = (tree, handlerTreeFn) => {
    const treeData = cloneTree(tree);
    if (!isAbleFn(handlerTreeFn)) {
        console.warn(` param fn is  ${handlerTreeFn} is not a function`);
        return [];
    }
    const treeResult = [];
    for (const treeDataItem of treeData) {
        const nodeProcessed = handlerTreeFn(treeDataItem);
        treeResult.push(nodeProcessed);
        if (isAbleArray(nodeProcessed?.children)) {
            nodeProcessed.children = redoTreeData(nodeProcessed.children, handlerTreeFn)
        }
    }
    return treeResult;
}

/**
 * @param { Array | Object }  treeData
 * @param  { Object | String  } node
 * @param  { String  } key
 * @description  返回当前节点是否是叶子节点,外界如果提供isLeaf字段、则直接返回isLeaf字段
 */
export const isLeafNode = (treeData, node, key) => {
    const tree = cloneTree(treeData);
    if (isAbleObject(node) && node.isLeaf) {
        return node.isLeaf;
    } else {
        const target = handlerTargetType(node, key);
        const targetNode = findTreeByTreeData(tree, key, target);
         // 外界如果提供isLeaf字段、则直接返回isLeaf字段
         if (objIsContainsKey(targetNode, 'isLeaf')) {
            return targetNode.isLeaf;
        } else {
            return !isAbleArray(targetNode?.children);
        }
    }
}

/**
 * @param { Array | Object }  treeData
 * @param  { Object | String  } node
 * @param  { String  } key
 * @param { boolean } showDetail
 * @description  返回当前节点是否是根节点
 * @returns { Object } { isRoot: true, root: '1' }
 * @example isRootNode(treeData, '1', 'id', false) ==> { isRoot: true, root: '1' }
 * @example isRootNode(treeData, '1', 'id', true) ==> { isRoot: true, root: { id: '1' } }
 * @example isRootNode(treeData, { id: '2' }, 'id' , false) ==> { isRoot: false, root: '1' }
 * @example isRootNode(treeData, { id: '2' }, 'id' , true) ==> { isRoot: false, root: { id: '1' } }
 */
export const isRootNode = (treeData, node, key, showDetail = false) => {
    const tree = cloneTree(treeData);
    const target = handlerTargetType(node, key);
    const parentList = findPath(tree, target, key, showDetail);
    if (isAbleArray(parentList)) {
        return {
            isRoot: false,
            root:  parentList.shift()
        }
    } else {
        return {
            isRoot: true,
            root: showDetail ? findTreeByTreeData(tree, key, target) : target
        }
    }
}

/**
 * @param { Array | Object }  treeData
 * @param  { Object | string } node 值或者节点对象
 * @param  { String  } key
 * @param  { Boolean  } isShowDetail 默认true 返回当前节点的详细信息
 * @description  返回当前节点的兄弟节点
 */
export const findCurrentNodeBrotherNode = (treeData, node, key, isShowDetail = true) => {
    const tree = cloneTree(treeData);
    const target = handlerTargetType(node, key);
    const parentList = findPath(tree, target, key);
    if (isAbleArray(parentList)) {
        const directParent = parentList.pop();
        const directParentNode = findTreeByTreeData(tree, key, directParent);
        if (!isShowDetail) {
            return directParentNode.children.filter(item => item[key] !== target).map(item => item[key]);
        }
        return directParentNode.children.filter(item => item[key] !== target);
    } else {
        if (tree.length > 1) {
            return isShowDetail ? tree.filter(item => item[key] !== target) : tree.filter(item => item[key] !== target).map(item => item[key]);
        } else {
            console.warn(`The current node is the root node and does not have a brother node`)
            return [];
        }
    }
}

/**
 * @param { Array | Object }  treeData
 * @param  { String  } keyWord
 * @param  { String  } key
 * @description  树的模糊搜索
 * @returns { Array } 返回路径
 */
export const treeFuzzySearch = (treeData, keyWord, key) => {
    const tree = cloneTree(treeData);
    if (!keyWord || !key) {
        throw new Error(`keyWord or key is empty`);
    }
    let result = [];
    const exec = (treeNode, parentPath) => {
        const currentPath = parentPath.concat(treeNode[key]);

        if (!objIsContainsKey(treeNode, key)) {
            throw new Error(`The current object does not contain the key ${key}`);
        }

        if (treeNode[key] && treeNode[key].toString().includes(keyWord)) {
            result.push(currentPath);
        }

        if (objIsContainsKey(treeNode, 'children')) {
            const nodeList = treeNode.children;
            nodeList.forEach(node => {
                exec(node, currentPath);
            })
        }
    }

    for (const node of tree) {
        exec(node, [])
    }
    return result;
}
