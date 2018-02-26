var http = require('http');
var url = require('url');
var fs = require('fs');
var $rdf = require('rdflib');
var store=$rdf.graph();
var notif_handler=require('./Service/notificationHandler')

var server=http.createServer(function (req, res)
{

    //console.log();
    try {
        if (req.method == 'POST')
        {
            var body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                var recvData = JSON.parse(body);
                console.log(recvData)
                var buffer = new Buffer(recvData['m2m:smd'].dsp, 'base64');
                var dcrp = buffer.toString();
                //var pi = recvData['m2m:smd'].pi;
                console.log(dcrp);
                //console.log(pi);
                notif_handler.insert_triples(dcrp,function (response)
                {
                    console.log(JSON.stringify(response))
                    res.writeHead(200, {'Content-Type':'text/plain'});
                    res.end(JSON.stringify(response));

                },'http://api.smartsantander.eu#SmartSantanderTestbed')
                // var storeTriple = function (uri, rdfData, callback) {
                //     var contentType = 'application/rdf+xml';
                //     var baseUrl = "http://203.253.128.161:7579";
                //     try {
                //         console.log('Received data into the store from RDF\n');
                //         $rdf.parse(rdfData, store, baseUrl + uri, contentType);
                //         var stms = store.toString();
                //         console.log(stms + '\n');
                //         console.log('RDF store success\n');
                //     }
                //     catch (err) {
                //         console.log(err);
                //         res.writeHead(400, {'Content-Type': 'text/plain'});
                //         res.end('RDF format is wrong');
                //     }
                //     callback();
                // }
                // storeTriple(pi, dcrp, function () {
                //     res.writeHead(201, {'Content-Type': 'text/plain'});
                //     res.end('');
                // });
            })
        }
        else if(req.method=='DELETE')
        {
            var query2 = require('url').parse(req.url, true).query;
            var queryString = decodeURI(query2.graphURI);
            console.log('QS=', queryString);
            notif_handler.deleteGraph(queryString, function (response)
            {
                console.log((JSON.parse(response))['statusCode'])

                res.writeHead(200, {'Content-Type':'text/json'});
                res.end(JSON.stringify(response));

            })
        }
        else if (req.method == 'GET') {
            var query2 = require('url').parse(req.url, true).query;
            var queryString = decodeURI(query2.smf);
            console.log('QS=', queryString);
            notif_handler.sparqlquery(queryString, function (response) {

                if (response['head'] == undefined) {

                    res.writeHead(404, {'Content-Type': 'text/json'});
                    res.end(JSON.stringify(response));
                }
                else {
                    console.log(response)
                    res.writeHead(200, {'Content-Type': 'text/json'});
                    res.end(JSON.stringify(response['results']['bindings']));

                }

            })
        }
        else if (req.method == 'PUT') {
            var body = [];
            req.on('data', function (chunk) {
                body.push(chunk);

            });
            req.on('end', function ()
            {


                body=JSON.parse(body)
                console.log(body);
                var recvData = body['m2m:smd'];

                var buffer = new Buffer(recvData.dsp, 'base64');
                var dcrp = buffer.toString();
                var graphURI = recvData.uri
                //var graphURI = buffer.toString()
                console.log('graphURI=', graphURI);
                console.log('dcrp=', dcrp);
                notif_handler.overwritegraph(graphURI,dcrp, function (response) {

                    console.log(response)
                    if (response['graph'] == undefined) {

                        res.writeHead(404, {'Content-Type': 'text/json'});
                        res.end(JSON.stringify(response));
                    }
                    else {

                        response['dcrp']=recvData.dsp
                        res.writeHead(200, {'Content-Type': 'text/json'});
                        res.end(JSON.stringify(response));

                    }

                })
            })
        }
            /*
             var discovery = function (sparql, callback)
             {
             try{
             var query = $rdf.SPARQLToQuery(sparql, true, store);
             var discoveryResult = new Array();
             var index = 0;

             console.log('Query===',query.toString());

             store.query(query, function (result)
             {
             try {
             console.log('SPARQL query run\n');
             console.log(result);
             console.log('\n');

             var thing = result['?thing'];
             var property = result['?property'];

             var stms_match = store.statementsMatching(thing, undefined, property);

             for (var i = 0; i < stms_match.length; i++)
             {
             var stm = stms_match[i];
             console.log(stm);
             var value = stm.why.value;
             value = value.substr(27, value.length);
             if (discoveryResult.indexOf(value) == -1)
             {
             discoveryResult[index] = value;
             index++;
             }
             }
             }
             catch(err)
             {
             console.log(err);
             res.writeHead(400, {'Content-Type':'text/plain'});
             res.end('SPARQL format is wrong');
             }
             }, fetcher, function onDone()
             {
             console.log('onDone');
             callback(res, discoveryResult);
             });
             } catch(err){
             console.log(err);
             res.writeHead(400, {'Content-Type':'text/plain'});
             res.end('SPARQL format is wrong');
             }
             };

             function fetcher()
             {
             console.log('fetcher??');
             }
             discovery(queryString, function (res, discoveryResult)
             {
             if (discoveryResult.length > 0)
             {
             console.log(discoveryResult);
             res.writeHead(200, {'Content-Type':'text/plain'});
             res.end(discoveryResult.toString());
             }
             else
             {
             res.writeHead(404, {'Content-Type':'text/plain'});
             res.end('Semantic discovery result - not found');
             }
             });
             }
             */

    }
    catch (err)
    {
        console.log(err);
        res.writeHead(400, {'Content-Type':'text/plain'});
        res.end('');
    }

});
server.listen(7591, function ()
{
     var triplestoreconnection=require('./Service/tripleStore_connection');
     var mqtt=require('./Service/mqttsetUp')
     mqtt.subscibeTopic()
});

server.on('error', function (e)
{
    if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(function () {
            server.close();
            server.listen(7591, 'localhost');
        }, 1000);
    }
});
/*
SPARQL query in
 var sem = require("/MarkLogic/semantics.xqy");

 sem.sparql( +
 'PREFIX bill: <http://www.rdfabout.com/rdf/usgov/congress/108/bills/>' +
 'SELECT ?predicate ?object' +
 'WHERE { bill:h963 ?predicate ?object }' )
 */
console.log('.. Semantic server running at http://localhost:7591/\n');