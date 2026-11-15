// Neural v2 previews with original media, editable titles/transitions and safe-zone timed captions.
export const TEMPLATES=[
  {
    "id": "auto",
    "name": "Автомобиль: характер в движении",
    "aspect": "16:9",
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
    "duration": 14.633333333333333,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/auto-neural-v2.mp4",
    "poster": "assets/produced/auto-card-v2.jpg",
    "captions": "assets/produced/auto-v2.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Автомобильный обзор: три плана, анимированные заголовки, синхронные субтитры и переходы.",
    "audioDescription": "Нейросетевая озвучка FishAudio S2.1 Pro через OpenRouter; авторская инструментальная подложка.",
    "segments": [
      {
        "start": 0,
        "end": 5.933333333333334,
        "title": "Первое впечатление",
        "transition": "cut"
      },
      {
        "start": 5.933333333333334,
        "end": 9.966666666666667,
        "title": "Ближе к деталям",
        "transition": "fade"
      },
      {
        "start": 9.966666666666667,
        "end": 14.633333333333333,
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
        "end": 5.933333333333334,
        "speed": 1,
        "transition": "cut",
        "title": "Первое впечатление",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/50.mp4",
        "start": 0,
        "end": 4.033333333333333,
        "speed": 1,
        "transition": "fade",
        "title": "Ближе к деталям",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/64.mp4",
        "start": 0,
        "end": 4.666666666666666,
        "speed": 1,
        "transition": "slide",
        "title": "В твоём ритме",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/auto-audio-v2.m4a",
    "originalAudio": false,
    "cover": "assets/produced/auto-cover-v2.png",
    "alternateAspects": [
      "9:16",
      "1:1"
    ],
    "captionTracks": {
      "ru": {
        "srt": "assets/produced/auto-v2.srt",
        "vtt": "assets/produced/auto-v2.vtt"
      }
    },
    "cues": [
      {
        "start": 0.55,
        "end": 3.57,
        "text": "Линии, свет, движение. Всё"
      },
      {
        "start": 3.57,
        "end": 5.58,
        "text": "начинается с первого впечатления."
      },
      {
        "start": 6.483,
        "end": 8.283,
        "text": "Остановись на деталях, именно"
      },
      {
        "start": 8.283,
        "end": 9.613,
        "text": "они создают характер."
      },
      {
        "start": 10.517,
        "end": 12.397,
        "text": "Собери свою историю. И"
      },
      {
        "start": 12.397,
        "end": 13.987,
        "text": "выбери следующий маршрут."
      }
    ],
    "captionStyle": {
      "fontSize": 46,
      "background": "rgba(8,8,8,.91)",
      "safeBottom": 180,
      "safeBottomRatio": 0.25,
      "nativeControlsReserve": true
    },
    "voiceModel": "fish-audio/s2.1-pro-free:free",
    "captionSource": "Actual neural narration word timing aligned with Whisper and checked against supplied exact scripts."
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
    "duration": 14.966666666666667,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/product-neural-v2.mp4",
    "poster": "assets/produced/product-card-v2.jpg",
    "captions": "assets/produced/product-v2.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Кофейня: крупные планы, спокойный ритм, озвучка и мягкие переходы.",
    "audioDescription": "Нейросетевая озвучка FishAudio S2.1 Pro через OpenRouter; авторская инструментальная подложка.",
    "segments": [
      {
        "start": 0,
        "end": 4.333333333333333,
        "title": "Пауза для себя",
        "transition": "cut"
      },
      {
        "start": 4.333333333333333,
        "end": 9.8,
        "title": "Всё решают детали",
        "transition": "fade"
      },
      {
        "start": 9.8,
        "end": 14.966666666666667,
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
        "end": 4.333333333333333,
        "speed": 1,
        "transition": "cut",
        "title": "Пауза для себя",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/coffee.mp4",
        "start": 7,
        "end": 12.466666666666669,
        "speed": 1,
        "transition": "fade",
        "title": "Всё решают детали",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/coffee.mp4",
        "start": 14,
        "end": 19.166666666666664,
        "speed": 1,
        "transition": "slide",
        "title": "Твоё доброе утро",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/product-audio-v2.m4a",
    "originalAudio": false,
    "cover": "assets/produced/product-cover-v2.png",
    "alternateAspects": [
      "9:16",
      "1:1"
    ],
    "captionTracks": {
      "ru": {
        "srt": "assets/produced/product-v2.srt",
        "vtt": "assets/produced/product-v2.vtt"
      }
    },
    "cues": [
      {
        "start": 0.55,
        "end": 2.57,
        "text": "Замедлись на минуту. Твоё"
      },
      {
        "start": 2.57,
        "end": 3.9,
        "text": "утро начинается здесь."
      },
      {
        "start": 4.883,
        "end": 7.963,
        "text": "Тёплая чашка. Свежий кофе."
      },
      {
        "start": 7.963,
        "end": 9.573,
        "text": "Несколько точных движений."
      },
      {
        "start": 10.35,
        "end": 12.59,
        "text": "Оставь время для себя."
      },
      {
        "start": 12.59,
        "end": 13.65,
        "text": "И начни день со"
      },
      {
        "start": 13.65,
        "end": 14.24,
        "text": "вкуса."
      }
    ],
    "captionStyle": {
      "fontSize": 46,
      "background": "rgba(8,8,8,.91)",
      "safeBottom": 180,
      "safeBottomRatio": 0.25,
      "nativeControlsReserve": true
    },
    "voiceModel": "fish-audio/s2.1-pro-free:free",
    "captionSource": "Actual neural narration word timing aligned with Whisper and checked against supplied exact scripts."
  },
  {
    "id": "story",
    "name": "Автомобиль: история в трёх кадрах",
    "aspect": "16:9",
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
    "duration": 14.833333333333334,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/story-neural-v2.mp4",
    "poster": "assets/produced/story-card-v2.jpg",
    "captions": "assets/produced/story-v2.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Детали и ракурсы автомобиля: крупные титры, нейросетевая озвучка и переходы. Формат можно изменить в редакторе.",
    "audioDescription": "Нейросетевая озвучка FishAudio S2.1 Pro через OpenRouter; авторская инструментальная подложка.",
    "segments": [
      {
        "start": 0,
        "end": 5,
        "title": "Форма",
        "transition": "cut"
      },
      {
        "start": 5,
        "end": 9.333333333333332,
        "title": "Характер",
        "transition": "fade"
      },
      {
        "start": 9.333333333333332,
        "end": 14.833333333333334,
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
        "end": 5,
        "speed": 1,
        "transition": "cut",
        "title": "Форма",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/74.mp4",
        "start": 0,
        "end": 4.333333333333332,
        "speed": 1,
        "transition": "fade",
        "title": "Характер",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/64.mp4",
        "start": 0,
        "end": 5.500000000000002,
        "speed": 1,
        "transition": "slide",
        "title": "Движение",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/story-audio-v2.m4a",
    "originalAudio": false,
    "cover": "assets/produced/story-cover-v2.png",
    "alternateAspects": [
      "9:16",
      "1:1"
    ],
    "captionTracks": {
      "ru": {
        "srt": "assets/produced/story-v2.srt",
        "vtt": "assets/produced/story-v2.vtt"
      }
    },
    "cues": [
      {
        "start": 0.55,
        "end": 2.53,
        "text": "Сначала ты замечаешь форму,"
      },
      {
        "start": 2.53,
        "end": 4.78,
        "text": "свет подчёркивает каждую линию."
      },
      {
        "start": 5.55,
        "end": 7.73,
        "text": "Потом открывается характер в"
      },
      {
        "start": 7.73,
        "end": 9.12,
        "text": "ракурсе и в деталях."
      },
      {
        "start": 9.883,
        "end": 12.663,
        "text": "И наконец, движение. Продолжение"
      },
      {
        "start": 12.663,
        "end": 13.703,
        "text": "этой истории — за"
      },
      {
        "start": 13.703,
        "end": 14.173,
        "text": "рулём."
      }
    ],
    "captionStyle": {
      "fontSize": 46,
      "background": "rgba(8,8,8,.91)",
      "safeBottom": 180,
      "safeBottomRatio": 0.25,
      "nativeControlsReserve": true
    },
    "voiceModel": "fish-audio/s2.1-pro-free:free",
    "captionSource": "Actual neural narration word timing aligned with Whisper and checked against supplied exact scripts."
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
    "duration": 14.466666666666667,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/travel-neural-v2.mp4",
    "poster": "assets/produced/travel-card-v2.jpg",
    "captions": "assets/produced/travel-v2.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Горный маршрут: реальные аэрокадры, плавный монтаж, музыка и короткий рассказ.",
    "audioDescription": "Нейросетевая озвучка FishAudio S2.1 Pro через OpenRouter; авторская инструментальная подложка.",
    "segments": [
      {
        "start": 0,
        "end": 5.1,
        "title": "Смени привычный ракурс",
        "transition": "cut"
      },
      {
        "start": 5.1,
        "end": 10.033333333333333,
        "title": "Оставь место дороге",
        "transition": "fade"
      },
      {
        "start": 10.033333333333333,
        "end": 14.466666666666667,
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
        "end": 5.1,
        "speed": 1,
        "transition": "cut",
        "title": "Смени привычный ракурс",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/mountains.mp4",
        "start": 3,
        "end": 7.933333333333334,
        "speed": 1,
        "transition": "fade",
        "title": "Оставь место дороге",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "production/mountains.mp4",
        "start": 6,
        "end": 10.433333333333334,
        "speed": 1,
        "transition": "slide",
        "title": "Маршрут начинается с тебя",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/travel-audio-v2.m4a",
    "originalAudio": false,
    "cover": "assets/produced/travel-cover-v2.png",
    "alternateAspects": [
      "9:16",
      "1:1"
    ],
    "captionTracks": {
      "ru": {
        "srt": "assets/produced/travel-v2.srt",
        "vtt": "assets/produced/travel-v2.vtt"
      }
    },
    "cues": [
      {
        "start": 0.55,
        "end": 3.03,
        "text": "Иногда достаточно сменить ракурс."
      },
      {
        "start": 3.03,
        "end": 4.8,
        "text": "И привычное остаётся позади."
      },
      {
        "start": 5.65,
        "end": 7.55,
        "text": "Не торопись к финалу."
      },
      {
        "start": 7.55,
        "end": 9.11,
        "text": "Самое интересное — по"
      },
      {
        "start": 9.11,
        "end": 9.82,
        "text": "дороге."
      },
      {
        "start": 10.583,
        "end": 12.263,
        "text": "Выбери свой маршрут. И"
      },
      {
        "start": 12.263,
        "end": 13.833,
        "text": "посмотри, что за поворотом."
      }
    ],
    "captionStyle": {
      "fontSize": 46,
      "background": "rgba(8,8,8,.91)",
      "safeBottom": 180,
      "safeBottomRatio": 0.25,
      "nativeControlsReserve": true
    },
    "voiceModel": "fish-audio/s2.1-pro-free:free",
    "captionSource": "Actual neural narration word timing aligned with Whisper and checked against supplied exact scripts."
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
    "duration": 15.866666666666667,
    "fps": 30,
    "width": 1280,
    "height": 720,
    "preview": "assets/produced/promo-neural-v2.mp4",
    "poster": "assets/produced/promo-card-v2.jpg",
    "captions": "assets/produced/promo-v2.srt",
    "source": "remotion-edited-licensed-footage",
    "description": "Короткий автомобильный анонс с динамичным монтажом, титрами и призывом к действию.",
    "audioDescription": "Нейросетевая озвучка FishAudio S2.1 Pro через OpenRouter; авторская инструментальная подложка.",
    "segments": [
      {
        "start": 0,
        "end": 5.233333333333333,
        "title": "Выйди за привычное",
        "transition": "cut"
      },
      {
        "start": 5.233333333333333,
        "end": 10.166666666666668,
        "title": "Почувствуй движение",
        "transition": "fade"
      },
      {
        "start": 10.166666666666668,
        "end": 15.866666666666667,
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
        "end": 5.233333333333333,
        "speed": 1,
        "transition": "cut",
        "title": "Выйди за привычное",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/64.mp4",
        "start": 0,
        "end": 4.9333333333333345,
        "speed": 1,
        "transition": "fade",
        "title": "Почувствуй движение",
        "textStyle": "clean",
        "textPosition": "top"
      },
      {
        "sourceId": "hero/50.mp4",
        "start": 0,
        "end": 5.699999999999999,
        "speed": 1,
        "transition": "slide",
        "title": "Продолжи историю",
        "textStyle": "clean",
        "textPosition": "top"
      }
    ],
    "audioFile": "assets/produced/promo-audio-v2.m4a",
    "originalAudio": false,
    "cover": "assets/produced/promo-cover-v2.png",
    "alternateAspects": [
      "9:16",
      "1:1"
    ],
    "captionTracks": {
      "ru": {
        "srt": "assets/produced/promo-v2.srt",
        "vtt": "assets/produced/promo-v2.vtt"
      }
    },
    "cues": [
      {
        "start": 0.55,
        "end": 2.43,
        "text": "Каждая поездка начинается с"
      },
      {
        "start": 2.43,
        "end": 4.92,
        "text": "решения. Куда отправишься ты?"
      },
      {
        "start": 5.783,
        "end": 7.903,
        "text": "Почувствуй ритм. Посмотри на"
      },
      {
        "start": 7.903,
        "end": 9.873,
        "text": "привычное с другого ракурса."
      },
      {
        "start": 10.717,
        "end": 12.777,
        "text": "Твой следующий маршрут начинается"
      },
      {
        "start": 12.777,
        "end": 15.227,
        "text": "сейчас. Продолжи эту историю."
      }
    ],
    "captionStyle": {
      "fontSize": 46,
      "background": "rgba(8,8,8,.91)",
      "safeBottom": 180,
      "safeBottomRatio": 0.25,
      "nativeControlsReserve": true
    },
    "voiceModel": "fish-audio/s2.1-pro-free:free",
    "captionSource": "Actual neural narration word timing aligned with Whisper and checked against supplied exact scripts."
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
    "preview": "assets/produced/interview-v2.mp4",
    "poster": "assets/produced/interview-cover.png",
    "source": "nasa-factual-interview-excerpt",
    "description": "Настоящее интервью с крупными русскими субтитрами. Оригинальная английская речь сохранена.",
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
    "cover": "assets/produced/interview-cover.png",
    "cues": [
      {
        "start": 0,
        "end": 1.14,
        "text": "…на низкую околоземную орбиту."
      },
      {
        "start": 1.38,
        "end": 3.98,
        "text": "Но делают они это немного по-разному."
      },
      {
        "start": 4.24,
        "end": 7.1,
        "text": "Шаттл также может выводить на орбиту большой груз."
      },
      {
        "start": 7.3,
        "end": 8.7,
        "text": "Поэтому нужно огромное количество топлива,"
      },
      {
        "start": 8.7,
        "end": 11.12,
        "text": "чтобы вывести шаттл на низкую орбиту."
      },
      {
        "start": 11.76,
        "end": 13.54,
        "text": "А твердотопливные ускорители…"
      },
      {
        "start": 13.56,
        "end": 15.88,
        "text": "когда включаются и уносят вас со стартовой площадки,"
      },
      {
        "start": 15.9,
        "end": 18,
        "text": "вас трясёт, качает и бросает из стороны в сторону."
      }
    ],
    "captionTracks": {
      "ru": {
        "srt": "assets/produced/interview-ru-v2.srt",
        "vtt": "assets/produced/interview-ru-v2.vtt"
      },
      "en": {
        "srt": "assets/produced/interview-en-v2.srt",
        "vtt": "assets/produced/interview-en-v2.vtt"
      }
    },
    "captions": "assets/produced/interview-ru-v2.srt",
    "captionSource": "English transcript cross-checked from original NASA audio; Russian translation by editor. Not NASA-issued subtitles.",
    "captionStyle": {
      "fontSize": 44,
      "englishFontSize": 27,
      "background": "rgba(8,10,12,.9)",
      "safeBottom": 180,
      "safeBottomRatio": 0.25,
      "nativeControlsReserve": true,
      "videoPanY": -80
    }
  }
];
