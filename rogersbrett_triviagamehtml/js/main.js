// Trivia API
// https://opentdb.com/api.php?amount=10

window.addEventListener('load', e => {
  // animate the entrance of the main form
  anime({
    targets: '#main',
    scale: [
      { value: 0.2, duration: 100 },
      { value: 1, duration: 800 }
    ],
    duration: 2000,
   })


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
