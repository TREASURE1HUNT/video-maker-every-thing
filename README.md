# Video Maker Every Thing

[Открыть студию](https://treasure1hunt.github.io/video-maker-every-thing/workspace.html)

Русскоязычная локальная видеостудия: проекты, шесть монтажных сценариев, бренд-кит, монтажный план по правилам, ручной таймлайн, обрезка/разделение/скорость, цвет/кадр, текст, SRT, музыка, контрольные точки и экспорт WebM/PNG/JSON/TXT/SRT.

Материалы и проекты сохраняются в IndexedDB текущего браузера/домена. Держите резервный JSON и исходники. JSON не содержит медиа.

[Администрирование](https://video-maker-every-thing.izhanshahfarul.chatgpt.site/admin/) опубликовано отдельно на приватном Sites: Worker + D1, ChatGPT sign-in и серверный RBAC. Компоненты Button/Card взяты из Qualiora/Shadboard, MIT; лицензия в platform/admin/SHADBOARD-LICENSE.txt.

Исходники backend/admin: platform/. npm ci, npm test, npm run build (Node24+). В production необходимы корректный hosting manifest и доверенный Sites ingress. scripts/preview-admin.mjs — только loopback-тест с фиктивной идентичностью, не публичный сервер. Данные preview не поставляются.

[Подробный разбор InVideo и статусы реализации](platform/FEATURE_AUDIT.md). Полный паритет InVideo не заявляется. Нейросети требуют серверного адаптера; автоматическая транскрипция, генерация медиа, cloud MP4, собственный MCP, многодорожечный NLE, совместная работа и экспорт NLE-проектов ещё не реализованы.

[Руководство редактора](EDITOR_GUIDE.md) · [Администрирование](platform/ADMIN_GUIDE.md)
