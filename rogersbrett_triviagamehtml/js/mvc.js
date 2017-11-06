
class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()
    // variables for later use
    this.oName = document.querySelector('#pOneName')
    this.tName = document.querySelector('#pTwoName')
    this.category = document.querySelector('#categoryPicker')
    this.difficulty = document.querySelector('#difficultyPicker')
    this.playerData = new PlayerData()
    this.counter = 0

    document.querySelector('#submitBtn').addEventListener('click', this.captureForm.bind(this))
    document.addEventListener('apiGet', this.startIt.bind(this))
    document.addEventListener('done', this.getChoice.bind(this))
  }
  // capture the data from the users input
  captureForm(e) {
    e.preventDefault()
    this.playerData.oName = this.oName.value
    this.playerData.tName = this.tName.value
    this.playerData.category = this.category.value
    this.playerData.difficulty = this.difficulty.value
    
    let evt = new Event('dataGet')
    evt.data = this.playerData
    document.dispatchEvent(evt)
  }
  startIt(e) {
    console.log(e)
    let evt = new Event('startGame')
    evt.query = e.questions[0]
    document.dispatchEvent(evt)
  }
  getChoice(e) {
    e.preventDefault()
    let correct = e.thatQuestion.correct_answer
    let type = e.thatQuestion.type
    console.log('TYPE',type)
    document.querySelector('#confirmBtn').addEventListener('click', e => {
      if (type == 'boolean') {
        if (document.querySelector('#answer1').checked && document.querySelector('#answer1').value == correct) {
          console.log('Correct Answer!')
        } else if (document.querySelector('#answer2').checked && document.querySelector('#answer2').value == correct) {
          console.log('Correct Answer')
        } else {
          console.log('Incorrect Answer!')
        }
      } else {
        if (document.querySelector('#answer1').checked && document.querySelector('#answer1').value == correct) {
          console.log('Correct Answer!')
        } else if (document.querySelector('#answer2').checked && document.querySelector('#answer2').value == correct) {
          console.log('Correct Answer')
        } else if (document.querySelector('#answer3').checked && document.querySelector('#answer3').value == correct) {
          console.log('Correct Answer!')
        } else if (document.querySelector('#answer4').checked && document.querySelector('#answer4').value == correct) {
          console.log('Correct Answer')
        } else {
          console.log('Incorrect Answer!')
        }
      }
    })
  }
}
class Model {
  constructor() {
    document.addEventListener('dataGet', this.makeApiCall.bind(this))
  }
  makeApiCall(e) {
    // make the call easier later
    let setupInfo = e.data
    // base url options
    let url = 'https://opentdb.com/api.php?amount=20'
    let options = { method: 'GET' }
    // check the data and configure the url accordingly
    if (setupInfo.category != 'any') {
      url += `&category=${setupInfo.category}`
    }
    if (setupInfo.difficulty != 'any') {
      url += `&difficulty=${setupInfo.difficulty}`
    }
    console.log(url)
    let newData = []

    fetch(url, options)
      .then(response => response.json())
      .then(responseAsJSON => {
        newData = responseAsJSON.results
        newData.forEach(e => {
          e.answer_array = Utils.shuffle([...e.incorrect_answers, e.correct_answer])
        })
        console.log(newData)

        let evt = new Event('apiGet')
        evt.questions = newData
        document.dispatchEvent(evt)
      })
      .catch(error => {
        console.log('An Error Occured: ', error)
      })
      
  }
}
class View {
  constructor() {
    document.addEventListener('startGame', this.startGame.bind(this))
  }
  startGame(e) {
    let question = e.query
    if (question.type == 'boolean') {
      let htmlString = `<h1>${question.question}</h1>
                      <label>
                        ${question.answer_array[0]}
                        <input type="radio" name="answerSelect" id="answer1" value="${question.answer_array[0]}">
                      </label>
                      <label>
                        ${question.answer_array[1]}
                        <input type="radio" name="answerSelect" id="answer2" value="${question.answer_array[1]}">
                      </label>
                      <input type="button" id="confirmBtn" value="Confirm">`
      document.querySelector('body').innerHTML = htmlString
      
    } else {
      let htmlString = `<h1>${question.question}</h1>
                      <label>
                        ${question.answer_array[0]}
                        <input type="radio" name="answerSelect" id="answer1" value="${question.answer_array[0]}">
                      </label>
                      <label>
                        ${question.answer_array[1]}
                        <input type="radio" name="answerSelect" id="answer2" value="${question.answer_array[1]}">
                      </label>
                      <label>
                        ${question.answer_array[2]}
                        <input type="radio" name="answerSelect" id="answer3" value="${question.answer_array[2]}">
                      </label>
                      <label>
                        ${question.answer_array[3]}
                        <input type="radio" name="answerSelect" id="answer4" value="${question.answer_array[3]}">
                      </label>
                      <input type="button" id="confirmBtn" value="Confirm">`
      document.querySelector('body').innerHTML = htmlString
    }


    let evt = new Event('done')
    evt.thatQuestion = e.query
    document.dispatchEvent(evt)
  }
}