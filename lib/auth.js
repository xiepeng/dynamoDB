/** Authentication for AWS services.
 */

/*
 *  Generate a HMAC-SHA signature for AWS
 */
exports.sign = function (request, secretKey) {
    return "";
}


/*
 * Request a AWS security token.
 */

exports.getSecurityToken = function (credentials, callback) {

    var querystring = require('querystring');

    var timestamp = querystring.stringify({"Timestamp" : new Date().toISOString()});

    var stringToSign =  "GET\n" + 
                        "sts.amazonaws.com\n" +
                        "/\n" +
                        "AWSAccessKeyId=" + credentials.keyid +
                        "&Action=GetSessionToken" +
                        "&DurationSeconds=3600" +
                        "&SignatureMethod=HmacSHA256" +
                        "&SignatureVersion=2" +
                        "&" + timestamp +
                        "&Version=2011-06-15";

    var hmac = require('crypto').createHmac('sha256', credentials.secret);
    hmac.update(stringToSign);
    var signature = querystring.stringify({"Signature" : hmac.digest('base64')});

    var https = require('https');
    var options = {
        host    : 'sts.amazonaws.com',
        method  : 'GET',
        path    : '/?Action=GetSessionToken' +
                  '&DurationSeconds=3600' +
                  '&AWSAccessKeyId=' + credentials.keyid +
                  '&Version=2011-06-15' +
                  '&' + timestamp +
                  '&' + signature +
                  '&SignatureVersion=2&SignatureMethod=HmacSHA256'
    }

    var token = new Object();

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
            console.log("Error accessing dynamoDB. Failed to get session token.");
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
