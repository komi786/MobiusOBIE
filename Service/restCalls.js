/**
 * Created by Mac on 25/01/2018.
 */

var config = {
    async:true
};
module.exports.semanticDescription = function (rn,callback)
{
    var containerName=rn
    var http = require('http');
    var str = '';
    var options = {
        host: serverIP,
        port: serverPort,
        path: containerName+"/"+smd,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-M2M-RI': '12345',
            'X-M2M-Origin': 'SOrigin'
        }
    };
    var req = http.request(options, function (res)
    {
        res.on('data', function (body) {
            str += body;
        });
        res.on('end', function ()
        {
            return callback(str);
        });
    });
    req.end();
};