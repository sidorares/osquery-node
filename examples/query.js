var osquery = require('../index.js');
var os = osquery.createClient();
//os.query('select * from osquery_extensions', console.log);
os.query('select * from node_ext_table', console.log);
