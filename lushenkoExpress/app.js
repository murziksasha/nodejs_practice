const express = require('express'); // Подключаем Express
const app = express(); // Создаем экземпляр приложения
const logger = require('morgan');

const port = 3000; // Порт, на котором будет работать сервер]

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');

app.use(logger('dev'));

// app.use('/', indexRouter);
// app.use('/users', userRouter);

// Маршрут для GET-запроса на главную страницу
app.get('/', (req, res) => {
  res.send('Привет, мир!'); // Ответ на запрос: "Привет, мир!"
});

// Маршрут для GET-запроса на другую страницу
app.get('/about', (req, res) => {
  res.send('Это страница "О нас"');
});

// Обработка POST-запроса
app.post('/submit', (req, res) => {
  res.send('Данные получены!');
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

module.exports.app;
