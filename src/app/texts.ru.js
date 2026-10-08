// Words the player sees in every room: consent and shared buttons.
// The player is always addressed formally ("вы").
export const APP_T = {
  // one screen after another: a screen holds one thought, the last one the choice
  consent: {
    pages: [
      [
        'Это психологический эксперимент. Часть деталей мы раскроем только в конце.',
        'Прекратить участие можно в любой момент: нажмите знак EXXXIT на доске, снимите шлем или закройте страницу.'
      ],
      [
        'Если вы начнёте с записью, анонимный итог — ваши ответы и действия, без имени и адреса — попадёт в общую статистику. Без записи ничего не сохраняется.',
        'Подробно о данных: youaretheobject.com/privacy'
      ]
    ],
    withRecording: 'Начать с записью',
    withoutRecording: 'Начать без записи',
    // recording is for adults: asked before the choice
    age: { ask: 'Вам уже исполнилось 18 лет?', yes: 'Да', no: 'Нет' },
    minor: 'Тогда начнём без записи: вы пройдёте всё так же, только ничего не сохранится.',
    start: 'Начать'
  },
  // Playtest mode only (?playtest=1).
  playtest: {
    consent: 'Это проверка игры. В конце будет пять коротких вопросов. Если вы начнёте с записью, ответы и время прохождения уйдут разработчикам без имени.',
    intro: 'Спасибо! Пять коротких вопросов для разработчиков.',
    next: { ask: 'Насколько хочется пройти следующую комнату?', labels: ['Совсем не хочется', '', 'Очень хочется'] },
    boring: { ask: 'Когда было скучнее всего?', answers: ['Инструкция', 'Сами попытки', 'Вопросы', 'Разбор', 'Нигде'] },
    guessed: { ask: 'Вы догадались, в чём фокус, до разбора?', answers: ['Да', 'Частично', 'Нет'] },
    trouble: { ask: 'Было ли что-то неудобно?', answers: ['Нет', 'Трудно читать', 'Кнопки', 'Голос', 'Укачало'] },
    psych: { ask: 'Знакомы ли вы с психологией?', answers: ['Нет', 'Немного', 'Учился(ась)'] },
    thanks: 'Спасибо, это очень поможет.'
  },
  // A player who left before the end (src/app/left-early.js).
  leftEarly: {
    now: 'Вы вышли до конца опыта.',
    before: 'В прошлый раз вы вышли до конца опыта.',
    back: 'Вернуться в опыт',
    learn: 'Узнать, что это было',
    again: 'Пройти заново'
  },
  understood: 'Понятно',
  repeat: 'Повторить',
  next: 'Дальше',
  done: 'Готово',
  again: 'Пройти ещё раз',
  share: 'Не рассказывайте друзьям, в чём фокус. Пусть пройдут сами.',
  link: 'youaretheobject.com'
};

export const plural = (n, one, few, many) => {
  const m = n % 100, d = n % 10;
  return (m > 10 && m < 20) ? many : d === 1 ? one : (d > 1 && d < 5) ? few : many;
};
