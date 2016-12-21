var knex = require('knex');
var express = require('express');
var _ = require('lodash');

function Rest() {

}

Rest.prototype = {
  configure(config) {
    this.db = knex(config);
  },
  select(table, properties = '*') {
    return this.db(table).select(properties);
  },
  insert(table, object, properties = '*') {
    return this.db(table).insert(object).returning(properties);
  },
  listen(port, url = '/*') {
    this.app = express();

    this.app.get(url, (req, res, next) => {
      // take only sensible parts of the path
      this.pathSegments = _.filter(req.path.split('/'), (part) => part.length > 0);

      // console.log('1st middleware', this.pathSegments);

      if (this.pathSegments.length === 0) {
        res.send('You didn\'t request anything');
      } else {
        next();
      }
    },
      (req, res) => {
        // console.log('2nd middleware', this.pathSegments);
        if (this.pathSegments.length % 2) {
          // segments is odd: querying for an array
          this.select(this.pathSegments[0])
            .on('query-error', function (error, obj) {
              // console.log('on query-error');
              app.log(error);
            })
            .then((result) => {
              // console.log('then', result);
              res.send(result);
            })
            .catch((error) => {
              // console.log('catch', error);
            });
        } else {
          // segments is even: querying for one object
          this.select(this.pathSegments[0]).where('Id', this.pathSegments[1]).limit(1)
            .on('query-error', function (error, obj) {
              // console.log('on query-error', error);
            })
            .then((result) => {
              // console.log('then', result);
              res.send(result[0]);
            })
            .catch((error) => {
              // console.log('catch', error);
            });
        }
      });

    this.app.listen(port);
  }
}

module.exports = new Rest();
