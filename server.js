const { conn, Task } = require('./db');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());

app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));

app.get('/api/tasks', async (req, res, next) => {
  try {
    res.send(await Task.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/tasks', async (req, res, next) => {
  try {
    res.status(201).send(await Task.create(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    await task.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    await task.update(req.body);
    res.send(task);
  } catch (ex) {
    next(ex);
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const port = process.env.PORT || 3000;

const init = async () => {
  try {
    await conn.sync({ force: true });
    await Promise.all([
      Task.create({
        name: 'clean clost',
        complete: true,
        description: 'closet description',
        difficulty: 'MEDIUM',
      }),
      Task.create({
        name: 'study react',
        complete: true,
        description: 'study react description',
        difficulty: 'DIFFICULT',
      }),
      Task.create({
        name: 'buy milk',
        description: 'buy milk description',
        difficulty: 'EASY',
      }),
      Task.create({
        name: 'do laundry',
        description: 'do laundry description',
        difficulty: 'DIFFICULT',
      }),
    ]);
    //sync database and seed data here
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
