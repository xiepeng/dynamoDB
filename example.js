// You can read your credentials from a local file.
var credentials = {AccessKeyId : "*Your Access Key**", 
                   SecretKey   : "*Your Secret Key**********"}

var dynamoDB = require('./lib/dynamoDB').DynamoDB(credentials);


dynamoDB.listTables({"ExclusiveStartTableName":"Aable1","Limit":3}, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});

dynamoDB.deleteTable({"TableName":"Table1"}, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});


dynamoDB.describeTable({"TableName":"Table1"}, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});


dynamoDB.createTable(
{"TableName":"Table1",
    "KeySchema":
        {"HashKeyElement":{"AttributeName":"Color","AttributeType":"S"},
        "RangeKeyElement":{"AttributeName":"Weight","AttributeType":"N"}},
    "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":10}
}
, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});


dynamoDB.putItem(
{"TableName":"Table1",
    "Item":{
        "Color":{"S":"white"},
        "Name":{"S":"fancy vase"},
        "Weight":{"N":"2"}
    }
}
, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});


dynamoDB.getItem(
{"TableName":"Table1",
    "Key": 
        {"HashKeyElement": {"S":"white"},
        "RangeKeyElement": {"N":"2"} 
    },
    "AttributesToGet":["Color","Weight", "Name"],
    "ConsistentRead":true
}
, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});

