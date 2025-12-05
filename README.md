# NovaBlog — Modern Blog Platform (Next.js + Firebase)

NovaBlog — це сучасний блоговий застосунок, створений на базі **Next.js 15**, **React 18**, **Redux Toolkit** та **Firebase Firestore**. Проєкт орієнтований на масштабованість, чисту архітектуру та високий стандарт якості коду.

---

## Технічний стек

* **Core:** Next.js 15 (App Router), React 18, TypeScript
* **State Management:** Redux Toolkit, React-Redux
* **Backend & DB:** Firebase (Firestore)
* **Styling:** SCSS Modules, кастомні шрифти (Source Sans Pro)
* **Forms & Validation:** React Hook Form + Zod
* **Testing:** Jest
* **Code Quality:** ESLint, Prettier, Husky, Lint-staged

---

## Структура проєкту

```
├── app/                      # Next.js App Router
│   ├── (root)/               # Основна група маршрутів
│   │   ├── blog/             # Blog list + Post details
│   │   └── page.tsx          # Головна сторінка
│   ├── layout.tsx            # Root Layout (Redux Provider, Fonts)
│   └── globals.scss          # Глобальні стилі
├── src/
│   ├── features/             # Бізнес-логіка (Slices, Components, Thunks)
│   │   ├── posts/            # Управління постами + тести
│   │   ├── comments/         # Коментарі + тести
│   │   └── filters/          # Фільтри списку постів
│   ├── hooks/                # useAppDispatch, useAppSelector
│   ├── lib/                  # Конфігурація Firebase
│   ├── store/                # Redux Store setup
│   ├── types/                # TypeScript інтерфейси
│   └── utils/                # Допоміжні функції + тести
└── public/                   # Статичні файли
```

---

## Основні можливості

* **Перегляд постів:** динамічний список статей із пагінацією та фільтрами
* **Деталі поста:** окрема slug-сторінка з розрахунком часу читання
* **Створення постів:** модальне вікно, кероване через URL (`?create=1`)
* **Коментарі:** додавання та перегляд коментарів до статей

---

## Запуск проєкту

### 1. Вимоги

Необхідний **Node.js 18+**.

---

### 2. Установка залежностей

```bash
npm install
# або
yarn install
```

(Під час встановлення автоматично налаштовується Husky.)

---

### 3. Налаштування Firebase

Проєкт очікує конфігурацію в:
`src/lib/firebase.ts`

Заповніть ваші Firebase ключі згідно з вашим проєктом.

---

### 4. Запуск у режимі розробки

```bash
npm run dev
```

Доступно за адресою:
[http://localhost:3000](http://localhost:3000)

---

## Тестування та контроль якості

### Доступні скрипти

| Команда              | Опис                     |
| -------------------- | ------------------------ |
| `npm run dev`        | Режим розробки           |
| `npm run build`      | Створення продакшн білда |
| `npm run start`      | Запуск продакшн сервера  |
| `npm run lint`       | Перевірка ESLint         |
| `npm run type-check` | Перевірка типів          |
| `npm run format`     | Перевірка стилю Prettier |
| `npm run test`       | Запуск Jest тестів       |

---

### Покриття тестами (Unit Tests)

* **Utils (`src/utils/*.test.ts`)**
  Алгоритми розрахунку часу читання, форматування дат.
* **Redux Slices (`src/features/**/*.test.ts`)**
  Reducers `postsSlice` та `commentsSlice`:
  перевірка зміни стейту при успішних/неуспішних запитах.
* **Firebase Mocking**
  `jest.mock` для повної ізоляції від мережі та швидких стабільних тестів.

---

## Pre-Commit Hooks

Проєкт використовує **Husky** + **Lint-staged**.
Перед кожним комітом автоматично виконується:

* форматування Prettier
* перевірка ESLint

---
