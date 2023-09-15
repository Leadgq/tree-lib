import { Decimal } from "decimal.js"
import { isAbleString, stringToNumber, reviseNumber, isAbleArray,isAbleNumber } from './base'
// 计算百分比
export const calculatePercentage = (value, total, dots = 2) => {
    if (!value) value = reviseNumber(value);
    if (!total) total = reviseNumber(total);
    if (isAbleString(value)) value = stringToNumber(value);
    if (isAbleString(total)) total = stringToNumber(total);
    if (total === 0) { 
        if (dots > 0) {
            // 根据dot的位数，在后面补0
            return '0.'.padEnd(dots + 2, '0');
        } else { 
            return '0';
        }
    }
    if (!isAbleNumber(value) || !isAbleNumber(total)) throw new Error('value or total is not a able number or  a  able string');
    const decimalValue = new Decimal(value);
    const decimalTotal = new Decimal(total);
    const decimalPercentage = decimalValue.dividedBy(decimalTotal).times(100).toFixed(dots);
    return decimalPercentage;
}
const rad = (d) => {
    return d * Math.PI / 180.0;
}
// 计算两个经纬度之间的距离
export const getDistance = (from,to) => {
    if (!isAbleArray(from) || !isAbleArray(to)) {
        throw new Error("from or to is not able array");
    }
    let lat1 = stringToNumber(from[0]);
    let lng1 = stringToNumber(from[1]);
    let lat2 = stringToNumber(to[0]);
    let lng2 = stringToNumber(to[1]);
    const EARTH_RADIUS = 6378.137;
    let radLat1 = rad(lat1);
    let radLat2 = rad(lat2);
    let a = radLat1 - radLat2;
    let b = rad(lng1) - rad(lng2);
    let s = 2 * Math.asin(Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = (s * 10000) / 10;
    return Math.round(s);
}