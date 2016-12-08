var dbFactory = require('./dbfactory');

function Rest() {
    this.db = null;
    this.registry = [];
}

Rest.prototype.configure = function (dbConfiguration) {
    this.db = dbFactory(dbConfiguration);
}

/**
 * @param  {{verb: string, table: string}} definition
 * @param  {function} callback
 */
Rest.prototype.on = function (definition, callback) {
    definition.handler = callback;
    this.registry.push(definition);
}