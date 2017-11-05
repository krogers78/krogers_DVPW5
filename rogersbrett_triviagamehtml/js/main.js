// Trivia API
// https://opentdb.com/api.php?amount=10

window.addEventListener('load', e => {
  this.game = Game.getInstance()

  function captureResults(data) {
    let htmlString = ''
    if (data[0].type == 'boolean') {
      htmlString = ` <h3>${data[0].question}</h3>
                        <label><input type="radio" name="answer" id="answer1" value="${data[0].answer_array[0]}">${data[0].answer_array[0]}</label>
                        <label><input type="radio" name="answer" id="answer2" value="${data[0].answer_array[1]}">${data[0].answer_array[1]}</label>
                        <button id="finalAnswer">Submit</button>`                            
    } else {
      htmlString = `<h3>${data[0].question}</h3>
                        <label><input type="radio" name="answer" id="answer1" value="${data[0].answer_array[0]}">${data[0].answer_array[0]}</label>
                        <label><input type="radio" name="answer" id="answer2" value="${data[0].answer_array[1]}">${data[0].answer_array[1]}</label>
                        <label><input type="radio" name="answer" id="answer3" value="${data[0].answer_array[2]}">${data[0].answer_array[2]}</label>
                        <label><input type="radio" name="answer" id="answer4" value="${data[0].answer_array[3]}">${data[0].answer_array[3]}</label>
                        <button id="finalAnswer">Submit</button>`
    }
    document.querySelector('body').innerHTML = htmlString
   }
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