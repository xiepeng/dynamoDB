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

    db.listTables = function (query, callback) {

        if (!query) query={};
        var currentTime = new Date(),
            timestampGMT = currentTime.toGMTString(),
            timestampISO = currentTime.toISOString();

        var lsTables = function (token, callback) {

            var stringToSign =  "POST\n" + 
                                "/\n" +
                                "\n" +
                                "host:" + endpoint + "\n" + 
                                "x-amz-date:" + timestampGMT + "\n" + 
                                "x-amz-security-token:" + token.SessionToken + "\n" +
                                "x-amz-target:" + "DynamoDB_20111205.ListTables" + "\n" + 
                                "\n" +
                                JSON.stringify(query);

            // console.log("stringToSign:");
            // console.log(stringToSign);

            var hmac = require('crypto').createHmac('sha256', token.SecretAccessKey);
            hmac.update(require('crypto').createHash('sha256').update(stringToSign).digest());
            var signature = hmac.digest('base64');
            if (signature.substring(signature.length-1) !== "=" ) signature = signature + "=";

            var options = {
                host    : endpoint,
                method  : 'POST',
                headers : {
                    "host"          : endpoint,
                    "x-amz-date"    : timestampGMT,
                    "Date"          : timestampGMT,
                    "x-amzn-authorization"  : "AWS3 AWSAccessKeyId=" + 
                                              token.AccessKeyId + 
                                              ",Algorithm=HmacSHA256" + 
                                              ",SignedHeaders=host;x-amz-date;x-amz-security-token;x-amz-target" +
                                              ",Signature=" + signature,
                    "x-amz-security-token"  : token.SessionToken,
                    "x-amz-target"  : "DynamoDB_20111205.ListTables",
                    "Content-Type"  : "application/x-amz-json-1.0",
                    "Content-Length"        : JSON.stringify(query).length
                }
            };
            // console.log(JSON.stringify(options.headers));

            var req = http.request(options, function(res) {
                // Not sure if it should throw an error here... After all, the response
                // contains the error info
                // if (res.statusCode !== 200) throw "Error: " + JSON.stringify(res);
                if (callback) callback(res);
            });
            req.end(JSON.stringify(query), 'utf8');
        };

        /* Check if the token is still valid */
        if (!db.securityToken || db.securityToken.Expiration.localeCompare(timestampISO) < 0) {
            auth.getSecurityToken(credentials, function(token){
                // console.log("Token retrieved:" + JSON.stringify(token) + "\n\n");
                db.securityToken = token;
                lsTables(db.securityToken, callback);
            });
        } else {
            lsTables(db.securityToken, callback);
        }

    }
    return db;
}
