import { receptor } from "./../Receptor";

export class PushNotification extends Object{

    #captorName;
    #value;
    #notifImg;
    static #activeWindow = true;

    constructor(){
        super();
        this.#notifImg = "./../../images/android-chrome-192x192.png";
        receptor.addAlertListener(this);
        window.addEventListener('focus', this.setActive);
        window.addEventListener('blur', this.setUnactive);
        
    }

    update(sensorData){
        this.#captorName = sensorData.Nom;
        this.#value      = sensorData.Valeur;
        if(!PushNotification.#activeWindow) 
            Notification.requestPermission().then(result => { if(result === 'granted') this.#sendNotif(); console.log("HERE");}); 
    }

    setActive(){
        PushNotification.#activeWindow = true;
    }

    setUnactive(){
        PushNotification.#activeWindow = false;
    }

    #sendNotif(){
        const notifTitle = "Alerte pour le capteur " + this.#captorName;  
        const notifBody = 'Température : ' + this.#value + '°C';   
        const options = { body: notifBody, icon: this.#notifImg}  
        new Notification(notifTitle, options);
    }

}