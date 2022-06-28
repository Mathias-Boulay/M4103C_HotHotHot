import {randomNumberBetween} from "./utils";

/**
 * Give the first(s) element(s) of an array
 * @param {Array} array The concerned array 
 * @param {Number} n number of elements to return
 * 
 * @return The list of concerned elements
 */
export function firstElementsArray(array, n = 1) {
    if(n ===1)return array[0];
    return array.filter((_, index) => index < n );
}

/**
 * Give the last(s) element(s) of an array
 * @param {Array} array The concerned array 
 * @param {Number} n number of elements to return
 * 
 * @return The list of concerned elements
 */
export function lastElementsArray(array, n = 1) {
    if(n ===1)return array[array.length - 1];
    return array.filter((_, index) => array.length - index <= n );
}

/**
 * Give a random element of an array
 * @param {Array} array The concerned array 
 * 
 * @return The concerned element
 */
export function sampleInArray(array) {
    return array[randomNumberBetween(0, array.length - 1)];
}

/**
 * Give the first(s) element(s) of an array
 * @param {Array} array The concerned array 
 * @param {Number} key Associed key to the element
 * 
 * @return The concerned element
 */
export function findByKeyArray(array, key) {return array.map(element => element[key]);}

/**
 * Group elements of an array which have the same key
 * @param {Array} array The concerned array 
 * @param {Number} key Associed key to the element
 * 
 * @return Elements grouped by the same key
 */
export function groupByKeyArray(array, key){
    return array.reduce((group, element) => {
        const keyValue = element[key];
        return { ...group, [keyValue]: [...(group[keyValue] ?? []), element] }
    }, {})
}

/**
 * Remove every instance of {object} in the array, stopping at count
 * @param array The array to splice
 * @param object The instance to remove everywhere
 * @param count Up to how many instance we remove. If not set, do not stop.
 */
export function remove(array, object, count = -1){
    let removalCount = 0
    for (let i = 0; i < array.length && (removalCount < count || removalCount === -1); i++) {
        if(array[i] === object){
            array.splice(i, 1);
            removalCount ++;
            i--; // Since we will have a new value at the current index.
        }
    }
}