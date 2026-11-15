// Finished previews plus original media and editable scene metadata.
export const TEMPLATES=[
  {
    "id": "auto",
    "name": "Автомобиль: характер в движении",
    "aspect": "9:16",
    "category": "Авто",
    "tag": "Автообзор",
    "visual": "auto",
    "preset": "dynamic",
    "scenes": [
      [
        "Первое впечатление",
        "Линии, свет, движение. Всё начинается с первого впечатления."
      ],
      [
        "Ближе к деталям",
        "Остановись на деталях. Именно они создают характер."
      ],
      [
        "В твоём ритме",
        "Собери свою историю. И выбери следующий маршрут."
      ]
    ],
    "duration": 18.366666666666667,
    "fps": 30,
    "width": 720,
    "height": 1280,
    "preview": "assets/produced/auto.mp4",
    "poster": "assets/produced/auto-card.jpg",
    "captions": "assets/produced/auto.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Автомобильный обзор: три плана, анимированные заголовки, синхронные субтитры и переходы.",
    "audioDescription": "Русская синтетическая озвучка Microsoft Irina, авторская синтезированная музыка",
    "segments": [
      {
        "start": 0,
        "end": 6.9,
        "title": "Первое впечатление",
        "transition": "cut"
      },
      {
        "start": 6.9,
        "end": 12.466666666666667,
        "title": "Ближе к деталям",
        "transition": "fade"
      },
      {
        "start": 12.466666666666667,
        "end": 18.366666666666667,
        "title": "В твоём ритме",
        "transition": "slide"
      }
    ],
    "brief": "Используй структуру «Автомобиль: характер в движении»: три сцены, заголовки, мягкие переходы и обложка. Замени кадры моими материалами. Не придумывай характеристики или факты.",
    "sourceMedia": [
      {
        "id": "hero/74.mp4",
        "url": "assets/source/car-front.mp4",
        "name": "car-front.mp4",
        "type": "video",
        "duration": 10.208333,
        "width": 1280,
        "height": 720
      },
      {
        "id": "hero/50.mp4",
        "url": "assets/source/car-side.mp4",
        "name": "car-side.mp4",
        "type": "video",
        "duration": 8.458333,
        "width": 1280,
        "height": 720
      },
      {
        "id": "hero/64.mp4",
        "url": "assets/source/car-dashboard.mp4",
        "name": "car-dashboard.mp4",
        "type": "video",
        "duration": 17.041667,
        "width": 1280,
        "height": 720
      }
    ],
    "editableSegments": [
      {
        "sourceId": "hero/74.mp4",
        "start": 0,
        "end": 6.9,
        "speed": 1,
        "transition": "cut",
        "title": "Первое впечатление",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/50.mp4",
        "start": 0,
        "end": 5.566666666666666,
        "speed": 1,
        "transition": "fade",
        "title": "Ближе к деталям",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/64.mp4",
        "start": 0,
        "end": 5.9,
        "speed": 1,
        "transition": "slide",
        "title": "В твоём ритме",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/auto-audio.m4a",
    "originalAudio": false,
    "cover": "assets/produced/auto-cover.png"
  },
  {
    "id": "product",
    "name": "Кофейня: утро начинается здесь",
    "aspect": "16:9",
    "category": "Продукт",
    "tag": "Кофейня",
    "visual": "product",
    "preset": "product",
    "scenes": [
      [
        "Пауза для себя",
        "Замедлись на минуту. Твоё утро начинается здесь."
      ],
      [
        "Всё решают детали",
        "Тёплая чашка. Свежий кофе. Несколько точных движений."
      ],
      [
        "Твоё доброе утро",
        "Оставь время для себя. И начни день со вкуса."
      ]
    ],
    "duration": 17.7,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/product.mp4",
    "poster": "assets/produced/product-card.jpg",
    "captions": "assets/produced/product.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Кофейня: крупные планы, спокойный ритм, озвучка и мягкие переходы.",
    "audioDescription": "Русская синтетическая озвучка Microsoft Irina, авторская синтезированная музыка",
    "segments": [
      {
        "start": 0,
        "end": 5.5,
        "title": "Пауза для себя",
        "transition": "cut"
      },
      {
        "start": 5.5,
        "end": 12.233333333333334,
        "title": "Всё решают детали",
        "transition": "fade"
      },
      {
        "start": 12.233333333333334,
        "end": 17.7,
        "title": "Твоё доброе утро",
        "transition": "slide"
      }
    ],
    "brief": "Используй структуру «Кофейня: утро начинается здесь»: три сцены, заголовки, мягкие переходы и обложка. Замени кадры моими материалами. Не придумывай характеристики или факты.",
    "sourceMedia": [
      {
        "id": "production/coffee.mp4",
        "url": "assets/source/coffee.mp4",
        "name": "coffee.mp4",
        "type": "video",
        "duration": 34,
        "width": 1280,
        "height": 720
      }
    ],
    "editableSegments": [
      {
        "sourceId": "production/coffee.mp4",
        "start": 0,
        "end": 5.5,
        "speed": 1,
        "transition": "cut",
        "title": "Пауза для себя",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/coffee.mp4",
        "start": 7,
        "end": 13.733333333333334,
        "speed": 1,
        "transition": "fade",
        "title": "Всё решают детали",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/coffee.mp4",
        "start": 14,
        "end": 19.466666666666665,
        "speed": 1,
        "transition": "slide",
        "title": "Твоё доброе утро",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/product-audio.m4a",
    "originalAudio": false,
    "cover": "assets/produced/product-cover.png"
  },
  {
    "id": "story",
    "name": "Автомобиль: история в трёх кадрах",
    "aspect": "9:16",
    "category": "Shorts / Reels",
    "tag": "Вертикальный ролик",
    "visual": "story",
    "preset": "cinematic",
    "scenes": [
      [
        "Форма",
        "Сначала ты замечаешь форму. Свет подчёркивает каждую линию."
      ],
      [
        "Характер",
        "Потом открывается характер. В ракурсе и в деталях."
      ],
      [
        "Движение",
        "И наконец, движение. Продолжение этой истории — за рулём."
      ]
    ],
    "duration": 18.8,
    "fps": 30,
    "width": 720,
    "height": 1280,
    "preview": "assets/produced/story.mp4",
    "poster": "assets/produced/story-card.jpg",
    "captions": "assets/produced/story.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Вертикальная история о деталях автомобиля: кадры, титры и голос.",
    "audioDescription": "Русская синтетическая озвучка Microsoft Irina, авторская синтезированная музыка",
    "segments": [
      {
        "start": 0,
        "end": 6.333333333333333,
        "title": "Форма",
        "transition": "cut"
      },
      {
        "start": 6.333333333333333,
        "end": 11.966666666666667,
        "title": "Характер",
        "transition": "fade"
      },
      {
        "start": 11.966666666666667,
        "end": 18.8,
        "title": "Движение",
        "transition": "slide"
      }
    ],
    "brief": "Используй структуру «Автомобиль: история в трёх кадрах»: три сцены, заголовки, мягкие переходы и обложка. Замени кадры моими материалами. Не придумывай характеристики или факты.",
    "sourceMedia": [
      {
        "id": "hero/50.mp4",
        "url": "assets/source/car-side.mp4",
        "name": "car-side.mp4",
        "type": "video",
        "duration": 8.458333,
        "width": 1280,
        "height": 720
      },
      {
        "id": "hero/74.mp4",
        "url": "assets/source/car-front.mp4",
        "name": "car-front.mp4",
        "type": "video",
        "duration": 10.208333,
        "width": 1280,
        "height": 720
      },
      {
        "id": "hero/64.mp4",
        "url": "assets/source/car-dashboard.mp4",
        "name": "car-dashboard.mp4",
        "type": "video",
        "duration": 17.041667,
        "width": 1280,
        "height": 720
      }
    ],
    "editableSegments": [
      {
        "sourceId": "hero/50.mp4",
        "start": 0,
        "end": 6.333333333333333,
        "speed": 1,
        "transition": "cut",
        "title": "Форма",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/74.mp4",
        "start": 0,
        "end": 5.633333333333334,
        "speed": 1,
        "transition": "fade",
        "title": "Характер",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/64.mp4",
        "start": 0,
        "end": 6.833333333333334,
        "speed": 1,
        "transition": "slide",
        "title": "Движение",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/story-audio.m4a",
    "originalAudio": false,
    "cover": "assets/produced/story-cover.png"
  },
  {
    "id": "travel",
    "name": "Путешествие: дальше привычного",
    "aspect": "16:9",
    "category": "Путешествия",
    "tag": "Путешествие",
    "visual": "travel",
    "preset": "cinematic",
    "scenes": [
      [
        "Смени привычный ракурс",
        "Иногда достаточно сменить ракурс. И привычное остаётся позади."
      ],
      [
        "Оставь место дороге",
        "Не торопись к финалу. Самое интересное — по дороге."
      ],
      [
        "Маршрут начинается с тебя",
        "Выбери свой маршрут. И посмотри, что за поворотом."
      ]
    ],
    "duration": 18.133333333333333,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/travel.mp4",
    "poster": "assets/produced/travel-card.jpg",
    "captions": "assets/produced/travel.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Горный маршрут: реальные аэрокадры, плавный монтаж, музыка и короткий рассказ.",
    "audioDescription": "Русская синтетическая озвучка Microsoft Irina, авторская синтезированная музыка",
    "segments": [
      {
        "start": 0,
        "end": 6.366666666666666,
        "title": "Смени привычный ракурс",
        "transition": "cut"
      },
      {
        "start": 6.366666666666666,
        "end": 12.033333333333333,
        "title": "Оставь место дороге",
        "transition": "fade"
      },
      {
        "start": 12.033333333333333,
        "end": 18.133333333333333,
        "title": "Маршрут начинается с тебя",
        "transition": "slide"
      }
    ],
    "brief": "Используй структуру «Путешествие: дальше привычного»: три сцены, заголовки, мягкие переходы и обложка. Замени кадры моими материалами. Не придумывай характеристики или факты.",
    "sourceMedia": [
      {
        "id": "production/mountains.mp4",
        "url": "assets/source/mountains.mp4",
        "name": "mountains.mp4",
        "type": "video",
        "duration": 15.056708,
        "width": 1280,
        "height": 720
      }
    ],
    "editableSegments": [
      {
        "sourceId": "production/mountains.mp4",
        "start": 0,
        "end": 6.366666666666666,
        "speed": 1,
        "transition": "cut",
        "title": "Смени привычный ракурс",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/mountains.mp4",
        "start": 3,
        "end": 8.666666666666668,
        "speed": 1,
        "transition": "fade",
        "title": "Оставь место дороге",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/mountains.mp4",
        "start": 6,
        "end": 12.1,
        "speed": 1,
        "transition": "slide",
        "title": "Маршрут начинается с тебя",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/travel-audio.m4a",
    "originalAudio": false,
    "cover": "assets/produced/travel-cover.png"
  },
  {
    "id": "promo",
    "name": "Автомобиль: следующий маршрут",
    "aspect": "16:9",
    "category": "Продажи",
    "tag": "AD / Анонс",
    "visual": "promo",
    "preset": "dynamic",
    "scenes": [
      [
        "Выйди за привычное",
        "Каждая поездка начинается с решения. Куда отправишься ты?"
      ],
      [
        "Почувствуй движение",
        "Почувствуй ритм. Посмотри на привычное с другого ракурса."
      ],
      [
        "Продолжи историю",
        "Твой следующий маршрут начинается сейчас. Продолжи эту историю."
      ]
    ],
    "duration": 19.433333333333334,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/promo.mp4",
    "poster": "assets/produced/promo-card.jpg",
    "captions": "assets/produced/promo.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Короткий автомобильный анонс с динамичным монтажом, титрами и призывом к действию.",
    "audioDescription": "Русская синтетическая озвучка Microsoft Irina, авторская синтезированная музыка",
    "segments": [
      {
        "start": 0,
        "end": 6.3,
        "title": "Выйди за привычное",
        "transition": "cut"
      },
      {
        "start": 6.3,
        "end": 12.3,
        "title": "Почувствуй движение",
        "transition": "fade"
      },
      {
        "start": 12.3,
        "end": 19.433333333333334,
        "title": "Продолжи историю",
        "transition": "slide"
      }
    ],
    "brief": "Используй структуру «Автомобиль: следующий маршрут»: три сцены, заголовки, мягкие переходы и обложка. Замени кадры моими материалами. Не придумывай характеристики или факты.",
    "sourceMedia": [
      {
        "id": "hero/74.mp4",
        "url": "assets/source/car-front.mp4",
        "name": "car-front.mp4",
        "type": "video",
        "duration": 10.208333,
        "width": 1280,
        "height": 720
      },
      {
        "id": "hero/64.mp4",
        "url": "assets/source/car-dashboard.mp4",
        "name": "car-dashboard.mp4",
        "type": "video",
        "duration": 17.041667,
        "width": 1280,
        "height": 720
      },
      {
        "id": "hero/50.mp4",
        "url": "assets/source/car-side.mp4",
        "name": "car-side.mp4",
        "type": "video",
        "duration": 8.458333,
        "width": 1280,
        "height": 720
      }
    ],
    "editableSegments": [
      {
        "sourceId": "hero/74.mp4",
        "start": 0,
        "end": 6.3,
        "speed": 1,
        "transition": "cut",
        "title": "Выйди за привычное",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/64.mp4",
        "start": 0,
        "end": 6.000000000000001,
        "speed": 1,
        "transition": "fade",
        "title": "Почувствуй движение",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/50.mp4",
        "start": 0,
        "end": 7.133333333333333,
        "speed": 1,
        "transition": "slide",
        "title": "Продолжи историю",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/promo-audio.m4a",
    "originalAudio": false,
    "cover": "assets/produced/promo-cover.png"
  },
  {
    "id": "interview",
    "name": "Интервью: человек в кадре",
    "aspect": "16:9",
    "category": "Обучение",
    "tag": "Живая речь",
    "visual": "interview",
    "preset": "minimal",
    "scenes": [
      [
        "Человек в центре истории",
        "Оригинальная речь"
      ],
      [
        "Меган Макартур",
        "Астронавт NASA"
      ],
      [
        "Интервью с МКС",
        "Учебный фрагмент"
      ]
    ],
    "duration": 18,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/interview.mp4",
    "poster": "assets/produced/interview-cover.png",
    "source": "nasa-factual-interview-excerpt",
    "description": "Фрагмент настоящего интервью с астронавтом: живой человек, оригинальная английская речь, анимированный титр и обложка. Источник: NASA’s Goddard Space Flight Center.",
    "audioDescription": "Оригинальный английский звук интервью; не ИИ-аватар и не рекомендация сервиса NASA.",
    "segments": [
      {
        "start": 0,
        "end": 6,
        "title": "",
        "transition": "cut"
      },
      {
        "start": 6,
        "end": 12,
        "title": "",
        "transition": "cut"
      },
      {
        "start": 12,
        "end": 18,
        "title": "",
        "transition": "cut"
      }
    ],
    "brief": "Смонтируй моё интервью: сохрани смысл и оригинальную речь, добавь имя спикера, короткий заголовок и обложку. Не подменяй речь и не приписывай человеку новые утверждения.",
    "sourceMedia": [
      {
        "id": "interview",
        "url": "assets/source/interview.mp4",
        "name": "Интервью NASA / оригинальная речь",
        "type": "video",
        "duration": 18.001316,
        "width": 1280,
        "height": 720
      }
    ],
    "editableSegments": [
      {
        "sourceId": "interview",
        "start": 0,
        "end": 6,
        "speed": 1,
        "transition": "cut",
        "title": "Человек в центре истории"
      },
      {
        "sourceId": "interview",
        "start": 6,
        "end": 12,
        "speed": 1,
        "transition": "cut",
        "title": "Меган Макартур · астронавт NASA"
      },
      {
        "sourceId": "interview",
        "start": 12,
        "end": 18,
        "speed": 1,
        "transition": "fade",
        "title": "Интервью с МКС · 2021"
      }
    ],
    "originalAudio": true,
    "cover": "assets/produced/interview-cover.png"
  }
];
