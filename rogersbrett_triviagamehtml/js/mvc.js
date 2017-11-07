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
    this.index = 0
    this.pTurn = 0

    document.querySelector('#submitBtn').addEventListener('click', this.captureForm.bind(this))
    document.addEventListener('apiGet', this.startIt.bind(this))
    document.addEventListener('first', this.getChoice.bind(this))
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
    evt.index = this.index
    evt.turn = this.pTurn
    document.dispatchEvent(evt)
  }
  startIt(e) {
    let evt = new Event('qShow')
    evt.questions = e.questions
    evt.index = e.index
    evt.players = e.players
    evt.turn = e.turn
    document.dispatchEvent(evt)
  }
  getChoice(e) {
    e.preventDefault()
    let data = e
    let correct = e.questions[e.index].correct_answer
    
    document.querySelector('#confirmBtn').addEventListener('click', e => {
      let cOrI = true;
      if (data.questions[data.index].type == 'boolean') {
        if (document.querySelector('#answer1').checked && document.querySelector('#answer1').value == correct) {
          cOrI = true
        } else if (document.querySelector('#answer2').checked && document.querySelector('#answer2').value == correct) {
          cOrI = true
        } else {
          cOrI = false
        }
      } else {
        if (document.querySelector('#answer1').checked && document.querySelector('#answer1').value == correct) {
          cOrI = true
        } else if (document.querySelector('#answer2').checked && document.querySelector('#answer2').value == correct) {
          cOrI = true
        } else if (document.querySelector('#answer3').checked && document.querySelector('#answer3').value == correct) {
          cOrI = true
        } else if (document.querySelector('#answer4').checked && document.querySelector('#answer4').value == correct) {
          cOrI = true
        } else {
          cOrI = false
        }
      }
      if (cOrI) {
        // determines who's turn it is to answer
        if (data.turn == 0) {
          data.players.playerOne.score++
          console.log('Player One Score', data.players.playerOne.score)
          data.turn = 1
        } else {
          data.players.playerTwo.score++
          data.turn = 0
        }

        this.index++
        console.log('Correct Answer!')
      } else {
        console.log('Incorrect Answer!')
        if (data.turn == 0) {
          data.turn = 1
        } else {
          data.turn = 0
        }
      }
      // Event that fires once the question has been answered
      let evt = new Event('qShow')
      evt.index = this.index
      evt.questions = data.questions
      // evt.names = names
      evt.players = data.players
      evt.turn = data.turn
      document.dispatchEvent(evt)
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
    // Fetch the questions based off user input
    fetch(url, options)
      .then(response => response.json())
      .then(responseAsJSON => {
        newData = responseAsJSON.results
        newData.forEach(e => {
          e.answer_array = Utils.shuffle([...e.incorrect_answers, e.correct_answer])
        })
        // create the variable to store the player information
        let playerInfo = {
          playerOne: {
            name: setupInfo.oName,
            score: 0
          },
          playerTwo: {
            name: setupInfo.tName,
            score: 0
          }
        }
        // Event that fires once all the information is gathered
        let evt = new Event('apiGet')
        evt.questions = newData
        evt.index = e.index
        evt.players = playerInfo
        evt.turn = e.turn
        document.dispatchEvent(evt)
      })
      .catch(error => {
        console.log('An Error Occured: ', error)
      })
      
  }
}
class View {
  constructor() {
    document.addEventListener('qShow', this.showQuestion.bind(this))
    // document.addEventListener('correctAns', this.nextQuestion.bind(this))
  }
  showQuestion(e) {
    let question = e.questions
    let i = e.index
    let players = e.players
    if (question[i].type == 'boolean') {
      let htmlString = `<h1>${question[i].question}</h1>
                      <label>
                        ${question[i].answer_array[0]}
                        <input type="radio" name="answerSelect" id="answer1" value="${question[i].answer_array[0]}">
                      </label>
                      <label>
                        ${question[i].answer_array[1]}
                        <input type="radio" name="answerSelect" id="answer2" value="${question[i].answer_array[1]}">
                      </label>
                      <input type="button" id="confirmBtn" value="Confirm">`
      document.querySelector('#main').innerHTML = htmlString
      
    } else {
      let htmlString = `<h1>${question[i].question}</h1>
                      <label>
                        ${question[i].answer_array[0]}
                        <input type="radio" name="answerSelect" id="answer1" value="${question[i].answer_array[0]}">
                      </label>
                      <label>
                        ${question[i].answer_array[1]}
                        <input type="radio" name="answerSelect" id="answer2" value="${question[i].answer_array[1]}">
                      </label>
                      <label>
                        ${question[i].answer_array[2]}
                        <input type="radio" name="answerSelect" id="answer3" value="${question[i].answer_array[2]}">
                      </label>
                      <label>
                        ${question[i].answer_array[3]}
                        <input type="radio" name="answerSelect" id="answer4" value="${question[i].answer_array[3]}">
                      </label>
                      <input type="button" id="confirmBtn" value="Confirm">`
      document.querySelector('#main').innerHTML = htmlString
    }
    document.querySelector('#scores').innerHTML = `<h3>${players.playerOne.name}</h3>
                                                  <p>Score: ${players.playerOne.score}</p>
                                                  <h3>${players.playerTwo.name}</h3>
                                                  <p>Score: ${players.playerTwo.score}</p>`
    if (e.turn == 0) {
      console.log(`${players.playerOne.name}'s Turn!`)
    } else {
      console.log(`${players.playerTwo.name}'s Turn!`)      
    }

    let evt = new Event('first')
    evt.questions = e.questions
    evt.index = i
    evt.players = players
    evt.turn = e.turn
    document.dispatchEvent(evt)
  }
}