const express = require('express');
const { compose } = require('ramda');

const [before, after] = require('./middlewares');
const routes = require('./routes');
const database = require('./database');

const basePath = '/api/skillz';
const port = process.env.PORT || 3000;
const listen = app => app.listen(port, () => 
    console.log(`Skills Matrix listening on port ${port}`));
const app = compose(listen, after, routes(basePath), before);

module.exports = database.connect() && app(express());
