/**
 * Created by Mac on 25/01/2018.
 */

const mqtt=require('mqtt');
var config  = require('../smconfig');
var notification_handler=require('./notificationHandler')
var host='mqtt://'+config.serverconfig.mqtt_host;
var oneM2MResPath='/oneM2M/req'
var client = mqtt.connect(host);
client.on('connect', function ()
{
    console.log('--pxy_mqtt--',host);
});
var mqttsub= function ()
{
    var topicURL=(config.serverconfig.subscription_type=="digest")? oneM2MResPath+config.serverconfig.cseID+'/#':oneM2MResPath+config.serverconfig.cseID+'/'+config.serverconfig.mqtt_topic+'/json'
    console.log(topicURL);
    client.subscribe(topicURL)

}
client.on('message', function (topic,message)
{
    //Parse notification message---Recieved MQTT notification

    var data = JSON.parse(message);
   // console.log("notification message",data);
    notification_handler.handler(data)  //Parse Payload
});
module.exports.subscibeTopic=mqttsub;
