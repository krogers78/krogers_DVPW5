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

    // Fires upon cliking the submit button for questions
    document.querySelector('#submitBtn').addEventListener('click', this.captureForm.bind(this))
    // Fires after the api call was successful
    document.addEventListener('apiGet', this.showQuestion.bind(this))
    document.addEventListener('first', this.getChoice.bind(this))
  }
  // capture the data from the users input
  captureForm(e) {
    e.preventDefault()
    // capture all the values from the inputs and populate the data object
    this.playerData.oName = this.oName.value
    this.playerData.tName = this.tName.value
    this.playerData.category = this.category.value
    this.playerData.difficulty = this.difficulty.value
    
    // Fire the event upon grabbing all the data
    let evt = new Event('dataGet')
    evt.data = this.playerData
    evt.index = this.index
    evt.turn = this.pTurn
    document.dispatchEvent(evt)
  }
  // push the question to show in the view
  showQuestion(e) {
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
          data.players.playerOne.numCorrect++
          console.log('Player One Score', data.players.playerOne.numCorrect)
          data.turn = 1
        } else {
          data.players.playerTwo.numCorrect++
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
            numCorrect: 0,
            score: 0
          },
          playerTwo: {
            name: setupInfo.tName,
            numCorrect: 0,
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
    // variables to shorten the use of it later and to keep the scope of e
    let question = e.questions
    let i = e.index
    let players = e.players
    // Tests whether the question is a true/false or not
    if (question[i].type == 'boolean') {
      let htmlString = `<p>Q: ${i+1}</p>
                      <h1>${question[i].question}</h1>
                      <div class="answerChoices">
                        <div>
                          <input type="radio" name="answerSelect" id="answer1" value="${question[i].answer_array[0]}">
                          <label for="answer1">${question[i].answer_array[0]}</label>
                        </div>
                        <div>
                          <input type="radio" name="answerSelect" id="answer2" value="${question[i].answer_array[1]}">
                          <label for="answer2">${question[i].answer_array[1]}</label>
                        </div>
                      </div>
                      <input type="button" id="confirmBtn" value="Confirm">`
      document.querySelector('#main').innerHTML = htmlString
    // If the question if multiple choice
    } else {
      let htmlString = `<p>Q: ${i+1}</p>
                    <h1>${question[i].question}</h1>
                    <div class="answerChoices">
                      <div>
                          <input type="radio" name="answerSelect" id="answer1" value="${question[i].answer_array[0]}">
                          <label for="answer1">${question[i].answer_array[0]}</label>
                      </div>
                      <div>
                          <input type="radio" name="answerSelect" id="answer2" value="${question[i].answer_array[1]}">
                          <label for="answer2">${question[i].answer_array[1]}</label>
                      </div>
                      <div>
                          <input type="radio" name="answerSelect" id="answer3" value="${question[i].answer_array[2]}">
                          <label for="answer3">${question[i].answer_array[2]}</label>
                     </div>
                     <div>
                          <input type="radio" name="answerSelect" id="answer4" value="${question[i].answer_array[3]}">
                          <label for="answer4">${question[i].answer_array[3]}</label>
                     </div>
                    </div>
                      <input type="button" id="confirmBtn" value="Confirm">`
      document.querySelector('#main').innerHTML = htmlString
    }

    // KEEP TRACK OF PLAYER ONE SCORE AND DISPLAY
    if (players.playerOne.numCorrect == 1) {
      players.playerOne.score = 500
      document.querySelector('#pOneScores .pointfive').style.background = 'red'
      document.querySelector('#pOneScores .pointfive').style.visibility = 'visible'
    } else if (players.playerOne.numCorrect == 2) {
      players.playerOne.score = 1000
      document.querySelector('#pOneScores .onek').style.visibility = 'visible'
      document.querySelector('#pOneScores .onek').style.background = 'red'
    } else if (players.playerOne.numCorrect == 3) {
      players.playerOne.score = 2000
      document.querySelector('#pOneScores .twok').style.visibility = 'visible'      
      document.querySelector('#pOneScores .twok').style.background = 'red'
    } else if (players.playerOne.numCorrect == 4) {
      players.playerOne.score = 3000
      document.querySelector('#pOneScores .threek').style.visibility = 'visible'            
      document.querySelector('#pOneScores .threek').style.background = 'red'
    } else if (players.playerOne.numCorrect == 5) {
      players.playerOne.score = 4000
      document.querySelector('#pOneScores .fourk').style.visibility = 'visible'            
      document.querySelector('#pOneScores .fourk').style.background = 'red'
    } else if (players.playerOne.numCorrect == 6) {
      players.playerOne.score = 5000
      document.querySelector('#pOneScores .fivek').style.visibility = 'visible'            
      document.querySelector('#pOneScores .fivek').style.background = 'red'
    } else if (players.playerOne.numCorrect == 7) {
      players.playerOne.score = 6000
      document.querySelector('#pOneScores .sixk').style.visibility = 'visible'            
      document.querySelector('#pOneScores .sixk').style.background = 'red'
    } else if (players.playerOne.numCorrect == 8) {
      players.playerOne.score = 7000
      document.querySelector('#pOneScores .sevenk').style.visibility = 'visible'
      document.querySelector('#pOneScores .sevenk').style.background = 'red'
    } else if (players.playerOne.numCorrect == 9) {
      players.playerOne.score = 8000
      document.querySelector('#pOneScores .eightk').style.visibility = 'visible'
      document.querySelector('#pOneScores .eightk').style.background = 'red'
    } else if (players.playerOne.numCorrect == 10) {
      players.playerOne.score = 10000
      document.querySelector('#pOneScores .tenk').style.visibility = 'visible'
      document.querySelector('#pOneScores .tenk').style.background = 'red'
    }
    // KEEP TRACK OF PLAYER TWO SCORE AND DISPLAY
    if (players.playerTwo.numCorrect == 1) {
      players.playerTwo.score = 500
      document.querySelector('#pTwoScores .pointfive').style.background = 'red'
      document.querySelector('#pTwoScores .pointfive').style.visibility = 'visible'
    } else if (players.playerTwo.numCorrect == 2) {
      players.playerTwo.score = 1000
      document.querySelector('#pTwoScores .onek').style.visibility = 'visible'      
      document.querySelector('#pTwoScores .onek').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 3) {
      players.playerTwo.score = 2000
      document.querySelector('#pTwoScores .twok').style.visibility = 'visible'      
      document.querySelector('#pTwoScores .twok').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 4) {
      players.playerTwo.score = 3000
      document.querySelector('#pTwoScores .threek').style.visibility = 'visible'      
      document.querySelector('#pTwoScores .threek').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 5) {
      players.playerTwo.score = 4000
      document.querySelector('#pTwoScores .fourk').style.visibility = 'visible'      
      document.querySelector('#pTwoScores .fourk').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 6) {
      players.playerTwo.score = 5000
      document.querySelector('#pTwoScores .fivek').style.visibility = 'visible'      
      document.querySelector('#pTwoScores .fivek').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 7) {
      players.playerTwo.score = 6000
      document.querySelector('#pTwoScores .sixk').style.visibility = 'visible'      
      document.querySelector('#pTwoScores .sixk').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 8) {
      players.playerTwo.score = 7000
      document.querySelector('#pTwoScores .sevenk').style.visibility = 'visible'
      document.querySelector('#pTwoScores .sevenk').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 9) {
      players.playerTwo.score = 8000
      document.querySelector('#pTwoScores .eightk').style.visibility = 'visible'
      document.querySelector('#pTwoScores .eightk').style.background = 'red'
    } else if (players.playerTwo.numCorrect == 10) {
      players.playerTwo.score = 10000
      document.querySelector('#pTwoScores .tenk').style.visibility = 'visible'
      document.querySelector('#pTwoScores .tenk').style.background = 'red'
    }
    // Display the current amount of correct answers
    // document.querySelector('#scores').innerHTML = `<h3>${players.playerOne.name}</h3>
    //                                               <p>Correct: ${players.playerOne.numCorrect}</p>
    //                                               <h3>${players.playerTwo.name}</h3>
    //                                               <p>Correct: ${players.playerTwo.numCorrect}</p>`
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