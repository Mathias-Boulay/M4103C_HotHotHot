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
            welcome : "Hello ##",
            alert_context_outside_hot : "Hot Hot Hot !",
            alert_context_outside_cold : "Iceberg in sight !",
            alert_context_inside_hot : "Turn the heat down !",
            alert_context_inside_superhot : "Call the Firefighters or stop your barbecue!",
            alert_context_inside_cold : "Turn up the heat or put on a heavy sweater!",
            alert_context_inside_supercold : "Frozen pipes, call a plumber and put on a woolly hat!",
            alert_context_error : "Error, this alert is not valid"
        };
    }
}
