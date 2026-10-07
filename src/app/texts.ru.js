// Words the player sees in every room: consent and shared buttons.
// The player is always addressed formally ("вы").
export const APP_T = {
  consent: {
    lines: [
      'Это психологический эксперимент. Часть деталей мы раскроем только в конце.',
      'Выйти можно в любой момент: снимите шлем или закройте страницу.',
      'Если вы начнёте с записью, анонимный итог — ваши ответы и действия, без имени и адреса — попадёт в общую статистику. Без записи ничего не сохраняется.',
      'Участвовать можно с 18 лет.'
    ],
    withRecording: 'Начать с записью',
    withoutRecording: 'Начать без записи'
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
