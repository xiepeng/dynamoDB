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
            if (callback) callback(res);
        });
        req.end(JSON.stringify(query), 'utf8');
    };

/*
 *  ListTables
 */
    db.listTables = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("ListTables", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("ListTables", timestampGMT, query, db.securityToken, callback);
        }
    }

/*
 *  DescribeTable
 */
    db.describeTable = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("DescribeTable", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("DescribeTable", timestampGMT, query, db.securityToken, callback);
        }
    }



/*
 *  CreateTable
 */
    db.createTable = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("CreateTable", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("CreateTable", timestampGMT, query, db.securityToken, callback);
        }
    }





/*
 *  DeleteTable
 */
    db.deleteTable = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("DeleteTable", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("DeleteTable", timestampGMT, query, db.securityToken, callback);
        }
    }






/*
 *  PutItem
 */
    db.putItem = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("PutItem", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("PutItem", timestampGMT, query, db.securityToken, callback);
        }
    }



/*
 *  BatchGetItem
 */
    db.batchGetItem = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("BatchGetItem", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("BatchGetItem", timestampGMT, query, db.securityToken, callback);
        }
    }


/*
 *  GetItem
 */
    db.getItem = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("GetItem", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("GetItem", timestampGMT, query, db.securityToken, callback);
        }
    }


/*
 *  UpdateItem
 */
    db.updateItem = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("UpdateItem", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("UpdateItem", timestampGMT, query, db.securityToken, callback);
        }
    }

/*
 *  Query
 */
    db.query = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("Query", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("Query", timestampGMT, query, db.securityToken, callback);
        }
    }


/*
 *  Scan
 */
    db.scan = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("Scan", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("Scan", timestampGMT, query, db.securityToken, callback);
        }
    }




/*
 *  UpdateTable
 */
    db.updateTable = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                queryDB("UpdateTable", timestampGMT, query, db.securityToken, callback);
            });
        } else {
            queryDB("UpdateTable", timestampGMT, query, db.securityToken, callback);
        }
    }


    return db;
}
