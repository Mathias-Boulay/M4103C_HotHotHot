/**
 * Class charged of accessing and storing
 * all the sensor data into the IndexedDB
 */
export default class SensorDataDAO extends Object {
    static #DATABASE_NAME = "sensor_history";
    static #MAIN_OBJECT_STORE_NAME = "sensors";
    static #CURRENT_VERSION = 1;
    #databaseInstance;                          /* The instance of the opened database */

    constructor() {
        super();

        this.#openDatabaseIfNeeded();
    }


    #openDatabaseIfNeeded(){
        return new Promise((resolve, reject) => {
            // Let's not open the db multiple times, this would be silly
            if(this.#databaseInstance !== undefined){
                resolve("noice");
                return;
            }

            let openRequest = window.indexedDB.open(SensorDataDAO.#DATABASE_NAME, SensorDataDAO.#CURRENT_VERSION);
            openRequest.onsuccess = event => {
                console.log("DB is opened !");
                this.#databaseInstance = event.target.result;

                // Setup generic error handler
                this.#databaseInstance.onerror = event => console.error("DB error: " + event.target.errorCode);

                resolve("noice");
            }

            // TODO maybe wipe the db when upgrading versions ?
            openRequest.onupgradeneeded = event => {
                this.#databaseInstance = event.target.result;

                let mainObjectStore = this.#databaseInstance.createObjectStore(SensorDataDAO.#MAIN_OBJECT_STORE_NAME, {autoIncrement : true});
                mainObjectStore.createIndex("timestamp", "Timestamp", {unique: false});
            }

            openRequest.onerror = event => reject(event);
            openRequest.onblocked = event => console.error("NOT IMPLEMENTED YET");

        });
    }


    /**
     * Sanitize the data to guarantee the "type" of it.
     * Let's say we don't expect a string with SQLERROR instead of a float for the temperature
     * @param sensorDataArray An array of sensor data object
     * @return The array, sanitized on the value
     */
    #sanitizeSensorData(sensorDataArray){
        sensorDataArray.forEach(sensorData => {
            let convertedValue = parseFloat(sensorData.Valeur);
            if(isNaN(convertedValue)) convertedValue = 0; // Fallback for SQLERROR

            sensorData.Valeur = convertedValue;
        });
        return sensorDataArray;
    }


    /**
     * Put the newly acquired sensor data into the db
     * @param sensorDataArray An array of sensorData
     */
    async addSensorData(sensorDataArray){
        sensorDataArray = this.#sanitizeSensorData(sensorDataArray);
        await this.addSensorDataUnchecked(sensorDataArray);
    }


    /**
     * Put the newly acquired sensor data into the db, although unchecked.
     * @param sensorDataArray An array of sensorData
     */
    async addSensorDataUnchecked(sensorDataArray){
        await this.#openDatabaseIfNeeded();

        let transaction = this.#databaseInstance.transaction(SensorDataDAO.#MAIN_OBJECT_STORE_NAME, "readwrite");

        transaction.oncomplete = event => console.log("transaction COMPLEEEEEETE");
        let mainObjectStore = transaction.objectStore(SensorDataDAO.#MAIN_OBJECT_STORE_NAME);

        sensorDataArray.forEach(sensorData => {
            let request = mainObjectStore.add(sensorData);
            request.onsuccess = event => console.log("adding 1 sensor data");
            request.onerror = event => console.error("failed to add 1 sensor data !");
        });
    }

    /**
     * Get sensor data according to the options set, if any
     * @param options An object with the following attributes : {
     *     filterType : {String}"whitelist", "blacklist", defaults to "whitelist"
     *     filters : {String[]} contains the name of each category, defaults to NO category being filtered !
     *     startTime: {int} the start time, as a timestamp, defaults to 0
     *     endTime: {int} the end time, as a timestamp, defaults to Date.now()
     * }
     * @return {Promise<[]>}
     */
    async getSensorData(options){
        await this.#openDatabaseIfNeeded();
        // Check the filter type validity
        let filterType;
        filterType = options?.filterType.toLowerCase() ?? "whitelist";
        if(filterType !== "whitelist" && filterType !== "blacklist"){
            throw new Error('Unexpected input : ' + filterType);
        }

        // Create the filtering function beforehand,
        // with the goal to reduce the amount of overhead by if "filterType" statement when iterating over records;
        let filterFunction;
        if(options?.filters === undefined){
            filterFunction = function (record){return true;} // No filtering
        }else{
            filterFunction = filterType === "whitelist" ?
                function (record){return options?.filters.includes(record.Nom);} :
                function (record){return !options?.filters.includes(record.Nom)};
        }


        // Use the literal "readonly" instead of IDBTransaction.READ, which is deprecated:
        let transaction = this.#databaseInstance.transaction(SensorDataDAO.#MAIN_OBJECT_STORE_NAME, "readonly");
        let objectStore = transaction.objectStore(SensorDataDAO.#MAIN_OBJECT_STORE_NAME);
        let index = objectStore.index("timestamp");

        // Create the KeyRange object
        let queryRange = IDBKeyRange.bound(options?.startTime ?? 0, options?.endTime ?? Date.now(), true, true);

        // Query the DB itself
        let cursorRequest = index.openCursor(queryRange);
        let results = [];

        cursorRequest.onsuccess = (event) => {
            let cursor = event.target.result;
            if (!cursor) return;
            let currentValue = cursor.value;
            // Filter values
            if(filterFunction(currentValue)){
                results.push(currentValue);
            }
            cursor.continue();
        }
        return results;
    }



}