## dynamoDB.js - a node.js module for accessing Amazon DynamoDB
## *Under development*
Usage:

    var credentials = {AccessKeyId : "Your_AWS_Access_Key_Id", SecretKey : "Your_Secret_Key"}; // or read it from a file.
    var dynamoDB = require('./lib/dynamoDB'),
      dynamoDB.DynamoDB(credentials);


## Implemented features
* listTables

