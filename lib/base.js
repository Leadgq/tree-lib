const isAbleArray = arr => Array.isArray(arr) && arr.length > 0

const isAbleObject = obj => Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).length > 0

const isAbleSet = set => Object.prototype.toString.call(set) === '[object Set]' && set.size > 0

const isAbleMap = map => Object.prototype.toString.call(map) === '[object Map]' && map.size > 0

const isAbleString = str => typeof str === 'string' && str.length > 0

const isAbleNumber = num => typeof num === 'number' && !isNaN(num)

const isAbleFn = fn => typeof fn === 'function'

const reviseNumber = num => {
    if (!num || isNaN(num)) return 0;
    return num;
}

const stringToNumber = (str) => {
    if (!str) return 0
    return Number(str);
}

const isHasChange = (oldVal, newVal) => !Object.is(oldVal, newVal);

const isBaseTypeArray = arr => {
    if (!isAbleArray(arr)) return false;
    return arr.every(item => ['string', 'number', 'boolean'].includes(typeof item))
}

const isObjectArray = arr => {
    if (!isAbleArray(arr)) return false;
    return arr.every(item => isAbleObject(item))
}

const arrayLength = (arr) => {
    if (!isAbleArray(arr)) return 0;
    return arr.length;
}

const arrToStr = (arr, stringIdentifier) => {
    if (!isAbleArray(arr)) return '';
    return arr.join(stringIdentifier);
}

const strToArr = (str, stringIdentifier) => {
    if (!isAbleString(str)) return [];
    return str.split(stringIdentifier);
}

const getObjetValues = (obj) => {
    if (!isAbleObject(obj)) return [];
    return Object.values(obj);
}

const getObjetKeys = (obj) => {
    if (!isAbleObject(obj)) return [];
    return Object.keys(obj);
}

const getObjectEntries = (obj) => {
    if (!isAbleObject(obj)) return [];
    return Object.entries(obj);
}

const getMapSize = map => {
    if (!isAbleMap(map)) return 0;
    return map.size;
}

const getSetSize = set => {
    if (!isAbleSet(set)) return 0;
    return set.size;
}

const isAsync = (fn) => {
    if (!isAbleFn(fn)) {
        throw new Error(`fn muse be function`);
    }
    return fn.constructor.name === 'AsyncFunction';
}


const objIsContainsKey = (obj, key) => {
    if (!isAbleObject(obj)) return false;
    if (Object.hasOwn) {
        return Object.hasOwn(obj, key);
    }
    return obj.hasOwnProperty(key)
}


const typeofData = (data) => {
    return Object.prototype.toString.call(data).slice(8, -1);
}

const getTypeName = (v) => {
    if (v === null) {
        return 'null'
    }
    const type = typeofData(v).toLowerCase()
    return (typeof v === 'object' || typeof v === 'function') ? type : typeof v
}



export {
    isAbleArray,
    isAbleFn,
    isAbleObject,
    isAbleString,
    isAbleNumber,
    isHasChange,
    isAsync,
    reviseNumber,
    stringToNumber,
    arrayLength,
    arrToStr,
    strToArr,
    isAbleSet,
    isAbleMap,
    getMapSize,
    getSetSize,
    getObjetValues,
    getObjetKeys,
    getObjectEntries,
    objIsContainsKey,
    typeofData,
    isObjectArray,
    isBaseTypeArray,
    getTypeName
}

console.log('base.js')
