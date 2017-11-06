// Trivia API
// https://opentdb.com/api.php?amount=10

window.addEventListener('load', e => {
  this.game = Game.getInstance()
})

class Game {
  constructor () {
    this.controller = new Controller()
  }
  static getInstance(_instance) {
    if (!Game._instance) {
      Game._instance = new Game()
    } else {
      throw 'Can\'t create a new game!' 
    }
  }
 }