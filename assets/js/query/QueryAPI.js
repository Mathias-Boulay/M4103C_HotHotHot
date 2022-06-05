/**
 * Class charged of retrieving the data through the exposed API
 */
export default class QueryAPI extends Object {
    #intervalId     // The id from the setInterval function
    #url            // fetch address
    #onData         // callback function(js object)
    #onError        // callback function()
    #interval       // The intervals at which the fetch is triggered

    /**
     * @param url The url to fetch the resources from
     * @param onData callback function(js object)
     * @param onError callback function()
     * @param interval The intervals at which the fetch is triggered
     */
    constructor(url, onData, onError, interval=100000) {
        super();
        this.#url = url;
        this.#onData = onData;
        this.#onError = onError;
        this.#intervalId = 0;
        this.#interval = interval;
    }

    /** Start querying the server */
    startQuery(){
        this.#intervalId = setInterval(async () => {
            let response;
            try{
                response = await fetch(this.#url);
            }catch (e){
                console.error(e);
                this.#stopWithError();
                return;
            }

            if (!response.ok){
                this.#stopWithError();
                return;
            }
            // Get the json data as a list.
            let jsonData = await response.json();
            jsonData = jsonData.capteurs;

            this.#onData(jsonData);
        }, this.#interval);

    }

    /** Wrapper for stopping with an error */
    #stopWithError(){
        this.stopQuery();
        this.#onError();
    }

    /** Stops the querying behavior */
    stopQuery(){
        if(this.#intervalId !== 0){
            clearInterval(this.#intervalId);
        }
    }

}