/* Accès au DOM */


export function qs(element, parent = document){return parent.querySelector(element);}

export function qsa(element, parent = document){return [...parent.querySelectorAll(element)];}

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

export function createElement(type, options = {}) {
    const element = document.createElement(type);
    Object.entries(options).forEach(([key, value]) => {
        if (key === "class") {
            element.classList.add(value);
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
    return element;
}


/* Diverses */


export function randomNumberBetween(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);}

export function sleep(duration) {return new Promise(resolve => setTimeout(resolve, duration));}


/* Arrays */


export function firstElementsArray(array, n = 1) {
    if(n ===1)return array[0];
    return array.filter((_, index) => index < n );
}

export function lastElementsArray(array, n = 1) {
    if(n ===1)return array[array.length - 1];
    return array.filter((_, index) => array.length - index <= n );
}

export function sampleInArray(array) {
    return array[randomNumberBetween(0, array.length - 1)];
}

export function findByKeyArray(array, key) {return array.map(element => element[key]);}

export function groupByKeyArray(array, key){
    return array.reduce((group, element) => {
        const keyValue = element[key];
        return { ...group, [keyValue]: [...(group[keyValue] ?? []), element] }        
        }, {})
}