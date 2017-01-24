var knex = require('knex');
var express = require('express');
var _ = require('lodash');

function Rest() {
  this.middleware = [];
  this.executeOddEven = (oddCallback, evenCallback) => {
    if (this.pathSegments.length % 2) {
        // segments is odd: querying for an array
        this.select(this.pathSegments[0])
          .then((result) => {
            console.log('sending result');
            return res.send(result);
          })
          .catch((error) => {
            console.log('error registerDbMiddleware array', error);
            return next(error);
          });
      } else {
        // segments is even: querying for one object
        this.select(this.pathSegments[0])
          .where('Id', this.pathSegments[1])
          .limit(1)
          .then((result) => {
            console.log('sending result');
            return res.send(result[0]);
          })
          .catch((error) => {
            console.log('error in registerDbMiddleware single', error);
            return next(error);
          });
      }
  };
  this.registerDbMiddleware = (rest) => {
    rest.on({ method: 'GET' }, (req, res, next) => {
      console.log('executing registerDbMiddleware with {method: \'GET\'}')
      if (this.pathSegments.length % 2) {
        // segments is odd: querying for an array
        this.select(this.pathSegments[0])
          .then((result) => {
            console.log('sending result');
            return res.send(result);
          })
          .catch((error) => {
            console.log('error registerDbMiddleware array', error);
            return next(error);
          });
      } else {
        // segments is even: querying for one object
        this.select(this.pathSegments[0])
          .where('Id', this.pathSegments[1])
          .limit(1)
          .then((result) => {
            console.log('sending result');
            return res.send(result[0]);
          })
          .catch((error) => {
            console.log('error in registerDbMiddleware single', error);
            return next(error);
          });
      }
    });

    rest.on({ method: 'POST' }, (req, res, next) => {
      console.log('handling { method: \'POST\' }');
      this.insert()
      res.send('post request received');
    });
  };

  this.verifyRequest = (req, res, next) => {
    console.log('in verifyRequest');
    // take only sensible parts of the path
    this.pathSegments = _.filter(req.path.split('/'), (part) => part.length > 0);

    if (this.pathSegments.length === 0) {
      return res.send('You didn\'t request anything');
    } else {
      return next();
    }
  };

  this.objectMiddleware = (req, res, next) => {
    console.log('in objectMiddleware');
    let current = this;
    current.layers = this.middleware;

    function executeNextLayer() {
      // set the current layer to be executed
      let layer = current.layers[0];
      // set the next layers to be the rest of the layers
      current.layers = _.tail(current.layers);

      // if there is no current layer
      if (!layer) {
        console.log('no layers available');
        return next();
      }

      // if the layer matches, execute handler
      if (_.matches(layer.query)(req)) {
        console.log('executing layer.handler with executeNextLayer');
        layer.handler(req, res, executeNextLayer);
      } else {
        // if the layer doesn't match, executeNextLayer()
        console.log('layer doesn\'t match, continue with executeNextLayer()');
        return executeNextLayer();
      }
      // }
    }
    // initial invoke of executeNextLayer()
    console.log('initial invoke executeNextLayer()');
    return executeNextLayer();
  };
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
  on(queryObject, handler) {
    this.middleware.push({ query: queryObject, handler });
  },
  listen(port, url = '/*') {
    this.app = express();

    // register middleware to verify request
    // register middleware to invoke object-driven middleware
    this.app.use(this.verifyRequest, this.objectMiddleware);
    this.registerDbMiddleware(this);

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
