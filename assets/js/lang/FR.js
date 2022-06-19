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
            welcome : "Bienvenue ##",
            alert_context_outside_hot : "Hot Hot Hot !",
            alert_context_outside_cold : "Banquise en vue !",
            alert_context_inside_hot : "Baissez le chauffage !",
            alert_context_inside_superhot : "Appelez les pompiers ou arrêtez votre barbecue !",
            alert_context_inside_cold : "Montez le chauffage ou mettez un gros pull !",
            alert_context_inside_supercold : "Canalisations gelées, appelez SOS plombier et mettez un bonnet !",
            alert_context_error : "Erreur, il ne s'agit pas d'une alerte valide"
        };
    }
}
