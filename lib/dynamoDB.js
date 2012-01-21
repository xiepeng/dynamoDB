/** 
 *   dynamoDB.js - A node js module for accessing Amazon DynamoDB
 */


http = require('http');

exports.DynamoDB = function (credentials, endpoint) {

    /* Default endpoint for dynamoDB. */
    if (! endpoint) endpoint = 'dynamodb.us-east-1.amazonaws.com';

    var auth  = require('../lib/auth');

    var db = new Object();

    db.description  = "Object for accessing Amazon DynamoDB.";
    db.securityToken= null;

    var queryDB = function (actionType, timestampGMT, query, token, callback) {

        // console.log("stringToSign:");
        // console.log(stringToSign);

        var options = {
            host    : endpoint,
            method  : 'POST',
            headers : {
                "host"          : endpoint,
                "x-amz-date"    : timestampGMT,
                "Date"          : timestampGMT,
                "x-amz-security-token"  : token.SessionToken,
                "x-amz-target"  : "DynamoDB_20111205." + actionType,
                "Content-Type"  : "application/x-amz-json-1.0",
                "Content-Length": JSON.stringify(query).length
            }
        };
        // console.log(JSON.stringify(options.headers));

        auth.sign(options.headers, query, token);

        var req = http.request(options, function(res) {
            // Not sure if it should throw an error here... After all, the response
            // contains the error info
            // if (res.statusCode !== 200) throw "Error: " + JSON.stringify(res);
            var ParsedResult = require('events').EventEmitter;
            var result = new ParsedResult();
            var respString = "";
            var data;
            res.on('data', function(chunk) {respString = respString + chunk});
            res.on('end', function() {
                data        = JSON.parse(respString); 
                data.error  = (res.statusCode !==200);
                result.emit('ready', data);
            });
            if (callback) callback(res, result);
        });
        req.end(JSON.stringify(query), 'utf8');
    };

    var processQuery = function (queryType, query, callback) {
        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB(queryType, timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB(queryType, timestampGMT, query, db.securityToken, callback);
        }
    }

    exports.processQuery = processQuery;


/*
 *  ListTables
 */
    db.listTables = function (query, callback) {
        processQuery("ListTables", query, callback);
    }
/*
 *  DescribeTable
 */
    db.describeTable = function (query, callback) {
        processQuery("DescribeTable", query, callback);
    }


/*
 *  CreateTable
 */
    db.createTable = function (query, callback) {
        processQuery("CreateTable", query, callback);
    }





/*
 *  DeleteTable
 */
    db.deleteTable = function (query, callback) {
        processQuery("DeleteTable", query, callback);
    }




/*
 *  PutItem
 */
    db.putItem = function (query, callback) {
        processQuery("PutItem", query, callback);
    }



/*
 *  BatchGetItem
 */
    db.batchGetItem = function (query, callback) {
        processQuery("BatchGetItem", query, callback);
    }


/*
 *  GetItem
 */
    db.getItem = function (query, callback) {
        processQuery("GetItem", query, callback);
    }


/*
 *  UpdateItem
 */
    db.updateItem = function (query, callback) {
        processQuery("UpdateItem", query, callback);
    }

/*
 *  Query
 */
    db.query = function (query, callback) {
        processQuery("Query", query, callback);
    }


/*
 *  Scan
 */
    db.scan = function (query, callback) {
        processQuery("Scan", query, callback);
    }




/*
 *  UpdateTable
 */
    db.updateTable = function (query, callback) {
        processQuery("UpdateTable", query, callback);
    }


    return db;
}
