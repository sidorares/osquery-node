osquery-node
==============

Facebook [osquery](https://github.com/facebook/osquery) client for node.js

## Installation

    npm install osquery

## Usage

client:

```js
var osquery = require('osquery');

var os = osquery.createClient({ path: '/var/osquery/osquery.em' });
os.query('select * SELECT uid, name FROM listening_ports l, processes p WHERE l.pid=p.pid', function(err, res) {
  console.log(res);
});

```

Table plugin:

```js
var osquery = require('osquery');

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
```

## License

MIT

## See also
 - [mysql to osquery proxy](https://github.com/sidorares/mysql-osquery-proxy)
 - [python client](https://github.com/osquery/osquery-python)
