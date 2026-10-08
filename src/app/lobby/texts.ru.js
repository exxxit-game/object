// Words the player sees and hears in the lab corridor before the first room.
// The player is always addressed formally ("вы").
export const LOBBY_T = {
  kicker: 'ЛАБОРАТОРИЯ',
  // the game's name stays in English in every language: the player is the object
  title: 'You are the object',
  // the promise first: what the player is offered
  welcome: [
    'Добро пожаловать в лабораторию.',
    'Здесь вы станете участником настоящих психологических опытов — тех, что когда-то проводили учёные.',
    'Вы узнаете, как поступаете именно вы, и сравните себя с участниками оригинала и с другими игроками.'
  ],
  // the clipboard hangs on the experimenter's board left of door 1 (src/app/lobby/lobby.js)
  takeSheet: 'Возьмите планшетку: она висит на доске слева от двери.',
  chooseDoor: 'Выберите дверь. Сейчас открыта первая комната.',
  soon: 'СКОРО',
  // the exit sign is the way to leave the game (exit.js)
  exit: {
    ask: 'Выйти из игры?',
    note: 'Никакие данные никуда не отправятся.',
    leave: 'Выйти',
    stay: 'Остаться',
    done: 'Вы вышли из игры. Чтобы вернуться, обновите страницу.'
  },
  // the flyer on the board (board.js): "подходите" is both "you qualify" and "you are coming closer"
  flyer: {
    title: 'ТРЕБУЮТСЯ\nИСПЫТУЕМЫЕ',
    body: 'Опыт не нужен.\nПодготовка не нужна.',
    punch: 'Вы подходите.',
    tab: 'Дверь 1'
  }
};
