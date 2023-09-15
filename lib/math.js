import {Decimal} from "decimal.js"
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
    const decimalValue = new Decimal(value);
    const decimalTotal = new Decimal(total);
    const decimalPercentage = decimalValue.dividedBy(decimalTotal).times(100).toFixed(dots);
    return decimalPercentage;
}