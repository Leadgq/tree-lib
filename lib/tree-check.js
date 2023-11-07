import { isAbleArray, isAbleObject } from "./base";

const checkTreeIsExist = (tree) => {
    if (!isAbleArray(tree) && !isAbleObject(tree)) {
        throw new Error(`param  tree must be array  or object  is not ${tree}`);
    }
}
export const cloneTree = (tree) => {
    checkTreeIsExist(tree);
    return isAbleObject(tree) ? [tree] : [...tree];
}
export const checkTreeParamIsExist = ({ tree, node, key }) => {
    checkTreeIsExist(tree);
    if (!isAbleObject(node) || !node[key]) {
        throw new Error(`param  node need object type  ${node} is not object or ${node[key]} is not exist`)
    }
    if (!key) {
        throw new Error(`param  key is required`);
    }
}