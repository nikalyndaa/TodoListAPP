#Tasks App: React Native + ASP.NET Core

Тестовий мобільний застосунок для керування завданнями. Проєкт демонструє навички роботи з **ASP.NET Core Web API** та **React Native (Expo)**, зокрема автентифікацію через **JWT**.

## Можливості

- Реєстрація та вхід користувача (JWT)
- Перегляд списку завдань
- Створення, редагування та видалення завдань
- Пошук і фільтрація за статусом
- Pull-to-refresh

##Технології

**Mobile:** React Native, Expo Go, Expo Router, NativeWind, TypeScript

**Backend:** ASP.NET Core Web API, Entity Framework Core, JWT Bearer Authentication

##Архітектура бекенду

```
WebAPI/
├── Constants/     # константи
├── Controllers/   # API-контролери
├── Data/          # DbContext
├── Extensions/    # Seeder
├── Helpers/       # допоміжні класи
├── Interfaces/    # контракти сервісів
├── Migrations/    # міграції EF Core
├── Models/        # сутності та DTO
├── Services/      # бізнес-логіка
└── Program.cs
```

##Запуск

### Backend
```bash
cd WebAPI
dotnet restore
dotnet ef database update
dotnet run
```

###Mobile
```bash
cd mobile
npm install
npx expo start
```
Скануйте QR-код застосунком **Expo Go**. Вкажіть адресу API в налаштуваннях клієнта (для телефона використовуйте IP комп'ютера, а не `localhost`).

##Автентифікація

1. `POST /api/auth/register`: реєстрація
2. `POST /api/auth/login`: повертає JWT
3. Токен додається до запитів: `Authorization: Bearer <token>`