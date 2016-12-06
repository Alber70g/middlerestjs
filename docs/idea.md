# Middleware based REST framework (middlerestjs)

## Problem introduction
The idea is based on the fact that we don't do a lot on the backend anymore. Most of the time it's nothing more than a hatch to the database. The concept of MVC (Model View Controller) is not mandatory for usage with REST API's since the need for a traditional 'View' has disappeared. This is because we use most times client single page applications to show the date. These client's are essentially the 'view' layer.

## Why we have a backend
To make sure we don't miss out on what we want to do with the new framework, we need to identify what we usually do on the backend:
- authentication of client/user
- authorization on specified resources
- mapping of data from client- to database-models and vice versa
- validation of data from the client before inserting into the database
- providing filtering for the client

## The framework
The framework is based on the idea of middleware. If you didn't setup any custom middleware for a `model`, the default action will be executed. The default action for a `GET` request will be a query for one or multiple models based on the url (e.g. `user` or `user/1`). A `POST`, `PUT` and `DELETE` will result in the default action respectively `create`, `update` or `delete` of a record in the database.

## Simplest middleware definition
As an example we'll add some authorization checks to the `user` model. We only want the user to see and edit it's own userobject.
```js
var rest = require('middlerestjs'); 

rest.on({ type: 'GET', model: 'user' }, function(model, context, dbFn) {
    if (context.user && context.user.id === model.id) {
        // current user is making a request for his own userObject
        return dbFn(); 
    } else {
        // ... return 403 unauthorized
    }
});

app.use(rest);

```
