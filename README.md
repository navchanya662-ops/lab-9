# Лабораторна робота 9

## Тема

Реєстрація користувачів: `bcrypt`, валідація email, збереження користувача в MongoDB.

## Мета роботи

Мета лабораторної роботи - реалізувати безпечну реєстрацію користувачів у Node.js/Express API. У проєкті використано MongoDB для збереження даних, Mongoose для опису моделей, `bcryptjs` для хешування паролів та MVC-структуру для організації коду.

## Індивідуальний варіант

Варіант 1: онлайн-магазин.

Основна сутність: `Product`.

Поля сутності `Product`:

- `name` - назва товару;
- `description` - опис товару;
- `price` - ціна;
- `category` - категорія;
- `stock` - кількість товару на складі.

Для цієї лабораторної роботи для `Product` створено лише Mongoose-модель зі схемою та валідацією. Окремі маршрути для товарів не потрібні за умовою завдання.

## Що реалізовано

- Ініціалізовано Node.js/Express-проєкт.
- Налаштовано підключення до MongoDB через Mongoose.
- Створено модель користувача `User`.
- Створено модель основної сутності варіанту `Product`.
- Реалізовано маршрут `POST /api/auth/register`.
- Додано перевірку обов'язкових полів.
- Додано перевірку формату email.
- Додано перевірку збігу `password` і `confirmPassword`.
- Додано перевірку унікальності email.
- Додано хешування пароля через `bcryptjs`.
- Налаштовано єдиний формат відповіді `{ success, message, data }`.
- Пароль не повертається у відповідях API.

## Використані технології

- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- dotenv
- nodemon

## Структура проєкту

```text
lab 9/
  app.js
  package.json
  package-lock.json
  test.http
  .env
  .gitignore
  README.md

  config/
    database.js

  controllers/
    authController.js

  errors/
    ApiError.js

  middlewares/
    asyncHandler.js
    errorHandler.js

  models/
    User.js
    Product.js

  routes/
    authRoutes.js
```

## Основні файли

### `app.js`

Головний файл запуску сервера. У ньому підключається Express, MongoDB, маршрут авторизації та глобальний обробник помилок.

```js
app.use('/api/auth', authRoutes);
```

### `models/User.js`

Mongoose-модель користувача.

Поля:

- `name` - ім'я користувача;
- `email` - унікальний email з перевіркою формату;
- `password` - хешований пароль, не повертається у звичайних запитах через `select: false`;
- `role` - роль користувача, `user` або `admin`;
- `createdAt` - дата створення.

### `models/Product.js`

Mongoose-модель товару для варіанту 1.

Поля:

- `name`;
- `description`;
- `price`;
- `category`;
- `stock`;
- `createdAt`.

У моделі додано базову валідацію: обов'язковість полів, мінімальну довжину текстових полів, заборону від'ємних значень для `price` і `stock`.

### `controllers/authController.js`

Контролер реєстрації користувача. Він перевіряє дані, хешує пароль і створює користувача в MongoDB.

### `routes/authRoutes.js`

Файл маршруту авторизації.

```js
router.post('/register', register);
```

Повний endpoint:

```text
POST /api/auth/register
```

## Налаштування `.env`

Файл `.env` має містити:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/lab9_shop
```

Якщо використовується MongoDB Atlas, потрібно замінити `MONGO_URI` на рядок підключення з Atlas.

## Встановлення залежностей

```powershell
npm install
```

## Запуск проєкту

```powershell
npm start
```

Або в режимі розробки:

```powershell
npm run dev
```

Після запуску сервер доступний за адресою:

```text
http://localhost:3000
```

## API реєстрації

### Успішна реєстрація

Запит:

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json
```

Тіло запиту:

```json
{
  "name": "Ivan Petrenko",
  "email": "ivan@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Очікувана відповідь:

```json
{
  "success": true,
  "message": "Реєстрація успішна",
  "data": {
    "user": {
      "id": "...",
      "name": "Ivan Petrenko",
      "email": "ivan@example.com",
      "role": "user",
      "createdAt": "..."
    }
  }
}
```

Поле `password` у відповіді відсутнє.

### Повторний email

```json
{
  "success": false,
  "message": "Користувач з таким email вже існує",
  "data": null
}
```

### Відсутнє поле

```json
{
  "success": false,
  "message": "Усі поля обовʼязкові",
  "data": null
}
```

### Паролі не збігаються

```json
{
  "success": false,
  "message": "Паролі не збігаються",
  "data": null
}
```

### Некоректний email

```json
{
  "success": false,
  "message": "Некоректний формат email",
  "data": null
}
```

## Тестування

Для тестування підготовлено файл:

```text
test.http
```

Також ці самі запити можна виконати в Postman.

Для звіту варто зробити скріншоти:

- успішної реєстрації;
- повторного email;
- відсутнього поля;
- паролів, що не збігаються;
- некоректного email;
- документа користувача в MongoDB Compass або Atlas.

## Що перевірити в MongoDB

Після успішної реєстрації у колекції `users` має з'явитися документ.

Потрібно перевірити:

- email збережено;
- роль має значення `user`;
- пароль збережено як bcrypt-хеш;
- поля `confirmPassword` у базі немає.

## Формат відповідей

Успішна відповідь:

```json
{
  "success": true,
  "message": "Повідомлення",
  "data": {}
}
```

Помилка:

```json
{
  "success": false,
  "message": "Опис помилки",
  "data": null
}
```

## Висновок

У лабораторній роботі реалізовано базовий модуль реєстрації користувачів для API онлайн-магазину. Дані користувача проходять валідацію, email перевіряється на унікальність, пароль хешується за допомогою `bcryptjs`, а відповідь клієнту не містить чутливих даних. Також створено модель `Product` для індивідуального варіанту 1.
