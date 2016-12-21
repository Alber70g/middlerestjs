var rest = require('./lib');

rest.configure({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'root',
    database: 'tododb'
  },
  pool: { min: 5, max: 150 }
});

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
