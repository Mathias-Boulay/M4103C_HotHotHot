/**
 * Class aimed at sending notifications to the user when he isn't actively on the window
 */
 import { receptor } from "./../Receptor";
 import Localization from "./../lang/Localization";

 export class PushNotification extends Object{
 
     #captorName; /* Name of the captor which is at the origin of the alert */
     #value; /* Value of the captor*/
     static #notifImg = "./assets/images/android-chrome-192x192.png"; /* The location of the image show in all notifications by push */
     static #activeWindow = true; /* static attribut storing if the user is on the window or not */
 
     constructor(){
         super();
         
         receptor.addAlertListener(this);
 
         window.addEventListener('focus',() => PushNotification.#activeWindow = true );
         window.addEventListener('blur', () => PushNotification.#activeWindow = false);
    }
 
     /** Proxy method called because we are a Receptor listener */
     update(sensorData){
         this.#captorName = sensorData.Nom;
         this.#value      = sensorData.Valeur;
         if(!PushNotification.#activeWindow) /* if the window isn't active, authorize sending notifications */
             Notification.requestPermission().then(result => { if(result === 'granted') this.#sendNotif();}); 
             /* check if the user has granted access before actually sending the notifications */
    }
 
     /** Formatting the data before sending the notification */
     #sendNotif(){
         const notifTitle = Localization.getText("notif_context") + this.#captorName;  
         const notifBody = Localization.getText("notif_temp") + this.#value + '°C';   
         const options = { body: notifBody, icon: PushNotification.#notifImg};
         new Notification(notifTitle, options);
    }
}