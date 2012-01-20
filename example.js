// You can read your credentials from a local file.
var credentials = {AccessKeyId : "*Your Access Key**", 
                   SecretKey   : "*Your Secret Key**********"}

var dynamoDB = require('./lib/dynamoDB').DynamoDB(credentials);

/*
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
*/

dynamoDB.listTables({}, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});

/*
dynamoDB.deleteTable({"TableName":"Table1"}, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});
*/

dynamoDB.describeTable({"TableName":"Table1"}, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});


dynamoDB.putItem(
    {"TableName":"Table1",
        "Item":{
            "Color" :{ "S":"white"},
            "Name"  : {"S":"fancy vase"},
            "Weight": {"N":"2"}
        }
    }
, function(result) {
        result.on('data', function(chunk){
            console.log(""+chunk);
        });
});


dynamoDB.putItem(
    {"TableName":"Table1",
        "Item":{
            "Color" :{ "S":"blue"},
            "Name"  : {"S":"vanilla bowl"},
            "Weight": {"N":"5"}
        }
    }
, function(result) {
        result.on('data', function(chunk){
            console.log(""+chunk);
        });
});


dynamoDB.putItem(
    {"TableName":"Table1",
        "Item":{
            "Color" :{ "S":"red"},
            "Name"  : {"S":"sofa"},
            "Weight": {"N":"300"}
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
            {"HashKeyElement"   : {"S":"white"},
            "RangeKeyElement"   : {"N":"2"}
        },
        "AttributesToGet"   : ["Color","Weight", "Name"],
        "ConsistentRead"    : true
    }, function(result) {
        result.on('data', function(chunk){
            console.log(""+chunk);
        });
});


dynamoDB.batchGetItem(
    {"RequestItems":
        {"Table1": 
            {"Keys": 
                [{"HashKeyElement"  : {"S":"white"}, "RangeKeyElement":{"N":"2"}},
                {"HashKeyElement"   : {"S":"blue"}, "RangeKeyElement":{"N":"5"}},
                {"HashKeyElement"   : {"S":"red"}, "RangeKeyElement":{"N":"3"}}],  // you won't get sofa because it weighs 300.
            "AttributesToGet":["Color", "Weight", "Name"]}
        }
    }
, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});

dynamoDB.scan(
    {"TableName"    :"Table1",
        "Limit"     : 2,
        "ScanFilter":{
            "Name"  :{"AttributeValueList":[{"S":"sofa"}],"ComparisonOperator":"EQ"}
        },
        "AttributesToGet":["Color", "Weight", "Name"]
    }
, function(result) {
    result.on('data', function(chunk){
        console.log(""+chunk);
    });
});

