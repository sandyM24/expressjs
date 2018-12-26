const express = require('express');
const debug = require('debug')('app:startup');
const Joi = require('joi');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

const logger = require('./custom_middleware/logger');

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

const courses = [
  { id: 1, name: 'NodeJS' },
  { id: 2, name: 'ReactJS' },
  { id: 3, name: 'JavaScript' }
];

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.render('index', { title: 'My Express APP', h1: 'Hello World! How r u?' });
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with given ID is not found!');
    return;
  }

  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const result = courseValidation(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);

  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course u wanna update is not found!');
    return;
  }

  const result = courseValidation(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course u wanna delete is not found!');
    return;
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function courseValidation(course) {
  const schema = {
    name: Joi.string()
      .min(1)
      .required()
  };

  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
