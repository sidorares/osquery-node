var thrift = require('thrift');

var ExtensionManager = require('./gen-nodejs/ExtensionManager.js');
var Types            = require('./gen-nodejs/osquery_types.js');

function Client(opts) {
  opts = opts || {};
  var path = opts.path || '/var/osquery/osquery.em';
  var conn = thrift.createConnection(0, path);
  this._em = thrift.createClient(ExtensionManager, conn);
  this._socketPath = path;
}

Client.prototype.query = function(sql, cb) {
  this._em.query(sql, cb);
};

Client.prototype.addExtension = function() {

};

module.exports.createClient = function(opts) { return new Client(opts); };

Client.prototype.createServer = function(opts) {
  var Server = require('./extension_server.js');
  return new Server(this, opts);
};
