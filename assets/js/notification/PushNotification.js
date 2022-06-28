import { receptor } from "./../Receptor";

export class PushNotification extends Object{

    #captorName;
    #value;
    static #notifImg = "./assets/images/android-chrome-192x192.png";
    static #activeWindow = true;

    constructor(){
        super();
        
        receptor.addAlertListener(this);

        window.addEventListener('focus',() => PushNotification.#activeWindow = true );
        window.addEventListener('blur', () => PushNotification.#activeWindow = false);
    }

    update(sensorData){
        this.#captorName = sensorData.Nom;
        this.#value      = sensorData.Valeur;
        if(!PushNotification.#activeWindow) 
            Notification.requestPermission().then(result => { if(result === 'granted') this.#sendNotif();}); 
    }

    #sendNotif(){
        const notifTitle = "Alerte pour le capteur " + this.#captorName;  
        const notifBody = 'Température : ' + this.#value + '°C';   
        const options = { body: notifBody, icon: PushNotification.#notifImg};
        new Notification(notifTitle, options);
    }

}