const express = require('express');
const debug = require('debug')('app:startup');
const Joi = require('joi');
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: 'NodeJS' },
  { id: 2, name: 'ReactJS' },
  { id: 3, name: 'JavaScript' }
];

app.get('/', (req, res) => {
  res.send('Hello World!');
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
