/**
 * The English dictionary, used by Localization upon loading
 * Note that the special chain ## denotes a spot for data to be placed in on the fly
 */
export default class EN extends Object{

    /**
     * Gives back an object containing ALL translations, as English is considered the base one
     * @return {{}}
     */
    static getTranslation(){
        return {
            welcome : "Hello ##"
        };
    }
}
