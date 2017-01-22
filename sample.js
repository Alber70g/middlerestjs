var rest = require('./lib');

var pgConfig = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'albert',
    password: 'root',
    database: 'tododb'
  },
  pool: { min: 5, max: 150 }
};

var mssqlConfig = {
  client: 'mssql',
  connection: {
    host: '127.0.0.1',
    user: 'sa',
    password: 'root',
    database: 'tododb'
  },
  pool: { min: 5, max: 150 }
}
rest.configure(pgConfig);

rest.on({ method: 'GET' }, (req, res, next) => {
  console.log('before db');
  console.log('executing next()');
  next();
  console.log('after db');
})

// rest.seed([
//     {
//         table: 'user',
//         records: [
//             { id: 1, name: 'Albert Groothedde' },
//             { id: 2, name: 'Lianne Knol' },
//             { id: 3, name: 'Bram Groothedde' }
//         ]
//     }
// ]);

rest.listen(3000);
