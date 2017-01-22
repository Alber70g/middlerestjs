var req = { method: 'POST', path: '/users/1/todos', query: { $filter: 'category eq 1' } };
var layers = [
    { query: { method: 'POST' } },
    { query: { method: 'GET', path: '/users/1/todos' } },
    { query: { method: 'GET' } }
];

_.filter(_.map(layers, layer => layer.query), query => _.matches(query)(req) );
