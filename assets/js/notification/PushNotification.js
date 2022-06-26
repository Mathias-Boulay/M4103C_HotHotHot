import { AlertsView } from "./../view/AlertsView.js";
import { receptor } from "./../Receptor";

export class PushNotification extends Object
{
    #captorName;
    #value;
    #timestamp;
    #context;
    #date;

    constructor(){
        super();
        receptor.addAlertListener(this);
    }



    update(sensorData){

        this.#captorName = sensorData.Nom;
        this.#value      = sensorData.Valeur;
        this.#timestamp  = sensorData.Timestamp;
        this.#context    = AlertsView.obtainAlertContext(this.#captorName, this.#value);
        this.#date       = AlertsView.obtainDate(this.#timestamp);

    }


}