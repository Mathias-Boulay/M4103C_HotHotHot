/**
 * Clamp the number between two extremes
 * @param {Number} number The current value
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 *
 * @return {Number} The clamped value
 */
 export function clamp(number, min, max){
    return Math.min(Math.max(number, min), max);
}

/**
 * Allow to re-maps a number from one range to another
 * Inspired by: https://www.arduino.cc/reference/en/language/functions/math/map/
 * 
 * @param {Number} number The current number
 * @param {Number} in_min The minimum range of the input number
 * @param {Number} in_max The maximum range of the input number
 * @param {Number} out_min The minimum range of the output number
 * @param {Number} out_max The maximum range of the output number
 * 
 * @return {Number} The new value in the output range
 */
export function map(number, in_min, in_max, out_min, out_max) {
    return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}