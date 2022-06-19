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

export function removeElementChilds(element){while (element.firstChild)element.removeChild(element.lastChild);}

/* Diverses */


export function randomNumberBetween(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);}

export function sleep(duration) {return new Promise(resolve => setTimeout(resolve, duration));}
