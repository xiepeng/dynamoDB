## dynamoDB.js - a node.js module for accessing [Amazon DynamoDB](http://aws.amazon.com/dynamodb/ "click to go to Amazon DynamoDB").

DynamoDB uses JSON for communication. That means both the request body and the response are in JSON format. This module wraps up the request and takes care of authentication. The user will be responsible for crafting the request and consuming the result.

Installation:

    npm install dynamoDB

Usage:

    // You can read your credentials from a local file.
    var credentials = {AccessKeyId : "Your_AWS_Access_Key_Id", 
                       SecretKey   : "Your_Secret_Key"}; 
    var dynamoDB = require('./lib/dynamoDB').DynamoDB(credentials);

## Examples
Each function has a callback with a [http.ClientResponse](http://nodejs.org/docs/latest/api/http.html#http.ClientResponse) together with a "result" object as the arguments. The second argument, "result", emitts an event 'ready' when all the response data are received, and parses the response into a JavaScript object. 
### [CreateTable] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_CreateTable.html "reference on aws")
Create a table named "Table1" with HashKey "Color"(String) and RangeKey "Weight"(Numeric). Set the read capacity units to 5 and write capacity units to 10.

    dynamoDB.createTable(
        {"TableName":"Table1",
            "KeySchema":
                {"HashKeyElement"   : {"AttributeName":"Color",  "AttributeType":"S"},
                "RangeKeyElement"   : {"AttributeName":"Weight", "AttributeType":"N"}},
            "ProvisionedThroughput" : {"ReadCapacityUnits":5, "WriteCapacityUnits":10}
        }
    , function(response,result) {
        // The code below just prints out the response string...
        respsone.on('data', function(chunk){
            console.log(""+chunk);
        });
        // ... while the following code retrieves the result in JavaScript object called "data".
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [ListTables] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_ListTables.html "reference on aws")

    dynamoDB.listTables({}, function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [DeleteTable] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_DeleteTable.html "reference on aws")
Delete Table1.

    dynamoDB.deleteTable({"TableName":"Table1"}, function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [DescribeTable] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_DescribeTable.html "reference on aws")

    dynamoDB.describeTable({"TableName":"Table1"}, function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });


### [PutItem] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_PutItem.html "reference on aws")
Put an item into Table1, with Color="white" and Weight="2". Add an attribute: "Name"="fancy vase".

    dynamoDB.putItem(
        {"TableName":"Table1",
            "Item":{
                "Color" : {"S":"white"},
                "Name"  : {"S":"fancy vase"},
                "Weight": {"N":"2"}
            }
        }
    , function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [GetItem] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_GetItem.html "reference on aws")
Get an item by its key: Color="white" and Weight="2". Ask for the "Name" attribute also.

    dynamoDB.getItem(
        {"TableName":"Table1",
            "Key":
                {"HashKeyElement"   : {"S":"white"},
                "RangeKeyElement"   : {"N":"2"}
            },
            "AttributesToGet"   : ["Color","Weight", "Name"],
            "ConsistentRead"    : true
        }
    , function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [BatchGetItem] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_BatchGetItems.html "reference on aws")
Get multiple items by their keys: 

*  Color="white" and Weight="2"; 
*  Color="blue" and Weight="5"; 
*  Color="red" and Weight="3". 

Ask for the "Name" attribute also. 

    dynamoDB.batchGetItem(
        {"RequestItems":
            {"Table1": 
                {"Keys": 
                    [{"HashKeyElement"  : {"S":"white"}, "RangeKeyElement":{"N":"2"}},
                    {"HashKeyElement"   : {"S":"blue"}, "RangeKeyElement":{"N":"5"}},
                    {"HashKeyElement"   : {"S":"red"}, "RangeKeyElement":{"N":"3"}}],
                "AttributesToGet":["Color", "Weight", "Name"]}
            }
        }
    , function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [UpdateTable] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_UpdateTable.html "reference on aws")
Update a table and change its write capacity units from 10 (the original setting when the table was created) to 5. The process involves Amazon DynamoDB re-distributing the data. So it will take some time before you can update the same table again.

    dynamoDB.updateTable(
        {"TableName":"Table1",
            "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
        }
    , function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [UpdateItem] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_UpdateItem.html "reference on aws")
Update an item and change its "Name" attribute from "fancy vase" into "not-so-fancy-anymore vase". The item is located by its hash key and range key.

    dynamoDB.updateItem(
        {"TableName":"Table1",
            "Key":
                {"HashKeyElement"   : {"S":"white"},
                "RangeKeyElement"   : {"N":"2"}},
                "AttributeUpdates"  : {  "Name"  : {"Value":{"S":"not-so-fancy-anymore vase"},
                                         "Action": "PUT"}
                                      },
            "ReturnValues"          : "ALL_NEW"
        }
    , function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });


### [Query] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_Query.html "reference on aws")
Query the table "Table1" and ask for all items with (hash key)Color="white" and (range key)Weight > 1.

    dynamoDB.query(
        {"TableName":"Table1",
            "Limit"             : 2,
            "ConsistentRead"    : true,
            "HashKeyValue"      : {"S":"white"},
            "RangeKeyCondition" : {"AttributeValueList":[{"N":"1"}],"ComparisonOperator":"GT"},
            "ScanIndexForward"  : true,
            "AttributesToGet"   : ["Color", "Weight", "Name"]
        }
    , function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });

### [Scan] (http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_Scan.html "reference on aws")
Scan the table "Table1" and find items with Name="sofa". The attribute "Name" does not have to be a key.

    dynamoDB.scan(
        {"TableName"    :"Table1",
            "Limit"     : 2,
            "ScanFilter":{
                "Name"  :{"AttributeValueList":[{"S":"sofa"}],"ComparisonOperator":"EQ"}
            },
            "AttributesToGet":["Color", "Weight", "Name"]
        }
    , function(response,result) {
        response.on('data', function(chunk){
            console.log(""+chunk);
        });
        result.on('ready', function(data){
            console.log("Error:" + data.error);
            console.log("ComsumedCapacityUnits:" + data.ConsumedCapacityUnits);
            // ...
        });
    });



