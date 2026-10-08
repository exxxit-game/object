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
    'Вы узнаете, как поступаете именно вы, и сравните себя с участниками оригинала и с теми, кто был здесь до вас.'
  ],
  // the clipboard hangs on the experimenter's board left of door 1 (src/app/lobby/lobby.js)
  takeSheet: 'Возьмите планшетку: она висит на доске слева от двери.',
  chooseDoor: 'Выберите дверь. Сейчас открыта первая комната.',
  soon: 'СКОРО',
  // the plaque by the stairs the player came up, in the middle of the corridor
  stairs: 'ЛЕСТНИЦА',
  // the studio's poster on the board ends the participation (exit.js), in the lab's words:
  // the player is a participant here, not in a game
  exit: {
    ask: 'Прекратить участие?',
    leave: 'Прекратить',
    stay: 'Продолжить',
    done: 'Участие прекращено. Чтобы вернуться, обновите страницу.'
  },
  // the flyer on the board (board.js): "подходите" is both "you qualify" and "you are coming closer"
  flyer: {
    title: 'ТРЕБУЮТСЯ\nИСПЫТУЕМЫЕ',
    body: 'Опыт не нужен.\nПодготовка не нужна.',
    punch: 'Вы подходите.',
    tab: 'Дверь 1'
  }
};
