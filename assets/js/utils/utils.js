export function qs(element){return document.querySelector(element);}

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