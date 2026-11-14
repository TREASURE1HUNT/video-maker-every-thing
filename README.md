# Video Maker Every Thing

[Открыть студию](https://treasure1hunt.github.io/video-maker-every-thing/workspace.html)

Русскоязычная локальная видеостудия: проекты, шесть монтажных сценариев, бренд-кит, монтажный план по правилам, ручной таймлайн, обрезка/разделение/скорость, цвет/кадр, текст, SRT, музыка, контрольные точки и экспорт WebM/PNG/JSON/TXT/SRT.

Материалы и проекты сохраняются в IndexedDB текущего браузера/домена. Держите резервный JSON и исходники. JSON не содержит медиа.

[Администрирование](https://video-maker-every-thing.izhanshahfarul.chatgpt.site/admin/) опубликовано отдельно на приватном Sites: Worker + D1, ChatGPT sign-in и серверный RBAC. Компоненты Button/Card взяты из Qualiora/Shadboard, MIT; лицензия в platform/admin/SHADBOARD-LICENSE.txt.

Исходники backend/admin: platform/. npm ci, npm test, npm run build (Node24+). В production необходимы корректный hosting manifest и доверенный Sites ingress. scripts/preview-admin.mjs — только loopback-тест с фиктивной идентичностью, не публичный сервер. Данные preview не поставляются.

[Подробный разбор InVideo и статусы реализации](platform/FEATURE_AUDIT.md). Полный паритет InVideo не заявляется. Нейросети требуют серверного адаптера; автоматическая транскрипция, генерация медиа, cloud MP4, собственный MCP, многодорожечный NLE, совместная работа и экспорт NLE-проектов ещё не реализованы.

[Руководство редактора](EDITOR_GUIDE.md) · [Администрирование](platform/ADMIN_GUIDE.md)

## Подписки
Lite — 9 USDT, 5 новых видеопроектов / 14 дней; Plus — 19 USDT, 7 / 7 дней; Pro — 39 USDT, 10 / 7 дней. Базовая цена в USD, точная сумма USDT у провайдера. Доступ 30 дней, Free только просмотр. Страница pricing.html; модель выбирается в рабочем пространстве и редакторе. NOWPayments USDT TRC20 подготовлен, но ключа пока нет — реальные счета не создаются. [Настройка и политика квот](platform/BILLING_GUIDE.md).
