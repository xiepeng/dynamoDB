/** Create a DynamoDB table.
 */


var dynamoDB = require('../lib/dynamoDB'),
    auth = require('../lib/auth');
require('fs').readFile('credentials.json', 'utf8', function (err, data) {
    if (err) { throw err; }
    var db = dynamoDB.DynamoDB(JSON.parse(data));
    db.listTables({}, function(res){
        console.log(res.statusCode);
        res.on('data', function (chunk) {console.log(""+chunk)}
        );
    });
    
});
