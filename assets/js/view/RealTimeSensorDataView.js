import {createElement} from "../utils/utils";
import {receptor} from "../Receptor";
import {lerpColor, lerpColorFromString} from "../utils/colorUtils";

export default class RealTimeSensorDataView extends Object {
    #rootView;              /* Root div, being colored at will */
    #temperatureView;       /* Text displaying the current temperature */

    /**
     * Creates a new instance of the RealTimeSensorData, attaches it to the parent
     * @param parent
     * @param sensorName The name of the sensor to listen to.
     */
    constructor(parent, sensorName) {
        super();

        this.#rootView = createElement("div", {class: "realTimeSensorDataView"}, parent);
        let sensorNameText = createElement("p", {}, this.#rootView);
        this.#temperatureView = createElement("p", {}, this.#rootView);

        receptor.addSensorDataListener(this, sensorName);

        this.#temperatureView.textContent = "33.3"
        sensorNameText.textContent = sensorName;
        console.log(lerpColorFromString("#0061FF", "#FF3700", 0.5));
    }

    /**
     * Update the state of the view to display the current temperature
     * @param sensorData
     */
    update(sensorData){
        this.#temperatureView.textContent = sensorData.Valeur.toString();
        this.#rootView.style.backgroundColor = `${lerpColorFromString("#00FFAE", "#FF3700", sensorData.Valeur/30)}`;
    }



}