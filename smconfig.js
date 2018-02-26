/**
 * Created by Mac on 24/01/2018.
 */

//Database configuration
const host = 'localhost';
const port = 8004;
const user = 'Semantic_Root';
const password = 'root';
const authtype='digest';

//cse-Host configuration
const cseServerHost="192.168.0.163";
const  cseID="/Mobius";
const  cseBase="Mobius";
const  mqtt_host="192.168.0.163";
const  subscription_type="nondigest";
const triple_mimeType="application/rdf+xml";
const res_mimeTypeSPARQL="application/json";
const mqtt_topic="mqttANSUB"

module.exports.dbconfig = {
    host, port, user, password,authtype
};
module.exports.serverconfig = {
    cseServerHost,cseID,cseBase,mqtt_host,subscription_type,triple_mimeType,mqtt_topic,res_mimeTypeSPARQL
};
