/**
 * Class tasked with any work related to localization
 */


import EN from "./EN";
import FR from "./FR";

class Localization extends Object{

    #languageDictionary = {};

    constructor() {
        super();
        this.#loadLanguage();
    }

    #loadLanguage(){
        let language = navigator.language.toLowerCase().split("-")[0];
        this.#createLanguage(language);
    }


    /**
     * Get a string adapted to the current language or stringName on last resort.
     * @param stringName The name of the string to get
     * @param formattedData An array of objects to fill a formatted string
     * @return {String} The text for the given language, formatted as needed
     */
    getText(stringName, ...formattedData){
        let string = this.#languageDictionary[stringName] ?? stringName;
        for(let formatData of formattedData){
            console.log(formatData);
            string = string.replace("##", formatData);
        }
        return string;
    }

    /**
     * Create the language dictionary by merging the base language and the target language
     * @param targetLanguage A string containing the language to create
     */
    #createLanguage(targetLanguage){
        this.#languageDictionary = {};
        Object.assign(this.#languageDictionary, EN.getTranslation());
        let originKeyNumber = Object.keys(this.#languageDictionary).length;
        switch (targetLanguage){
            case "fr": Object.assign(this.#languageDictionary, FR.getTranslation());
        }
        if(originKeyNumber !== Object.keys(this.#languageDictionary).length){
            console.error('DIFFERENT NUMBER OF KEYS UPON MERGING TARGET LANGUAGE: ' + targetLanguage);
        }
    }
}

export default new Localization();
