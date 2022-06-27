import Localization from "./../lang/Localization";

export function obtainAlertContext(captorName, value){
        
    if (captorName === "interieur"){
        if (value > 50) return Localization.getText("alert_context_inside_superhot");
        if (value > 22) return Localization.getText("alert_context_inside_hot");
        if (value < 0 ) return Localization.getText("alert_context_inside_supercold");
        if (value < 12) return Localization.getText("alert_context_inside_cold");
    }
    else if(captorName === "exterieur"){
        if(value > 35) return Localization.getText("alert_context_outside_hot",);
        if(value < 0 ) return Localization.getText("alert_context_outside_cold");
    }
    return Localization.getText("alert_context_error");
}

export function obtainDate(timestamp){
    if (timestamp === "?") return "?";
    const date = new Date(timestamp);
    return (date.getHours()+":"+date.getMinutes()+" "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
}