const express = require('express');
const debug = require('debug')('app:startup');
const app = express();

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  debug(`Listening on port ${port}`);
});
