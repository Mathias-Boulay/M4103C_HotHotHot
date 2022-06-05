/**
 * Class charged of retrieving the data through the exposed websocket server
 */
export default class QueryWebsocket extends Object {
    #url            // fetch address
    #onData         // callback function(js object)
    #onError        // callback function()
    #websocket      // The websocket connected to the server

    constructor(url, onData, onError) {
        super();
        this.#url = url;
        this.#onData = onData;
        this.#onError = onError;
    }

    /** Start querying the server */
    startQuery(){
        console.log("Start Query websocket !");
        if(this.#websocket !== undefined) this.#websocket.close();

        this.#websocket = new WebSocket(this.#url);

        this.#websocket.onopen = event => {
            this.#websocket.send("*at gunpoint* <<THE WEATHER>>");
        }

        this.#websocket.onmessage = async (event) => {
            let jsonData = JSON.parse(event.data).capteurs;

            this.#onData(jsonData);
        }

        this.#websocket.onerror = event => this.#stopWithError();
        this.#websocket.onclose = event => console.log("Websocket closed !");
    }

    /** Wrapper for stopping with an error */
    #stopWithError(){
        this.stopQuery();
        this.#onError();
    }

    /** Stops the querying behavior */
    stopQuery(){
        this.#websocket.close();
    }

}