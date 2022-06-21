import {createElement} from "../utils/utils";
import {receptor} from "../Receptor";
import {lerpColor, lerpColorFromString} from "../utils/colorUtils";

export default class RealTimeSensorDataView extends Object {
    #rootView;              /* Root div, being colored at will */
    #temperatureView;       /* Text displaying the current temperature */

    /**
     * Creates a new instance of the RealTimeSensorData, attaches it to the parent
     * @param parent The parent HTMLElement to which the
     * @param sensorName The name of the sensor to listen to.
     */
    constructor(parent, sensorName) {
        super();

        this.#rootView = createElement("div", {class: "realTimeSensorDataView"}, parent);
        let sensorNameText = createElement("p", {}, this.#rootView);
        this.#temperatureView = createElement("p", {}, this.#rootView);

        receptor.addSensorDataListener(this, sensorName);
        // Load the last saved temperature
        receptor.DAO.getSensorData({limit:1, filters:sensorName, order:"descending"}).then(result => {
            this.#setTemperature(result ? result[0].Valeur : 0)
        });
        sensorNameText.textContent = sensorName;
    }

    /** Proxy method called because we are a Receptor listener */
    update(sensorData){
        this.#setTemperature(sensorData.Valeur);
    }

    /**
     * Update the state of the view to display the current temperature
     * @param temperature The current temperature
     */
    #setTemperature(temperature){
        this.#temperatureView.textContent = temperature.toString();
        this.#rootView.style.backgroundColor = `${lerpColorFromString("#00FFAE", "#FF3700", temperature/30)}`;
    }


}