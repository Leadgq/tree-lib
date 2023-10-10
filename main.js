import { calculatePercentage, getDistance } from "./lib/math"
import { isAbleArray, isAbleFn, isAbleObject, isAbleString, isAbleNumber, isHasChange } from "./lib/base"
import {
    findChildrenList,
    findChildrenListByFn,
    findParent,
    findPath,
    findTreeByFlatArray,
    findTreeByFn,
    findTreeByTreeData,
    flattenTree,
    flattenTreeByDepth,
    flattenTreeByPostOrder,
    handlerLinkage,
    isChildNode,
    isParentNode,
    reduceFlattenTree
} from "./lib/tree";

export {
    findChildrenList,
    findChildrenListByFn,
    findParent,
    findPath,
    findTreeByFlatArray,
    findTreeByFn,
    findTreeByTreeData,
    flattenTree,
    flattenTreeByDepth,
    flattenTreeByPostOrder,
    handlerLinkage,
    isChildNode,
    isParentNode,
    reduceFlattenTree,
    calculatePercentage,
    getDistance,
    isAbleArray,
    isAbleFn,
    isAbleObject,
    isAbleString,
    isAbleNumber,
    isHasChange
}