/**
 * Class in charge of retrieving the server data by any mean necessary
 * https://hothothot.dog/api/capteurs/
 * wss://ws.hothothot.dog:9502
 *
 */
import QueryAPI from "./QueryAPI";
import QueryWebsocket from "./QueryWebsocket";

export default class ServerQuery extends Object{
    // Some variables are private
    #listener           /* Object implementing an update(array) */
    #queryStrategy      /* The object in charge of doing the effective query */

    constructor() {
        super();

        /* Observer getting the updated data */
        this.#listener = null;
        this.#queryStrategy = new QueryWebsocket(
            "wss://ws.hothothot.dog:9502",
            event => this.#updateListener(event),
            () => this.#switchQueryStrategy());
    }

    /** Start querying the server */
    startQueryingServer(){
        this.#queryStrategy.startQuery();
    }

    /** Stops querying the server */
    stopQueryingServer(){
        this.#queryStrategy.stopQuery();
    }

    #switchQueryStrategy(){
        console.log("switching query strategy")
        this.#queryStrategy.stopQuery();
        this.#queryStrategy = new QueryAPI(
            "https://hothothot.dog/api/capteurs/",
            event => this.#updateListener(event),
            () => console.error("this case wasn't handled, shout it switch back to websocket ?"),
            5000);
        this.#queryStrategy.startQuery();
    }

    /** @param newListener The listener object */
     set listener(newListener){
        this.#listener = newListener;
    }


    /**
     * Update the listener after sanitizing
     * @param sensorDataArray
     */
    #updateListener(sensorDataArray){
        if(this.#sanitizeSensorData(sensorDataArray)){
            this.#listener.update(sensorDataArray);
        }
    }


    /**
     * Sanitize and normalize the data to guarantee the "type" of it.
     * Let's say we don't expect a string with SQLERROR instead of a float for the temperature
     * Also, the timestamp has to be converted into ms instead of seconds
     * @param sensorDataArray An array of sensor data object
     * @return {Array|boolean} The array, with sanitization, false otherwise
     */
    #sanitizeSensorData(sensorDataArray){
        sensorDataArray.forEach(sensorData => {
            let convertedValue = parseFloat(sensorData.Valeur);
            if(isNaN(convertedValue)) return false; // Fallback for SQLERROR

            sensorData.Valeur = convertedValue;
            sensorData.Timestamp *= 1000;
        });
        return sensorDataArray;
    }


}