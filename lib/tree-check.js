import {
    isAbleArray,
    isAbleObject,
    isAbleNumber,
    isAbleString,
    objIsContainsKey
} from "./base";

const checkTreeIsExist = (tree) => {
    if (!isAbleArray(tree) && !isAbleObject(tree)) {
        throw new Error(`param  tree must be array  or object  is not ${tree}`);
    }
}
export const cloneTree = (tree) => {
    checkTreeIsExist(tree);
    const treeResult = isAbleObject(tree) ? [tree] : [...tree]
    if (globalThis === window) {
        if (window.structuredClone) {
            return window.structuredClone(treeResult);
        } else {
            return JSON.parse(JSON.stringify(treeResult));
        }
    } else if (!globalThis) {
        return JSON.parse(JSON.stringify(treeResult));
    }
}
export const checkTreeParamIsExist = ({ tree, node, key }) => {
    checkTreeIsExist(tree);
    if (!key) {
        throw new Error(`param  key is required`);
    }
    if (!isAbleObject(node) || !node[key]) {
        throw new Error(`param  node need object type  ${node} is not object or  ${node?.key} is not exist in tree`)
    }
}
export const handlerTargetType = (node, key) => {
    if (!node) {
        throw new Error(`node is ${node} is not a object`);
    }
    if (!key) {
        throw new Error(`key is ${key} is not a string`);
    }
    let target = '';
    if (isAbleObject(node)) {
        if (!objIsContainsKey(node, key)) {
            throw new Error(`current node  not contains key ${key}`);
        }
        if (!node[key]) {
            throw new Error(`The value obtained from the current object is not available`);
        }
        target = node[key];
    } else if (isAbleString(node) || isAbleNumber(node)) {
        target = node;
    } else {
        throw new Error(`node is ${node} is not a object or string or number`);
    }
    return target;
}