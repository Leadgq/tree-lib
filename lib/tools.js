export const getArrayDifference = (arr1, arr2, key) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        console.warn(`arr1 and arr2  muse be array`);
        return [];
    }
    if (!key) {
        console.warn(`key is required`);
        return [];
    }
    return arr1.filter(item => !arr2.map(item2 => item2[key]).includes(item[key]));
}