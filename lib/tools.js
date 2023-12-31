import {
    isAbleArray,
    isAbleFn,
    isBaseTypeArray,
    isObjectArray,
    isAbleNumber,
    isAbleString,
    stringToNumber,
    objIsContainsKey,
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
    return new Map(arr.map(item => {
        if (!objIsContainsKey(item, key)) {
            throw new Error(`${key} is not in object`);
        }
        return [item[key], item]
    }));
})

/**
 * @description 解析url参数
 * @returns { Object }
 */
export const parseLocationUrlParams = () => {
    if (globalThis === window) {
        if (window.location.search) {
            return Object.fromEntries(new URLSearchParams(window.location.search));
        }
    }
}

/**
 * @description 返回千分位
 * @returns { string }
 */
export const toThousands = num => {
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

/**
 * @description 隐藏手机号中间四位
 * @returns { string }
 */
export const hidePhone = phone => {
    if (isAbleNumber(phone)) {
        phone = String(phone);
    }
    if (!isAbleString(phone)) {
        throw new Error(`phone muse be string or number now type is ${typeof phone} maybe phone length is 0`);
    }
    const phoneLength = phone.length;
    if (phoneLength !== 11) {
        throw new Error(`phone length muse be 11 now length is ${phoneLength}`);
    }
    const phoneReg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
    if (!phoneReg.test(phone)) {
        throw new Error(`phone is invalid error`);
    }
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * @param { number } time
 * @returns { Promise  }  { promises: Promise }
 * @returns { cancel } { cancel: Function  }
 * @example sleep(1000).then(res => console.log(res)) => sleep end
 * @description 睡眠函数
 * @description 可以取消睡眠 通过返回的cancel函数
 */
export const sleep = time => {
    let promises, res, rej;
    if (Promise.withResolvers) {
        const { promise, resolve, reject } = Promise.withResolvers();
        promises = promise;
        rej = reject;
        res = resolve;
    } else {
        promises = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        })
    }
    const timeId = setTimeout(() => res('sleep end'), time);
    const cancel = () => {
        clearTimeout(timeId);
        res('cancel');
    }
    return {
        promises,
        cancel
    }
}

/**
 *  @param { Function } fn
 *  @param { number } count 默认为2
 *  @returns { Function }
 *  @description 函数执行n次后才会执行
 *  @example const fn = after(() => console.log('after'), 3);
*/
export const after = (fn, count = 2) => {
    if (!isAbleFn(fn)) {
        throw new Error(`fn muse be function`);
    }
    let n = count;
    return function (...args) {
        if (--n < 1) {
            return fn.apply(this, args);
        }
    }
}

/**
 * @description 不同标签页之间通信
 * @returns { Object  } sendMessage: Function, receiveMessage: Function
 * @example const { sendMessage, receiveMessage } = initBroadcastChannel('userInformation');
 * @example sendMessage('userInformation', { name: '张三' });
 * @example receiveMessage((data) => console.log(data));
 */
export const initBroadcastChannel = (messageInfo) => {
    if (!isAbleString(messageInfo)) {
        throw new Error(`messageInfo muse be string`);
    }
    try {
        const Channel = new BroadcastChannel(messageInfo);
        const sendMessage = (messageType, message) => {
            if (!isAbleString(messageType)) {
                throw new Error(`messageType muse be string`);
            }
            Channel.postMessage({
                messageType,
                message
            })
        }
        const receiveMessage = (callback) => {
            if (!isAbleFn(callback)) {
                throw new Error(`callback muse be function`);
            }
            Channel.onmessage = (event) => {
                callback(event.data)
            }
        }
        return {
            sendMessage,
            receiveMessage
        }
    } catch (error) {
        throw new Error(`BroadcastChannel is not supported`);
    }
}

/**
 * @description 数组去重
 * @description 去除对象数组中的重复项
 * @description 如果不传入key，则认为是基本类型数组
 * @returns { Array }
 * @param { Array } arr
 * @param { string } key
*/
export const uniqueArray = (arr, key) => {
    if (!isAbleArray(arr)) {
        throw new Error(`arr muse be array`);
    }
    if (!key) {
        return [...new Set(arr)];
    }
    if (isAbleString(key) && isObjectArray(arr)) {
        const map = genderMapAndSetMapKey(arr, key);
        return [...map.values()];
    } else {
        return [];
    }
}

/**
 * @description 模糊搜索对象数组
 * @returns { Array }
 * @param { Array } arr
 * @param { string } keyWord
 * @param { string } key
 * @description 如果不传入key，则认为是基本类型数组
 */
export const fuzzySearch = (arr, keyWord, key) => {
    if (!isAbleArray(arr)) {
        throw new Error(`arr muse be array`);
    }
    if (!isAbleString(keyWord)) {
        throw new Error(`keyWord muse be string`);
    }
    if (!key) {
        return arr.filter(item => item.includes(keyWord));
    }
    const reg = new RegExp(keyWord)
    return arr.filter((item) => {
        if (objIsContainsKey(item, key)) {
            return reg.test(item[key]);
        }
    });
}

/**
 * @description 方法是12小时制
 * @description 返回当前时间
 * @example getCurrentDateForChina() => 2021年1月1日星期五 下午4:00
 * @example getCurrentDateForChina(false) => 2021年1月1日星期五 16:00
 */
export const getCurrentDateForChina = (hour12 = true) => {
    let date = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12
    }
    return new Intl.DateTimeFormat('zh-CN', options).format(date)
}

export class Clipboard {
    saveText;
    async copyTextByClipboard(text) {
        if (!text) {
            return false;
        }
        this.saveText = text;
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        } else {
            try {
                const div = document.createElement('div');
                document.body.appendChild(div);
                div.innerText = text;
                const range = document.createRange();
                range.selectNode(div);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('copy');
                div.remove();
                return true;
            } catch (error) {
                throw new Error(`${error}`);
            }
        }
    }
    async readTextByClipboard() {
        if (navigator?.clipboard?.readText) {
            try {
                return await navigator.clipboard.readText();
            } catch (error) {
                throw new Error(`${error}`);
            }
        } else {
            // 旧的方法
            const div = document.createElement('div');
            document.body.appendChild(div);
            div.contentEditable = true;
            div.focus();
            document.execCommand('paste');
            const text = this.saveText;
            div.remove();
            return text;
        }
    }
}