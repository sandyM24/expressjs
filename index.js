const express = require('express');
const courses = require('./routes/courses');
const home = require('./routes/home');
const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

const logger = require('./middleware/logger');

// Template Engine ( we don't need to require )
app.set('view engine', 'pug');
app.set('views', './views'); // by default optional

// Configuration
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail host: ${config.get('mail.host')}`);
console.log(`Mail password: ${config.get('mail.password')}`); // For this add "export app_password=1234"

// Environment
// console.log(process.env.NODE_ENV); // By default it return undefined
console.log(app.get('env')); // By default it return 'development'

// Built in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // We can access 'localhost:3000/readme.txt'

// Custom Middleware
app.use(logger);

// Third party middleware
app.use(helmet());
if (app.get('env') === 'development') {
  // Only enanled in development env by using enviornment.
  app.use(morgan('tiny'));
  debug('Morgan Enabled');
}

app.use('/api/courses', courses);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
