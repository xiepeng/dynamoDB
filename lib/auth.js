/*
 * Request a AWS security token.
 */

exports.getSecurityToken = function (credentials, callback) {

    var querystring = require('querystring');

    var currentTime = new Date();
    var timestamp = querystring.stringify({"Timestamp" : currentTime.toISOString()});

    var stringToSign =  "GET\n" + 
                        "sts.amazonaws.com\n" +
                        "/\n" +
                        "AWSAccessKeyId=" + credentials.AccessKeyId +
                        "&Action=GetSessionToken" +
                        "&DurationSeconds=3600" +
                        "&SignatureMethod=HmacSHA256" +
                        "&SignatureVersion=2" +
                        "&" + timestamp +
                        "&Version=2011-06-15";

    var hmac = require('crypto').createHmac('sha256', credentials.SecretKey);
    hmac.update(stringToSign);
    var signature = querystring.stringify({"Signature" : hmac.digest('base64')});

    var https = require('https');
    var options = {
        host    : 'sts.amazonaws.com',
        method  : 'GET',
        path    : '/?Action=GetSessionToken' +
                  '&DurationSeconds=3600' +
                  '&AWSAccessKeyId=' + credentials.AccessKeyId +
                  '&Version=2011-06-15' +
                  '&' + timestamp +
                  '&' + signature +
                  '&SignatureVersion=2&SignatureMethod=HmacSHA256'
    }

    var token = new Object();
    token.timestamp = currentTime;

    https.get(options, function (res) {

        var sax    = require("sax"),
            strict = true,
            parser = sax.parser(strict);



        parser.onerror = function (e) {
            throw e;
        };

        parser.onopentag = function (node) {
            switch (node.name) {
                case "SessionToken" :
                    parser.ontext = function (t) {
                        if (!token.SessionToken) token.SessionToken = t;
                    }
                    break;
                case "SecretAccessKey" :
                    parser.ontext = function (t) {
                        if (!token.SecretAccessKey) token.SecretAccessKey = t;
                    }
                    break;
                case "Expiration" :
                    parser.ontext = function (t) {
                        if (!token.Expiration) token.Expiration = t;
                    }
                    break;
                case "AccessKeyId" :
                    parser.ontext = function (t) {
                        if (!token.AccessKeyId) token.AccessKeyId = t;
                    }
                    break;
            }
        }

        if (res.statusCode !== 200) {
            throw "Error accessing dynamoDB. Failed to get session token. Please check your AccessKeyId and SecretKey";
        } else {
            // callback(token, secretKey);
        }
        res.on('data', function (chunk) {
            parser.write(chunk.toString());
        });

        res.on('end', function () {
            parser.close();
            if (callback) callback(token);
        });
    });
}


/** 
 *   Generate a signature using SHA265 algorithm.
 */

exports.sign = function (header, body, token) {

    if (! header)   throw "Invalid request header. Cannot generate a signature.";
    if (! body)     throw "Invalid request body. Cannot generate a signature.";
    if (! token || 
        !(token.SecretAccessKey && token.AccessKeyId && token.SessionToken) 
    )               throw "Invalid token. Cannot generate a signature.";

    var crypto = require('crypto'),
        hash = crypto.createHash('sha256'),
        hmac = crypto.createHmac('sha256', token.SecretAccessKey);

    var stringToSign  = "POST\n" + 
                        "/\n" + 
                        "\n",
        signedHeaders = "";

    // TODO: convert req into stringToSign

    if (header.hasOwnProperty("host") && typeof header.host === "string") {
        stringToSign    = stringToSign  + "host:" + header.host + "\n";
        signedHeaders   = signedHeaders + "host";
    } else throw "Error: must have 'host' property in the headers of the request.";

    if (header.hasOwnProperty("x-amz-date") && typeof header["x-amz-date"] === "string") {
        stringToSign    = stringToSign  + "x-amz-date:" + header["x-amz-date"] + "\n";
        signedHeaders   = signedHeaders + ";x-amz-date";
    }

    if (header.hasOwnProperty("x-amz-security-token") && typeof header["x-amz-security-token"] === "string") {
        stringToSign    = stringToSign  + "x-amz-security-token:" + header["x-amz-security-token"] + "\n";
        signedHeaders   = signedHeaders + ";x-amz-security-token";
    }

    if (header.hasOwnProperty("x-amz-target") && typeof header["x-amz-target"] === "string") {
        stringToSign    = stringToSign  + "x-amz-target:" + header["x-amz-target"] + "\n";
        signedHeaders   = signedHeaders + ";x-amz-target";
    }

    stringToSign = stringToSign + "\n" + JSON.stringify(body);
    // console.log("String to sign:\n" + stringToSign);

    var bytesToSign = hash.update(stringToSign).digest();
    var signature = hmac.update(bytesToSign).digest("base64");
    if (signature.substring(signature.length-1) !== "=") {
        signature = signature+"=";
    }

    header["x-amzn-authorization"] = "AWS3 AWSAccessKeyId=" + 
                                      token.AccessKeyId + 
                                      ",Algorithm=HmacSHA256" + 
                                      ",SignedHeaders=" + signedHeaders + 
                                      ",Signature=" + signature
    // console.log("x-amzn-authorization: " + header["x-amzn-authorization"]);
}



