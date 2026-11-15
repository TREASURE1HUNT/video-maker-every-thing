CREATE TABLE speech_backends (id text PRIMARY KEY NOT NULL,engine text NOT NULL,name text NOT NULL,endpoint text NOT NULL DEFAULT '',secret text NOT NULL DEFAULT '',enabled integer NOT NULL DEFAULT 0,min_plan text NOT NULL DEFAULT 'plus',cost integer NOT NULL DEFAULT 5,voice text NOT NULL DEFAULT 'default',updated_at text NOT NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO models VALUES('router-auto','openrouter','OpenRouter Auto · свободные модели',1,1,'Серверное подключение OpenRouter','lite');
--> statement-breakpoint
INSERT OR IGNORE INTO models VALUES('router-gemma','openrouter','Gemma 4 · монтажный план',1,2,'Серверное подключение OpenRouter','plus');
--> statement-breakpoint
INSERT OR IGNORE INTO models VALUES('router-gpt-mini','openrouter','GPT-4.1 mini',0,3,'Платная модель: нужен баланс OpenRouter и включение администратором','plus');
--> statement-breakpoint
INSERT OR IGNORE INTO models VALUES('router-gemini','openrouter','Gemini 2.5 Flash',0,3,'Платная модель: нужен баланс OpenRouter и включение администратором','plus');
--> statement-breakpoint
INSERT OR IGNORE INTO models VALUES('router-gpt','openrouter','GPT-4.1',0,8,'Платная модель: нужен баланс OpenRouter и включение администратором','pro');
--> statement-breakpoint
INSERT OR IGNORE INTO models VALUES('router-claude','openrouter','Claude Sonnet 4.5',0,12,'Платная модель: нужен баланс OpenRouter и включение администратором','pro');
--> statement-breakpoint
INSERT OR IGNORE INTO video_skills VALUES('voice-coqui','Озвучка · Coqui TTS','Сценарий и субтитры для Coqui TTS','Подготовь точный сценарий озвучки и разбей его на короткие реплики. Движок: Coqui TTS. Учитывай язык, паузы, длину сцен и слышимую речь. Не меняй факты. Для синтеза нужен подключённый сервер; не утверждай, что аудио создано, если endpoint не вернул файл. Субтитры должны соответствовать готовой речи и иметь проверенные таймкоды. В интерфейсе используй «Озвучить текст»; возвращай обычный проверяемый монтажный план VMET, а не команды shell.',1,'lite','https://github.com/coqui-ai/TTS','bf131a6a3e71ab60790e11c7941580f20dc238ed','2026-11-15T17:17:05.824Z');
--> statement-breakpoint
INSERT OR IGNORE INTO video_skills VALUES('voice-f5','Озвучка · F5-TTS','Сценарий и субтитры для F5-TTS','Подготовь точный сценарий озвучки и разбей его на короткие реплики. Движок: F5-TTS. Учитывай язык, паузы, длину сцен и слышимую речь. Не меняй факты. Для синтеза нужен подключённый сервер; не утверждай, что аудио создано, если endpoint не вернул файл. Субтитры должны соответствовать готовой речи и иметь проверенные таймкоды. В интерфейсе используй «Озвучить текст»; возвращай обычный проверяемый монтажный план VMET, а не команды shell.',1,'plus','https://github.com/SWivid/F5-TTS','bf131a6a3e71ab60790e11c7941580f20dc238ed','2026-11-15T17:17:05.825Z');
--> statement-breakpoint
INSERT OR IGNORE INTO video_skills VALUES('voice-chatterbox','Озвучка · Chatterbox Multilingual','Сценарий и субтитры для Chatterbox Multilingual','Подготовь точный сценарий озвучки и разбей его на короткие реплики. Движок: Chatterbox Multilingual. Учитывай язык, паузы, длину сцен и слышимую речь. Не меняй факты. Для синтеза нужен подключённый сервер; не утверждай, что аудио создано, если endpoint не вернул файл. Субтитры должны соответствовать готовой речи и иметь проверенные таймкоды. В интерфейсе используй «Озвучить текст»; возвращай обычный проверяемый монтажный план VMET, а не команды shell.',1,'plus','https://github.com/resemble-ai/chatterbox','bf131a6a3e71ab60790e11c7941580f20dc238ed','2026-11-15T17:17:05.825Z');
--> statement-breakpoint
INSERT OR IGNORE INTO video_skills VALUES('voice-fish','Озвучка · Fish Speech','Сценарий и субтитры для Fish Speech','Подготовь точный сценарий озвучки и разбей его на короткие реплики. Движок: Fish Speech. Учитывай язык, паузы, длину сцен и слышимую речь. Не меняй факты. Для синтеза нужен подключённый сервер; не утверждай, что аудио создано, если endpoint не вернул файл. Субтитры должны соответствовать готовой речи и иметь проверенные таймкоды. В интерфейсе используй «Озвучить текст»; возвращай обычный проверяемый монтажный план VMET, а не команды shell.',1,'pro','https://github.com/fishaudio/fish-speech','bf131a6a3e71ab60790e11c7941580f20dc238ed','2026-11-15T17:17:05.825Z');
--> statement-breakpoint
INSERT OR IGNORE INTO ledger (id,user_id,amount,reason,actor,created_at)
SELECT 'neural-onboarding:'||u.id,u.id,CASE s.plan WHEN 'lite' THEN 100 WHEN 'plus' THEN 350 WHEN 'pro' THEN 1000 END,'Кредиты действующей подписки при подключении ИИ','system',strftime('%Y-%m-%dT%H:%M:%fZ','now')
FROM users u JOIN subscriptions s ON s.user_id=u.id
WHERE u.status='active' AND u.credits=0 AND s.plan IN ('lite','plus','pro') AND s.starts_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now') AND s.ends_at>strftime('%Y-%m-%dT%H:%M:%fZ','now');
--> statement-breakpoint
UPDATE users SET credits=credits+(SELECT amount FROM ledger WHERE id='neural-onboarding:'||users.id) WHERE credits=0 AND EXISTS(SELECT 1 FROM ledger WHERE id='neural-onboarding:'||users.id) AND NOT EXISTS(SELECT 1 FROM audit WHERE id='neural-credit-issued:'||users.id);

--> statement-breakpoint
INSERT OR IGNORE INTO audit (id,actor,action,entity,details,created_at) SELECT 'neural-credit-issued:'||user_id,'system','credits.subscription_onboarding',user_id,'{}',strftime('%Y-%m-%dT%H:%M:%fZ','now') FROM ledger WHERE id='neural-onboarding:'||user_id;

