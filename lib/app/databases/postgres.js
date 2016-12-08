function PostgresDb(config) {
  this.postgres = require('pg');
  this.connectionString = config.connectionString;
}

/**
 * @param  {{ table: string, properties: string[], id: number }} queryObject
 */
PostgresDb.prototype.select = function (queryObject) {
  let results = [];
  const client = new this.postgres.connect(this.connectionString, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      throw new Exception(err);
    }

    let query = 'SELECT ';
    query += queryObject.properties ? queryObject.properties.join(', ') + ' ' : '* ';
    query += 'FROM ' + queryObject.table + ' ';
    query += queryObject.id ? 'WHERE id = ' + queryObject.id : '';

    const dbQuery = client.query(query);

    dbQuery.on('row', row => {
      results.push(row);
    });

    dbQuery.on('end', () => {
      done();
      return queryObject.id ? results[0] : results;
    })

  });
}

module.export = PostgresDb;
