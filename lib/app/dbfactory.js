
function DbFactory(config) {
  switch (config.type) {
    case 'postgres':
      return new require('./databases/postgres')(config);
  }
}

module.exports = new DbFactory();


