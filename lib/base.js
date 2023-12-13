export const isAbleArray = arr => Array.isArray(arr) && arr.length > 0

export const isAbleObject = obj => Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).length > 0

export const isAbleSet = set => Object.prototype.toString.call(set) === '[object Set]' && set.size > 0

export const isAbleMap = map => Object.prototype.toString.call(map) === '[object Map]' && map.size > 0

export const isAbleString = str => typeof str === 'string' && str.length > 0

export const isAbleNumber = num => typeof num === 'number' && !isNaN(num)

export const isAbleFn = fn => typeof fn === 'function'

export const reviseNumber = num => {
    if (!num || isNaN(num)) return 0;
    return num;
}

export const stringToNumber = (str) => {
    if (!str) return 0
    return Number(str);
}

export const isHasChange = (oldVal, newVal) => !Object.is(oldVal, newVal);

export const isBaseTypeArray = arr => {
    if (!isAbleArray(arr)) return false;
    return arr.every(item => ['string', 'number', 'boolean'].includes(typeof item))
}

export const isObjectArray = arr => {
    if (!isAbleArray(arr)) return false;
    return arr.every(item => isAbleObject(item))
}

export const arrayLength = (arr) => {
    if (!isAbleArray(arr)) return 0;
    return arr.length;
}

export const arrToStr = (arr, stringIdentifier) => {
    if (!isAbleArray(arr)) return '';
    return arr.join(stringIdentifier);
}

export const strToArr = (str, stringIdentifier) => {
    if (!isAbleString(str)) return [];
    return str.split(stringIdentifier);
}

export const getObjetValues = (obj) => {
    if (!isAbleObject(obj)) return [];
    return Object.values(obj);
}

export const getObjetKeys = (obj) => {
    if (!isAbleObject(obj)) return [];
    return Object.keys(obj);
}

export const getObjectEntries = (obj) => {
    if (!isAbleObject(obj)) return [];
    return Object.entries(obj);
}

export const getMapSize = map => {
    if (!isAbleMap(map)) return 0;
    return map.size;
}

export const getSetSize = set => {
    if (!isAbleSet(set)) return 0;
    return set.size;
}

export const isAsync = (fn) => {
    if (!isAbleFn(fn)) {
        throw new Error(`fn muse be function`);
    }
    return fn.constructor.name === 'AsyncFunction';
}


export const objIsContainsKey = (obj, key) => {
    if (!isAbleObject(obj)) return false;
    if (Object.hasOwn) {
        return Object.hasOwn(obj, key);
    }
    return obj.hasOwnProperty(key)
}


export const typeofData = (data) => {
    return Object.prototype.toString.call(data).slice(8, -1);
}