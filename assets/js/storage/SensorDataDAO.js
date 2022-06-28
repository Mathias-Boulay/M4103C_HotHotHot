/**
 * Class charged of accessing and storing
 * all the sensor data into the IndexedDB
 */
import Receptor from "../Receptor";

export default class SensorDataDAO extends Object {
    static #DATABASE_NAME = "sensor_history";
    static #MAIN_OBJECT_STORE_NAME = "sensors";
    static #CURRENT_VERSION = 1;
    #databaseInstance;                          /* The instance of the opened database */
    #openDBPromise;                             /* The promise when the db isn't opened yet */

    constructor() {
        super();
        this.#openDBPromise = this.#openDatabase();
    }

    /**
     * Opens the database
     * @return {Promise<unknown>} A promise which resolves when the database is opened
     */
    #openDatabase(){
        return new Promise((resolve, reject) => {
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
     * Wait for the database to open? Resolves instantly if already opened
     * @return {Promise<string|*>} A promise which resolves when the db is opened
     */
    async #waitForDatabase(){
        if(this.#databaseInstance !== undefined){
            return "noice";
        }
        return await this.#openDBPromise;
    }


    /**
     * Put the newly acquired sensor data into the db, although unchecked.
     * @param sensorDataArray An array of sensorData
     */
    async addSensorData(sensorDataArray){
        await this.#waitForDatabase();

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
     *     filterType : {String} "whitelist", "blacklist", defaults to "whitelist"
     *     filters : {String[]} contains the name of each category, defaults to NO category being filtered !
     *     filterFunction : {function} Optional, takes a sensorData as a parameter, returns whether the current entry is kept.
     *     limit : {int} How many entries should be returned at maximum. Defaults to MAX_SAFE_INTEGER.
     *     order : {String} "ascending" or "descending" order, by timestamp. Defaults to "ascending".
     *     startTime: {int} the start time, as a timestamp, defaults to 0
     *     endTime: {int} the end time, as a timestamp, defaults to Date.now()
     * }
     * @return {Promise<[]>} A promise resolving with all the sensorData
     */
    getSensorData(options){
        return new Promise((resolve) => {
            this.#waitForDatabase().then(() =>{
                // Check the filter type validity
                let filterType;
                filterType = options?.filterType?.toLowerCase() ?? "whitelist";
                if(filterType !== "whitelist" && filterType !== "blacklist"){
                    throw new Error('Unexpected input : ' + filterType);
                }

                // Check and convert the cursor ordering
                let ordering = options?.order?.toLowerCase() ?? "ascending";
                if(ordering !== "ascending" && ordering !== "descending"){
                    throw new Error('Unexpected input : ' + ordering);
                }
                ordering = ordering === "ascending" ? "next" : "prev";

                // Create the filtering function beforehand,
                // with the goal to reduce the amount of overhead by if "filterType" statement when iterating over records;
                let filters;
                if((options?.filters ?? Receptor.ALL_SENSORS) === Receptor.ALL_SENSORS){
                    filters = function (record){return true;} // No filtering
                }else{
                    filters = filterType === "whitelist" ?
                        function (record){return options?.filters.includes(record.Nom);} :
                        function (record){return !options?.filters.includes(record.Nom)};
                }

                // Prepare the user filter function, swap it for a default one if no additional filtering is performed
                let userFilters = options?.filterFunction ?? function (sensorData){return true;}


                // Use the literal "readonly" instead of IDBTransaction.READ, which is deprecated:
                let transaction = this.#databaseInstance.transaction(SensorDataDAO.#MAIN_OBJECT_STORE_NAME, "readonly");
                let objectStore = transaction.objectStore(SensorDataDAO.#MAIN_OBJECT_STORE_NAME);
                let index = objectStore.index("timestamp");

                // Create the KeyRange object
                let queryRange = IDBKeyRange.bound(options?.startTime ?? 0, options?.endTime ?? Date.now(), true, true);

                // Query the DB itself
                let cursorRequest = index.openCursor(queryRange, ordering);
                let results = [];

                cursorRequest.onsuccess = (event) => {
                    let cursor = event.target.result;
                    if (!cursor || (results.length >= options?.limit ?? Number.MAX_SAFE_INTEGER)){
                        // We got all the results, we return the array then
                        resolve(results);
                        return;
                    }
                    let currentValue = cursor.value;
                    // Filter values
                    if(filters(currentValue) && userFilters(currentValue)){
                        results.push(currentValue);
                    }
                    cursor.continue();
                }
            });
        });
    }

    /**
     * Get sensor data ELIGIBLE FOR ALERTS according to the options set, if any
     * @param options An object with the same attributes as {getSensorData}
     * @return {Promise<[]>} A promise resolving with all the sensorData ELIGIBLE FOR ALERTS
     */
    async getAlerts(options){
        // Insert additional filtering in the user data function
        let originalFunction;
        if(options === undefined) options = {}
        originalFunction = options?.filterFunction ?? ((sensorData) => {return true;});
        options.filterFunction = (sensorData) => {
            return Receptor.isAlert(sensorData) && originalFunction(sensorData);
        }

        return await this.getSensorData(options);
    }
}