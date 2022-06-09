/**
 * The French dictionary, used by Localization upon loading
 * Note that the special chain ## denotes a spot for data to be placed in on the fly
 */
export default class FR extends Object{

    /**
     * Gives back an object containing ALL translations, but in French
     * @return {{}}
     */
    static getTranslation(){
        return {
            welcome : "Bienvenue ##"
        };
    }
}
