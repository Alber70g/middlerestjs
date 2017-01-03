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
  update(table, id, properties) {

  },
  listen(port, url = '/*') {
    this.app = express();

    this.app.get(url,
      (req, res, next) => {
        // take only sensible parts of the path
        this.pathSegments = _.filter(req.path.split('/'), (part) => part.length > 0);

        

        if (this.pathSegments.length === 0) {
          res.send('You didn\'t request anything');
          return;
        } else {
          next();
        }
      },
      (req, res, next) => {
        
        if (this.pathSegments.length % 2) {
          // segments is odd: querying for an array
          this.select(this.pathSegments[0])
            .then((result) => {
              res.send(result);
            })
            .catch((error) => {
              next(error);              
            });
        } else {
          // segments is even: querying for one object
          this.select(this.pathSegments[0]).where('Id', this.pathSegments[1]).limit(1)
            .then((result) => {
              res.send(result[0]);
            })
            .catch((error) => {
              next(error);              
            });
        }
      }
    );

    this.app.use((err, req, res, next) => {
      res.status(500).send({
        message: err.message,
        stack: err.stack
      });
    });

    this.app.listen(port);
  }
}

module.exports = new Rest();
