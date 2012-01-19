## dynamoDB.js - a node.js module for accessing Amazon DynamoDB
## *Under development*
Usage:

    // You can read your credentials from a local file.
    var credentials = {AccessKeyId : "Your_AWS_Access_Key_Id", 
                       SecretKey   : "Your_Secret_Key"}; 
    var dynamoDB = require('./lib/dynamoDB').DynamoDB(credentials);
    dynamoDB.listTables({}, function(result) {
        result.on('data', function(chunk){
            console.log(""+chunk);
        });
    });

## Implemented features
* listTables

