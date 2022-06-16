
/**
 * A linear interpolator for hex colors.
 * Thanks to: https://gist.github.com/nikolas/b0cce2261f1382159b507dd492e1ceef
 *
 * @param {Number} a  (hex color start val)
 * @param {Number} b  (hex color end val)
 * @param {Number} amount  (the amount to fade from a to b) between 0 and 1;
 *
 * @example
 * // returns 0x7f7f7f
 * lerpColor(0x000000, 0xffffff, 0.5)
 *
 * @returns {Number}
 */
export function lerpColor(a, b, amount) {
    
    const ar = a >> 16,
        ag = a >> 8 & 0xff,
        ab = a & 0xff,

        br = b >> 16,
        bg = b >> 8 & 0xff,
        bb = b & 0xff,

        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return (rr << 16) + (rg << 8) + (rb | 0);
}

/**
 * Same as lerpColor, but with strings instead
 * @param {String} a The color to start from
 * @param {String} b The target color
 * @param {Number} amount  (the amount to fade from a to b) between 0 and 1;
 *
 * @return {String} the color as a string
 */
export function lerpColorFromString(a, b, amount){
    let aNumber = parseInt(a.replace("#", "0x"), 16);
    let bNumber = parseInt(b.replace("#", "0x"), 16);

    return "#" + lerpColor(aNumber, bNumber, amount).toString(16);
}