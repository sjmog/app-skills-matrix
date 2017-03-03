const express = require('express');
const { compose } = require('ramda');
const exphbs  = require('express-handlebars');

const [before, after] = require('./middlewares');
const routes = require('./routes');
const database = require('./database');

const basePath = '/skillz';
const port = process.env.PORT || 3000;
const listen = app => app.listen(port, () =>
    console.log(`Skills Matrix listening on port ${port}`));
const addMiddleware = compose(listen, after, routes(basePath), before);

let app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

module.exports = database.connect() && addMiddleware(app);
