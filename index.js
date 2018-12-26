const express = require('express');
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
  console.log(`Listening on port ${port}`);
});

// NOTE: Routes with parameters and query
/*
  app.get('/test/:id', (req, res) => {
    res.send(req.params.id);
    res.send(req.query);
  });
*/
