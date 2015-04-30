var osquery = require('../index.js');

var generateTable = function(req, resp) {
  resp(null, [{
        "foo": "foo value",
        "bar": "bar value " + Date.now()
      }]
  );
};

var c = osquery.createClient();
var s = c.createServer({
  info: {
    name: 'test table extension'
  },
  plugins: [{
    type: 'table',
    name: 'node_ext_table',
    schema: [
      {"name": "foo", "type": "TEXT"},
      {"name": "bar", "type": "TEXT"}
    ],
    handler: generateTable
  }]
});

s.listen(function(err, serv) {
  console.log('extension started!');
});
