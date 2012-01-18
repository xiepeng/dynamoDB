/** dynamoDB.js - A node js module for accessing Amazon DynamoDB
 *  Author: Peng Xie
 *  
 *
 */


http = require('http');

exports.DynamoDB = function (credentials, endpoint) {

    if (! endpoint) endpoint = 'dynamodb.us-east-1.amazonaws.com';
    var auth  = require('../lib/auth');

    var db = new Object();

    db.description  = "Object for accessing Amazon DynamoDB.";
    db.securityToken= null;

    db.listTables = function () {
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        var lsTables = function (token) {
            var options = {
                host : endpoint,
                headers : {
                    "x-amz-date" : timestampGMT,
                    "x-amzn-authorization" :  "AWSAccessKeyId" + 
                                              credentials.keyid + 
                                              "Algorithm=HmacSHA256" + 
                                              "Signature=" + 
                                              "", //signature,
                    "x-amz-target" : "DynamoDB_20111205.ListTables",
                    "SignedHeaders" : "Host;x-amz-date;x-amz-target;x-amz-security-token",
                    "content-type" : "application/x-amz-json-1.0"
                }
            }
        }

        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                console.log("Token retrieved:" + JSON.stringify(token));
                db.securityToken = token;
                lsTables(db.securityToken);
            });
        } else {
            lsTables(db.securityToken);
        }

    }
    return db;
}
