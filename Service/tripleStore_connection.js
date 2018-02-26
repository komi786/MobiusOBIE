/**
 * Created by Mac on 24/01/2018.
 */

console.time('start-app');
const marklogic = require('marklogic');
const config=require('../smconfig');

var db = marklogic.createDatabaseClient(config.dbconfig);
//console.log(db)

var insertTriplesInStore=function(triples,callback,graphURI)
{
    if(graphURI!=undefined)
    {
        db.graphs.write(
            {
                uri:graphURI,
                contentType:config.serverconfig.triple_mimeType,
                data :triples
            }).result(
            function (response) {
                //console.log(response)
                callback(response)


            },
            function (error) {
                callback(JSON.stringify(error))
            }
        )
    }
    else
    {
        db.graphs.write({
            contentType:config.serverconfig.triple_mimeType,
            data :triples
        }).result(
            function (response)
            {
                console.log(response)
                if(response.defaultGraph)
                {
                    callback('Loaded into defualt graph')
                }
                else
                {
                    callback('Loaded into graph '+response.graph)
                }

            },
            function (error) {
                callback(JSON.stringify(error))
            }
        )
    }

}
var addTriplesInExisitngGraph=function (triples,callback,graphURI) {
    if(graphURI!=undefined)
    {
        db.graphs.merge({
            uri:graphURI,
            contentType:config.serverconfig.triple_mimeType,
            data:triples
        }).result(function (response) {
            callback(response)

        })
    }
    else
    {
        db.graphs.merge({
            contentType:config.serverconfig.triple_mimeType,
            data:triples
        }).result(function (response) {
            callback(response)

        },function (error) {
            callback(JSON.stringify(error))
        });
    }
}
var remove_NamedTripleGraph=function (graphURI,callback) {

        db.graphs.remove(graphURI).result(function (response) {
            callback(response)

        },function (error) {
            callback(JSON.stringify(error))
        });

}
var selectQuery=function (query,callback) {
    db.graphs.sparql({
        contentType:config.serverconfig.res_mimeTypeSPARQL,
        query:query,
        graph:'http://api.smartsantander.eu#SmartSantanderTestbed'
    }).result(function (res) {
        callback(res)

    },function (error)
    {
        console.log(error);
        callback(error)
    })

}
var overwritetiplesinGraph=function (triples,graphURI,callback)
{
    remove_NamedTripleGraph(graphURI,function (result) {
       insertTriplesInStore(triples,function (res) {

           callback(res)
       },graphURI)
    })

}
var updateGraphTriples=function (triples,graphURI,callback) {
    db.graphs.sparqlUpdate({
        data:triples,
        usingNamedGraph:graphURI
    }).result(function (res) {

        callback(res)
    },function (err) {
        callback(err)
    })
}
module.exports={
    remove_NamedTripleGraph,insertTriplesInStore,updateGraphTriples,overwritetiplesinGraph,selectQuery,addTriplesInExisitngGraph
}