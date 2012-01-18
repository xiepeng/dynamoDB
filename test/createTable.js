/** Create a DynamoDB table.
 */


var dynamoDB = require('../lib/dynamoDB'),
    auth = require('../lib/auth');
require('fs').readFile('credentials.json', 'utf8', function (err, data) {
    if (err) { throw err; }
    var db = dynamoDB.DynamoDB(JSON.parse(data));
    console.log(JSON.stringify(db));
    db.listTables();
    setTimeout(db.listTables, 2000);
    
});
