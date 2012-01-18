/** Create a DynamoDB table.
 */


var dynamoDB = require('../lib/dynamoDB');
require('fs').readFile('credentials.json', 'utf8', function (err, data) {
    if (err) { throw err; }
    console.log(JSON.stringify(dynamoDB.DynamoDB(JSON.parse(data))));
});
