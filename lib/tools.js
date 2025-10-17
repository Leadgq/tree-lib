import {
    isAbleArray,
    isAbleFn,
    isBaseTypeArray,
    isObjectArray,
    isAbleNumber,
    isAbleString,
    stringToNumber,
    objIsContainsKey,
    isAbleObject,
    getTypeName,
    getObjectEntries,
    getObjetKeys,
    arrayLength, typeofData,
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
 * @param { Array } arr
 * @param { Array } arr2
 * @param { string } key
 * @returns { Array }
 * @description 获取arr对于arr2的差集
 * @example getLeftDifference([{id:1},{id:2},{id:3}], [{id:1},{id:2},{id:4}], 'id') => [{id:3}]
 */
export const  getLeftDifference = (arr, arr2, key) => {
    if (!isAbleArray(arr) || !isAbleArray(arr2)) {
        throw new Error(`arr and arr2  muse be array  and arr.length > 0 and arr2.length > 0 `);
    }
    return  arr.filter(item => !arr2.some(item2 => item2[key] === item[key]));
}


/**
 * @description 获取随机颜色
 * @returns { string }
 * @example getRandomColor() => #123456
 */
export const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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
    if (!window) {
        throw new Error(`The current method should run on the web or H5`);
    }
    try {
        return Object.fromEntries(new URLSearchParams(window.location.search));
    } catch (error) {
        throw new Error(`${error}`);
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
 *  @description 剪贴板
 */
export class Clipboard {
    saveText;

    async copyTextByClipboard(text) {
        if (!text) {
            throw new Error(`text  muse be need please input text`);
        }
        this.saveText = text;
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                this.copyByDom(text)
            }
        } else {
            this.copyByDom(text)
        }
    }

    async readTextByClipboard() {
        if (navigator?.clipboard?.readText) {
            try {
                return await navigator.clipboard.readText();
            } catch {
                return await this.readeTextByDom();
            }
        } else {
            return await this.readeTextByDom();
        }
    }

    copyByDom(text) {
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

    async readeTextByDom() {
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

/**
 * @description 函数重载
 * @example
 *  const testFn = createOverload();
 *  const strFn = (...args) => {console.log(args);}
 *  testFn.addImpl('string', strFn)
 *  testFn.addImpl('string', 'string', strFn)
 *  testFn.addImpl('string', 'string', 'string',strFn)
 *  testFn('1', '2','我是第三个参数')
 */
export const createOverload = () => {
    const fnMap = new Map();

    function overload(...args) {

        const key = args.map(item => {
            const isArray = Array.isArray(item);
            if (isArray) {
                return 'array';
            } else {
                return typeof item
            }
        }).join(',');

        if (fnMap.has(key)) {
            return fnMap.get(key).apply(this, args);
        } else {
            throw new Error(`fn is not exist`);
        }

    }

    overload.addImpl = function (...args) {
        if (!isAbleFn(args[args.length - 1])) {
            throw new Error(`fn muse be function`);
        }
        const fn = args.pop();
        const key = args.join(',');
        fnMap.set(key, fn);
    }
    return overload
}

export const uniqueArray = createOverload();
/**
 * @description 数组去重
 * @description 去除对象数组中的重复项
 * @returns { Array }
 * @param { Array } arr
 * @param { string | Function }
 * @example uniqueArray([],'id')
 * @example uniqueArray([],(a,b) => a.id !== b.id)
 */
uniqueArray.addImpl('array', 'string', (...args) => {
    const [arr, key] = args
    if (!isAbleArray(arr)) {
        throw new Error(`arr muse be array`);
    }
    if (!isAbleString(key)) {
        throw new Error(`key muse be string`);
    }
    if (isAbleString(key) && isObjectArray(arr)) {
        const map = genderMapAndSetMapKey(arr, key);
        return [...map.values()];
    } else {
        return [];
    }
})

uniqueArray.addImpl('array', 'function', (...args) => {
    const [arr, equalFn] = args;
    if (!isAbleArray(arr)) {
        throw new Error(`arr muse be array`);
    }
    if (!isAbleFn(equalFn)) {
        throw new Error(`equalFn muse be function`);
    }
    return arr.reduce((acc, cur) => {
        const index = acc.findIndex((item) => equalFn(cur, item))
        if (index === -1) acc.push(cur)
        return acc
    }, [])
})

/**
 *  @description 生成随机数
 *  @param { number } min
 *  @param { number } max
 *  @returns { number }
 */
export const genderRandom = (min, max) => {
    if (!isAbleNumber(min) || !isAbleNumber(max)) {
        throw new Error(`min and max muse be number`);
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 *  @description 重构对象
 *  @param { Object } obj
 *  @param { Function } fn
 *  @returns { Object }
 * @example objectMap({},(k,v)=>{ return  [k,v2]  })
 */
export function objectMap(obj, fn) {
    if (!isAbleObject(obj)) {
        throw new Error(`obj muse be object`);
    }
    if (!isAbleFn(fn)) {
        throw new Error(`fn muse be function`);
    }
    return Object.fromEntries(
        getObjectEntries(obj)
            .map(([k, v]) => fn(k, v))
            .filter(Boolean),
    )
}

/**
 *  @description 挑选对象
 *  @param { Object } obj
 *  @param { String } props
 *  @returns { Object }
 *  @example pickObject({a:1,b:2,3:3},['a','b']) ==> {a:1,b:2}
 *  @example pickObject({a:1,b:2,3:3},(k,v) => k !== '3') ==> {a:1,b:2}
 */
export const pickObject = createOverload();

pickObject.addImpl('object', 'array', (...args) => {
    const [obj, props] = args;
    if (!isAbleObject(obj)) {
        throw new Error(`obj muse be object`);
    }
    if (props.some(prop => !isAbleString(prop))) {
        throw new Error(`props muse be string`);
    }
    return Object.fromEntries(
        getObjectEntries(obj).filter(([key]) => props.includes(key)
        )
    )
})

pickObject.addImpl('object', 'function', (...args) => {
    const [obj, handlerFn] = args;
    if (!isAbleObject(obj)) {
        throw new Error(`obj muse be object`);
    }
    if (!isAbleFn(handlerFn)) {
        throw new Error(`handlerFn muse be function`);
    }
    return Object.fromEntries(
        getObjectEntries(obj).filter(([key, value]) => handlerFn(key, value)
        )
    )
})

/**
 *  @description 排除对象
 *  @param { Object } obj
 *  @param { String } props
 *  @returns { Object }
 *  @example omitObject({a:1,b:2,3:3},['a']) ==> {b:2}
 *  @example omitObject({a:1,b:2,3:3},(k,v) => k !== '3') ==> {a:1,b:2}
 */
export const omitObject = createOverload();

omitObject.addImpl('object', 'array', (...args) => {
    const [obj, props] = args;
    if (!isAbleObject(obj)) {
        throw new Error(`obj muse be object`);
    }
    if (props.some(prop => !isAbleString(prop))) {
        throw new Error(`props muse be string`);
    }
    return Object.fromEntries(
        getObjectEntries(obj).filter(([key]) => !props.includes(key)
        )
    )
})

omitObject.addImpl('object', 'function', (...args) => {
    const [obj, handlerFn] = args;
    if (!isAbleObject(obj)) {
        throw new Error(`obj muse be object`);
    }
    if (!isAbleFn(handlerFn)) {
        throw new Error(`handlerFn muse be function`);
    }
    return Object.fromEntries(
        getObjectEntries(obj).filter(([key, value]) => !handlerFn(key, value)
        )
    )
})

/**
 *  @description 深度比较对象
 *  @param { Object } obj1
 *  @param { Object } obj2
 *  @returns { Boolean }
 *  @example isDeepEqual({a:1,b:2},{a:1,b:2}) ==> true
 *  @example isDeepEqual({a:1,b:2},{a:1,b:3}) ==> false
 **/
export function isDeepEqual(value1, value2) {
    const type1 = getTypeName(value1)
    const type2 = getTypeName(value2)
    if (type1 !== type2) {
        return false;
    }

    if (type1 === 'array') {
        if (value1.length !== value2.length)
            return false

        return value1.every((item, i) => {
            return isDeepEqual(item, value2[i])
        })
    }
    if (type1 === 'object') {
        const keyArr1 = getObjetKeys(value1),
            keyArr2 = getObjetKeys(value2);

        if (arrayLength(keyArr1) !== arrayLength(keyArr2)) {
            return false
        }

        return keyArr1.every((key) => {
            return isDeepEqual(value1[key], value2[key])
        })
    }
    return Object.is(value1, value2)
}

/**
 *  @description 深度克隆
 *  @param { Object } value
 *  @returns { Object }
 *  @example deepClone({a:1,b:2}) ==> {a:1,b:2}
 *  @example deepClone([1,2,3]) ==> [1,2,3]
 **/
export const deepClone = (value) => {
    const cache = new Map();

    function _deepClone(value) {
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        if (cache.has(value)) {
            return cache.get(value);
        }
        let result = Array.isArray(value) ? [] : {};
        cache.set(value, result);
        for (const key in value) {
            result[key] = _deepClone(value[key]);
        }
        return result;
    }

    return _deepClone(value)
}

/**
 * @description 获取文件中的每一帧
 *  @param { File } file
 *  @param { Number } time 每一帧的时间间隔(单位:秒)
 *  @param { Boolean } isUseInterval 是否使用间隔 为false只会获取这一帧
 *  @returns { Map }
 *  @example await captureFrame({ file, 20  }) ==> Map { blob => {url:blobUrl,time:20},blob => {url:blobUrl,time:40} }
 */
export async function captureFrame({ file, time = 0, isUseInterval = true }) {
    const map = new Map()
    try {
        if (!file) {
            throw new Error('file is required')
        }
        if (!file.file) {
            throw new Error('file.file is required')
        }
        if (!file.file.type.includes('video')) {
            throw new Error('file.file.type must be video')
        }

        const video = document.createElement('video')
        video.muted = true
        video.autoplay = true
        video.src = URL.createObjectURL(file.file)

        await new Promise((resolve) => video.oncanplay = resolve)

        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        function _clearCanvas() {
            canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        }

        function _drawImage() {
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
        }

        function _destroyVideoAndCanvas() {
            video.remove()
            canvas.remove()
        }

        function getBlob() {
            return new Promise((resolve) => {
                canvas.toBlob((blob) => resolve(blob));
            })
        }

        if (!isUseInterval) {
            video.currentTime = time
            await new Promise((resolve) => {
                video.onseeked = resolve;
            });
            _drawImage();
            const blob = await getBlob();
            map.set(blob, {
                url: URL.createObjectURL(blob),
            })
            _clearCanvas();
        } else {
            for (let i = 0; i < video.duration; i += time) {
                video.currentTime = i
                await new Promise((resolve) => {
                    video.onseeked = resolve;
                });
                _drawImage();
                const blob = await getBlob();
                map.set(blob, {
                    url: URL.createObjectURL(blob),
                    time: i
                });
                _clearCanvas();
            }
        }
        _destroyVideoAndCanvas();
    } catch (error) {
        console.error('Error capturing frame:', error)
    }
    return map
}

/**
 * @description 合并url和参数
 * @param url {String}
 * @param params {Object}
 */
export const jointUrl = (url, params) => {
    function _checkParamsIsAble(params) {
        return pickObject(params, (k, v) => {
            if (typeofData(v) === 'Array') {
                return isAbleArray(v)
            }
            if (typeofData(v) === 'Object') {
                return isAbleObject(v)
            }
            return v
        })
    }

    const ableParams = _checkParamsIsAble(params)
    const ableUrl = url.includes('?') ? `${url}&` : `${url}?`
    return `${ableUrl}${Object.keys(ableParams).map(key => `${key}=${ableParams[key]}`).join('&')}`;
}

/**
 * @description 确保只返回最后一次请求的结果，忽略之前的请求结果
 * @param {Function} fn 异步请求函数
 * @param {Object} options 配置项
 * @returns {Function} 包装后的函数
 */
export const onlyLastHttpValue = (fn) => {
    let requestId = 0;

    return async function (...args) {
        const currentRequestId = ++requestId;

        try {
            const result = await fn.apply(this, args);
            // 只返回最后一次请求的结果
            if (currentRequestId === requestId) {
                return result;
            }
            // 丢弃非最后一次请求的结果
            return null;
        } catch (error) {
            if (currentRequestId === requestId) {
                throw error;
            }
            return null;
        }
    };
};

/**
 * @description 阿拉伯数字转罗马数字
 * @param {Number} num 阿拉伯数字
 * @returns {String} 罗马数字
 */
export function arabicToRoman(num) {
    const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    let result = ''
    for (let i = 0; i < values.length; i++) {
        while (num >= values[i]) {
            result += romanNumerals[i]
            num -= values[i]
        }
    }
    return result
}

/**
 * @description base64转blob
 * @param {String} base64 base64字符串
 * @returns {Blob} blob
 */
export function dataUrlToBlob(base64) {
    let bytes = window.atob(base64.split(',')[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/jpeg'});
}

/**
 * @description blob转base64
 * @param {Blob} blob blob
 * @returns {Promise<string>} base64
 */
export function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve(e.target.result);
        };
        fileReader.readAsDataURL(blob);
        fileReader.onerror = () => {
            reject(new Error('blobToBase64 error'));
        };
    });
}

/**
 * @description 计算base64图片大小
 * @param {string} base64Str base64字符串
 * @returns {Object} 包含不同单位的大小 { bytes: number, kb: number, mb: number }
 * @throws {Error} 当输入的base64字符串格式不正确时抛出错误
 * @example
 * calculateImageSize('data:image/jpeg;base64,/9j/4AAQSkZJRg...')
 * // => { bytes: 1024, kb: 1, mb: 0.001 }
 */
export function calculateImageSize(base64Str) {
    if (!base64Str || typeof base64Str !== 'string') {
        throw new Error('Invalid base64 string');
    }

    const indexBase64 = base64Str.indexOf('base64,');
    if (indexBase64 < 0) {
        throw new Error('Invalid base64 format: missing "base64,"');
    }

    // 计算字节数：base64字符串长度 * 0.75
    const str = base64Str.substring(indexBase64 + 7);
    const bytes = Math.floor(str.length * 0.75);

    return {
        bytes,
        kb: Number((bytes / 1024).toFixed(2)),
        mb: Number((bytes / (1024 * 1024)).toFixed(2))
    };
}
/**
 * @description 将时间转换为分钟
 * @param {String} time 时间字符串，格式为HH:mm:ss
 * @return {Number} 转换后的分钟数
 */
export function toMinutes(time) {
    const [hours = 0, minute = 0, second = 0] = time.split(":").map(Number);
    if (second) {
        return hours * 60 + minute + (second / 60);
    }
    return hours * 60 + minute
}

/**
 * @description 是否存在交集
 * @param {Array} intervals 时间区间数组，每个区间是一个对象，包含startTime和endTime属性
 * @param {Boolean} isNotBoundary 是否不包含边界
 * @return {Boolean} 是否存在交集
 * @example
  const intervals = [{ startTime: '08:00:00', endTime: '12:00:00' }, { startTime: '14:00:00', endTime: '18:00:00' }];
  addNonOverlappingTimeSlot(intervals); // false
  const intervals2 = [{ startTime: '08:00:00', endTime: '12:00:00' }, { startTime: '12:00:00', endTime: '18:00:00' }];
  addNonOverlappingTimeSlot(intervals); // false
  addNonOverlappingTimeSlot(intervals,true); // true
 */
export function addNonOverlappingTimeSlot(intervals, isNotBoundary = false) {
    let flatIntervals = [];
    for (const {startTime, endTime} of intervals) {
        const start = toMinutes(startTime);
        const end = toMinutes(endTime);
        if (start < end) {
            flatIntervals.push([start, end]);
        } else if (start > end) {
            flatIntervals.push([start, 24 * 60]);
            flatIntervals.push([0, end]);
        }
    }
    flatIntervals.sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < flatIntervals.length; ++i) {
        if (isNotBoundary) {
            if (flatIntervals[i][0] <= flatIntervals[i - 1][1]) {
                return true;
            }
        } else if (!isNotBoundary) {
            if (flatIntervals[i][0] < flatIntervals[i - 1][1]) {
                return true;
            }
        }
    }
    return false;
}


// 导出一个函数，用于判断文件名是否为图片
export function isImageByExtension(filename) {
    // 使用正则表达式判断文件名是否为图片
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i.test(filename);
}


console.log('isImageByExtension', isImageByExtension('test.jpg'));


console.log('toMinutes', toMinutes('08:00:00'));
