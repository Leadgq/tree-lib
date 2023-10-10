export const isAbleArray = arr => Array.isArray(arr) && arr.length > 0
export const isAbleObject = obj => Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).length > 0
export const isAbleString = str => typeof str === 'string' && str.length > 0
export const isAbleNumber = num => typeof num === 'number' && !isNaN(num)
export const isAbleFn = fn => typeof fn === 'function'
export const reviseNumber = num => {
    if (!num) return 0;
    return num;
}
export const stringToNumber = (str) => {
    if (!str) return 0
    return Number(str);
}
export const isHasChange = (oldVal, newVal) => !Object.is(oldVal, newVal)