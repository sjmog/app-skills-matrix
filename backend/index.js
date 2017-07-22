import express from 'express';
import { compose } from 'ramda';
import exphbs from 'express-handlebars';

import middleware from './middlewares';
import routes from './routes';
import database from './database';

const [before, after] = middleware;
const basePath = '/skillz';
const port = process.env.PORT || 3000;
const listen = app => app.listen(port, () =>
  console.log(`Skills Matrix listening on port ${port}`));
const addMiddleware = compose(listen, after, routes(basePath), before);

const app = express();

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', `${__dirname}/views`);

module.exports = database.connect() && addMiddleware(app);
