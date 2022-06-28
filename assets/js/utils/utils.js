/* Accès au DOM */

/**
 * Allow to easily access elements
 * @param {String } element The element name as an id or a class 
 * @param parent The element's parent
 *
 * @return The required element
 */
export function qs(element, parent = document){return parent.querySelector(element);}

/**
 * Allow to easily access all the same elements
 * @param {String } element The element name as a tag or a class 
 * @param parent The element's parent
 *
 * @return The required element
 */
export function qsa(element, parent = document){return [...parent.querySelectorAll(element)];}

/**
 * Add event listeners, a cleaner way
 * @param {String } type The type of the event (click, touch, mousedown) 
 * @param element The element concerned 
 * @param callback The callback to trigger
 * @param options The possible options of callbacks
 * @param parent The element's parent
 *
 * @return The required element
 */
export function addGlobalEventListener(
    type,
    element,
    callback,
    options,
    parent = document
) {
    parent.addEventListener(
        type,
        e => {
            if(e.target.matches(element)) callback(e);
        },
        options
    )
}

/**
 * Easy way to create elements
 * @param {String } type The type of the element 
 * @param options every attribute, classes and ids to set to the class 
 * @param parent The element's parent
 * @param {Boolean} prepend If set true, prepend the element instead of appending it
 *
 * @return The required element
 */
export function createElement(type, options = {}, parent = document.body, prepend = false) {
    const element = document.createElement(type);
    Object.entries(options).forEach(([key, value]) => {
        if (key === "class") {
            const classes = value.split(" ");
            classes.forEach(oneClass => element.classList.add(oneClass));
            return;
        }
        if (key === "dataset") {
            Object.entries(options).forEach(([dataKey, dataValue]) => {
            element.dataSet[dataKey] = dataValue;
            })
            return;
        }
        if (key === "text") {
            element.textContent = value;
            return;
        }
        element.setAttribute(key, value);
    })
    prepend ? parent.prepend(element): parent.append(element);
    return element;
}

/**
 * Toremove childs of an element
 * @param element The element whom child will be removed
 */
export function removeElementChilds(element){while (element.firstChild)element.removeChild(element.lastChild);}

/* Diverses */

/**
 * Give a number between two values
 * @param {Number} min Min value 
 * @param {Number} max Max value
 * 
 * @return The random number
 */
export function randomNumberBetween(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);}

/**
 * Set a pause in code execution
 * @param {Number} duration Duration of the pause
 * 
 * @return Some time
 */
export function sleep(duration) {return new Promise(resolve => setTimeout(resolve, duration));}

/**
 * Change the time by itself + the delta that is generated from the parameters
 * @param date The reference date
 * @param days The amount of days
 * @param hours The amount of hours
 * @param minutes The amount of minutes
 * @param seconds The amount of seconds
 * @return The new date, with the delta applied
 */
export function addTime(date, days=0, hours=0, minutes=0, seconds=0){
    let totalDelta = 8.64e+7 * days + 3.6e+6 * hours + 60000 * minutes + 1000 * seconds;
    return new Date(date.getTime() + totalDelta);
}

/**
 * Given a date, find the start of the current day
 * @param {Date|int} date: The date to get
 * @return {Date} The start of the day, as a Date instance
 */
export function getStartOfDay(date){
    // Pre-conversion
    if(typeof date === "number"){
        date = new Date(date);
    }

    date.setHours(0, 0, 0, 0);
    return date;
}

/**
 * Given a date, find the end of the current day
 * @param {Date|int} date: The date to get
 * @return {Date} The start of the day, as a Date instance
 */
export function getEndOfDay(date){
    // Pre-conversion
    if(typeof date === "number"){
        date = new Date(date);
    }
    date.setHours(23, 59, 59, 0);
    return date;
}
