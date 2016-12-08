var Rest = require('./Rest');
var _ = require('lodash');

module.exports = RestFactory;

function RestFactory() {
    return new Rest();
}
