/**
 * Central class storing all the data in memory, listeners and shit like this too.
 *
 */
import SensorDataDAO from "./storage/SensorDataDAO";
import ServerQuery from "./query/ServerQuery";
import {remove} from "./utils/arrayUtils";

class Receptor extends Object{
    // public final constants, not the most elegant way though
    static get ALL_SENSORS(){return "ALL";}


    #sensorDataArray            /* Array of all sensor data ? */
    #alertArray                 /* Array of all the alerts    */

    #sensorDataListeners        /* "Associative array" which stores all the listeners by the tag of their interest */
    #alertsListeners            /* "Associative array" which stores all the listeners by the tag of their interest */
    #sensorDataDao              /* The what should be the only instance of the sensorDataSAO */
    #serverQuery                /* Class giving us updates on whatever the server is up to */

    constructor() {
        super();
        this.#sensorDataDao = new SensorDataDAO();
        this.#serverQuery = new ServerQuery();
        this.#sensorDataListeners = {};
        this.#alertsListeners = {};
        this.#sensorDataArray = [];
        this.#alertArray = [];

        this.#serverQuery.listener = this;
        this.#serverQuery.startQueryingServer();
    }

    // Simple getter for the DAO
    get DAO(){ return this.#sensorDataDao; }


    /**
     * Pivoting point of the receptor, checks for alerts and stuff
     * @param sensorDataArray all the sensor data as an array
     */
    update(sensorDataArray){
        console.log("Update from server received");
        sensorDataArray.forEach(sensorData => {
            // Notify listeners if needed.
            if(Receptor.isAlert(sensorData)){
                Receptor.#notifyListeners(this.#alertsListeners, sensorData);
                this.#alertArray.push(sensorData);
            }
            Receptor.#notifyListeners(this.#sensorDataListeners, sensorData);
        });
        // Store the data in the array
        this.#sensorDataArray.push(sensorDataArray);

        // Send the data to the DAO
        this.#sensorDataDao.addSensorData(sensorDataArray);
    }


    /**
     * Return whether the sensorData is worthy of an alert.
     * @param sensorData The sensorData
     * @return {boolean} Whether or not it is alert worthy
     */
    static isAlert(sensorData){
        switch (sensorData.Nom){
            case "interieur":
                return sensorData.Valeur < 12 || sensorData.Valeur > 22;
            case "exterieur":
                return sensorData.Valeur < 0 || sensorData.Valeur > 35;
            default: return false;
        }
    }

    /** Notify the listener with the sensor data
     * @param object The object acting as an associative array
     * @param sensorData The sensor data
     */
    static #notifyListeners(object, sensorData){
        [Receptor.ALL_SENSORS, sensorData.Nom].forEach(category => {
            if(!object.hasOwnProperty(category)) return;
            // If we have this category
            object[category].forEach(listener => {
               listener.update(sensorData);
            });
        });

    }

    /**
     * Add a sensorData listener
     * @param listener A listener, implementing the update(sensorData) method.
     * @param sensorName The name of the sensor to listen to, by default it is ALL sensors. Case sensitive !
     */
    addSensorDataListener(listener, sensorName= Receptor.ALL_SENSORS){
        Receptor.#addListenerToList(this.#sensorDataListeners, listener, sensorName);
    }

    /**
     * Remove a sensorDataListener
     * @param listener The listener to remove
     * @param sensorName if set, it will remove the listener only for the selected sensor, else from all sensors
     */
    removeSensorDataListener(listener, sensorName = Receptor.ALL_SENSORS){
        Receptor.#removeListenerFromList(this.#sensorDataListeners, listener, sensorName);
    }


    /**
     * Add an alert listener
     * @param listener A listener, implementing the update(sensorData) method.
     * @param sensorName The name of the sensor to listen to, by default it is ALL sensors. Case sensitive !
     */
    addAlertListener(listener, sensorName= Receptor.ALL_SENSORS){
        Receptor.#addListenerToList(this.#alertsListeners, listener, sensorName);
    }

    /**
     * Remove an alertListener
     * @param listener The listener to remove
     * @param sensorName if set, it will remove the listener only for the selected sensor, else from all sensors
     */
    removeAlertListener(listener, sensorName = Receptor.ALL_SENSORS){
        Receptor.#removeListenerFromList(this.#alertsListeners, listener, sensorName);
    }


    /**
     * Add a listener to an object acting as an associative array
     * @param object The object containing the data
     * @param listener The listener with the update(data) function
     * @param sensorName The name of the sensor to listen to, ALL by default.
     */
    static #addListenerToList(object, listener, sensorName){
        if(object.hasOwnProperty(sensorName)){
            object[sensorName].push(listener);
            return;
        }
        object[sensorName] = [listener];
    }

    /**
     * Remove a listener.
     * @param object The object acting as an associative array
     * @param listener The listener to remove
     * @param sensorName if set, it will remove the listener only for the selected sensor, else from all sensors
     */
    static #removeListenerFromList(object, listener, sensorName){
        if(sensorName === Receptor.ALL_SENSORS){
            // Remove it from everywhere
            Object.getOwnPropertyNames(object).forEach(category => {
                remove(object[category], listener);
            });
            return;
        }
        // Else, just a specific category
        if(object.hasOwnProperty(sensorName)){
            remove(object[sensorName], listener);
        }
    }
}
let receptor = new Receptor();
export {Receptor as default, receptor};
