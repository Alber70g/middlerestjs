var rest = require('./lib');

rest.configure({
    type: 'postgres',
    host: 'localhost',
    username: 'root',
    password: 'root',
    database: 'testdb'
});

rest.seed([
    {
        table: 'user',
        records: [
            { id: 1, name: 'Albert Groothedde' },
            { id: 2, name: 'Lianne Knol' },
            { id: 3, name: 'Bram Groothedde' }
        ]
    }
])

rest.on({}, function (model, context, next) {

})

rest.on({ verb: 'GET' }, function (model, context, next) {

});

rest.listen(3000);
