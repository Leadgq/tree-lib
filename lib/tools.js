import {
    isAbleArray,
    isAbleFn,
    isBaseTypeArray,
    isObjectArray,
    isAbleNumber,
    reviseNumber,
    isAbleString,
    stringToNumber
} from "./base";
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
    if ((isBaseTypeArray(arr1) && isBaseTypeArray(arr2))) {
        return intersectionArray(arr1, arr2);
    }
    if (!key) {
        console.warn(`key is required`);
        return [];
    }
    if (isBaseTypeArray(arr2)) {
        return arr1.filter(item => arr2.includes(item[key]));
    } else if (isObjectArray(arr2)) {
        return arr1.filter(item => arr2.map(item2 => item2[key]).includes(item[key]));
    } else {
        throw new Error(`please check type`);
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

/**
 * @param {  Function } fn
 * @description 缓存函数结果
 */
export function memoize(fn) {
    if (!isAbleFn) {
        throw new Error(`fn muse be function`);
    }
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

/**
 * @param {  Array } arr
 * @param { string } key
 * @returns { Map }
 * @description 将数组转换成map,并且以key为map的key
 * @description 该方法会缓存结果
 */
export const genderMapAndSetMapKey = memoize(function (arr, key) {
    if (!isAbleArray(arr)) {
        throw new Error(`arr muse be array  and arr.length > 0`);
    }
    if (!key) {
        throw new Error(`key is required`);
    }
    return new Map(arr.map(item => [item[key], item]));
})

/**
 * @description 解析url参数
 * @returns { Object }
 */
export const parseLocationUrlParams = () => {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

/**
 * @description 返回千分位
 * @returns { string }
 */
export const toThousands = (num) => {
    if (isAbleString(num)) {
        num = stringToNumber(num);
    }
    if (!isAbleNumber(num)) {
        const isNaNNumber = Number.isNaN(num);
        if (isNaNNumber) {
            throw new Error(`num muse be number or string now type is ${NaN} `);
        }
        throw new Error(`num muse be number or string now type is ${typeof num}`);
    }
    return num.toLocaleString();
}