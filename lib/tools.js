import { isAbleArray, isBaseTypeArray, isObjectArray } from "./base";
import { intersectionArray } from "./math";
/**
 * @param { string[] | number[] | Array<object> } arr 
 * @param { string[] | number[] | Array<object> } arr2
 * @param { string } key 
 * @returns { Array }
 * @description 获取数组1对于数组2的交集
 * @description 如果都是基本类型数组,key不需要传
 */
export const getIntersection = (arr1, arr2, key) => {
    if (!isAbleArray(arr1) || !isAbleArray(arr2)) {
        console.warn(`arr1 and arr2  muse be array  and arr1.length > 0 and arr2.length > 0 `);
        return [];
    }
    // 都是基本类型
    if ((isBaseTypeArray(arr1) && isBaseTypeArray(arr2))) {
        return intersectionArray(arr1, arr2);
    }
    // 证明至少有一个是对象数组
    if (!key) {
        console.warn(`key is required`);
        return [];
    }
    if (isBaseTypeArray(arr2)) {
        return arr1.filter(item => arr2.includes(item[key]));
    } else if (isObjectArray(arr2)) {
        return arr1.filter(item => arr2.map(item2 => item2[key]).includes(item[key]));
    } else {
        console.warn(`check arr or arr2 data`);
        return [];
    }
}
/**
 * @param {  Array<object> } arr 
 * @param {  Array<object> } arr2
 * @param { string } key 
 * @returns { Array }
 * @description 返回对称差集
 * @example getSymmetricDifference([{id:1},{id:2},{id:3}], [{id:1},{id:2},{id:4}], 'id') => [{id:3},{id:4}]
 */
export const getSymmetricDifference = (arr, arr2, key) => {
    if (!isAbleArray(arr) || !isAbleArray(arr2)) {
        console.warn(`arr and arr2  muse be array  and arr.length > 0 and arr2.length > 0 `);
        return [];
    }
    if (!key) {
        console.warn(`key is required`);
        return [];
    }
    const intersection = getIntersection(arr, arr2, key);
    const leftIntersection = arr.filter(item => {
        const index = intersection.findIndex(item2 => item2[key] === item[key]);
        return index === -1;
    });
    const rightIntersection = arr2.filter(item => {
        const index = intersection.findIndex(item2 => item2[key] === item[key]);
        return index === -1;
    });
    return [...leftIntersection, ...rightIntersection];
}