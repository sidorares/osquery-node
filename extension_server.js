var thrift = require('thrift');

var Extension = require('./gen-nodejs/Extension.js');
var Types     = require('./gen-nodejs/osquery_types.js');

var OK_STATUS = new Types.ExtensionStatus({ code: 0, message: 'OK' });

var Server = function(client, opts) {
  this._plugins = opts.plugins || [];
  this._info    = new Types.InternalExtensionInfo(opts.info || {});
  this._registry = {};
  this._clientSocketPath = client._socketPath;
  this._em = client._em;
  var registry = this._registry;
  var self = this;
  self._handlers = {};
  self._plugins.forEach(function(p) {
    if (!registry[p.type])
      registry[p.type] = {};
    if (p.type === 'table') {
      registry[p.type][p.name] = p.schema;
    }
    // TODO: other plugin types
    self._handlers[p.type + '_' + p.name] = p.handler;
  });
};

Server.prototype._callDispatcher = function(registry, item, request, result) {
  var handler = this._handlers[registry + '_' + item];
  var resp;

  var respondWithError = function(err) {
    result(null, new Types.ExtensionResponse({
      status: new Types.ExtensionStatus({ code: -1, message: err.message })
    }));
  };
  try {
    handler(request, function(err, data) {
      if (err) {
        return respondWithError(err);
      }
      result(null, new Types.ExtensionResponse({
        status: OK_STATUS,
        response: data
      }));
    });
  } catch(e) {
    respondWithError(e);
  }
};

Server.prototype.listen = function(cb) {
  if (!cb) {
    cb = function(err) {
      if (err) throw err;
    };
  }
  var self = this;
  this._em.registerExtension(this._info, this._registry, function(err, resp) {
    if (err)
       return cb(err);
    self._server = thrift.createServer(Extension, {
      ping: function(result) {
        result(null, OK_STATUS);
      },
      call: Server.prototype._callDispatcher.bind(self)
    }, {transport: thrift.TBufferedTransport});

    var socketPath = self._clientSocketPath + '.' + resp.uuid.toString();
    self._server.listen(socketPath, function(err) {
      if (err) return cb(err);
      cb (null, self._server);
    });
  });
};

module.exports = Server;
