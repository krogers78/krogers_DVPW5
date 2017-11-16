class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()
    // variables for later use
    this.playerData = new PlayerData()
    this.pTurn = 0
    this.correctOrIncorrect = false

    // Fires upon cliking the submit button for questions
    document.querySelector('#submitBtn').addEventListener('click', this.captureForm.bind(this))
    // Fires after the api call was successful
    document.addEventListener('apiGet', this.showQuestion.bind(this))
    document.addEventListener('confirmClicked', this.getChoice.bind(this))
    document.addEventListener('timerCheck', this.timerTest.bind(this))
    document.addEventListener('buffer', this.buffer.bind(this))
  }
  // process some info before goin to the nextTry event
  buffer(e) {
    // store variables for easier calls later
    let correctAnswer = e.questions[e.index].correct_answer
    let a1 = document.querySelector('#answer1')
    let a2 = document.querySelector('#answer2')
    let a3 = document.querySelector('#answer3')
    let a4 = document.querySelector('#answer4')

    // If they answered correctly
    if (e.correct) {
      // If the question is a boolean
      if (e.questions[e.index].type == 'boolean') {
        if (a1 && a1.value == correctAnswer) {
          document.querySelector('#answer1 + label').style.background = 'green'
        } else if (a2 && a2.value == correctAnswer) {
          document.querySelector('#answer2 + label').style.background = 'green'
        }
      // If the question is not a boolean
      } else {
        if (a1 && a1.value == correctAnswer) {
          document.querySelector('#answer1 + label').style.background = 'green'
        } else if (a2 && a2.value == correctAnswer) {
          document.querySelector('#answer2 + label').style.background = 'green'
        } else if (a3 && a3.value == correctAnswer) {
          document.querySelector('#answer3 + label').style.background = 'green'
        } else if (a4 && a4.value == correctAnswer) {
          document.querySelector('#answer4 + label').style.background = 'green'
        }
      }
      // increase the index to the next question
      e.index++
      // Event that fires that brings up the question with the next player's turn
      let x = setInterval(() => {
        let evt = new Event('nextTry')
        evt.questions = e.questions
        evt.index = e.index
        evt.players = e.players
        evt.turn = e.turn
        document.dispatchEvent(evt)
        clearInterval(x)
      }, 4000)
    } else {
      // If the player exhausts their question attempts
      if (e.players.playerOne.attempts == 1 && e.players.playerTwo.attempts == 1) {
        // if the question is a boolean
        if (e.questions[e.index] == 'boolean') {
          if (a1 && a1.value == correctAnswer) {
            document.querySelector('#answer1 + label').style.background = 'green'
          } else if (a2 && a2.value == correctAnswer) {
            document.querySelector('#answer2 + label').style.background = 'green'
          }
        // If the question is not a boolean
        } else {
          if (a1 && a1.value == correctAnswer) {
            document.querySelector('#answer1 + label').style.background = 'green'
          } else if (a2 && a2.value == correctAnswer) {
            document.querySelector('#answer2 + label').style.background = 'green'
          } else if (a3 && a3.value == correctAnswer) {
            document.querySelector('#answer3 + label').style.background = 'green'
          } else if (a4 && a4.value == correctAnswer) {
            document.querySelector('#answer4 + label').style.background = 'green'
          }
        }
        // proceed to the next question
        e.index++
        // Reset the players attempts
        e.players.playerOne.attempts = 0
        e.players.playerTwo.attempts = 0
        // Event that fires that brings up the question with the next player's turn
        let x = setInterval(() => {
          let evt = new Event('nextTry')
          evt.questions = e.questions
          evt.index = e.index
          evt.players = e.players
          evt.turn = e.turn
          document.dispatchEvent(evt)
          clearInterval(x)
        }, 4000)
      // If the players still have an attempt left
      } else {
        let evt = new Event('nextTry')
        evt.questions = e.questions
        evt.index = e.index
        evt.players = e.players
        evt.turn = e.turn
        document.dispatchEvent(evt)
      }
    }
  }
  timerTest(e) {
    // function to countdown the timer for each question
    this.correctOrIncorrect = false
    let timeLeft = 32
    let x = setInterval( () => {
      document.querySelector("#timer").value = --timeLeft;
      if (timeLeft < 0) {
        clearInterval(x);

        // document.querySelector('#confirmBtn').disabled = true
        // event to mark the question as incorrect
        let evt = new Event('turnOver')
        evt.questions = e.questions
        evt.index = e.index
        evt.players = e.players
        evt.turn = e.turn
        evt.correct = this.correctOrIncorrect        
        document.dispatchEvent(evt)
      }
    }, 1000);
    // event that listens for a click on the question confirm button
    document.querySelector('#confirmBtn').addEventListener('click', () => {
      // resetting the timer
      clearInterval(x)
      document.querySelector("#timer").value = 30; 
      // Event that fires when the question has been clicked  
      let evt = new Event('confirmClicked')
      evt.questions = e.questions
      evt.index = e.index
      evt.players = e.players
      evt.turn = e.turn
      document.dispatchEvent(evt)
    })
  }
  // capture the data from the users input
  captureForm(e) {
    e.preventDefault()
    let index = 0
    // capture all the values from the inputs and populate the data object
    this.playerData.oName = document.querySelector('#pOneName').value
    this.playerData.tName = document.querySelector('#pTwoName').value
    this.playerData.category = document.querySelector('#categoryPicker').value
    this.playerData.difficulty = document.querySelector('#difficultyPicker').value
    
    // Fire the event upon grabbing all the data
    let evt = new Event('dataGet')
    evt.data = this.playerData
    evt.index = index
    evt.turn = this.pTurn
    document.dispatchEvent(evt)
  }
  // push the question to show in the view
  showQuestion(e) {
    // Fire an event to show the question in the view
    let evt = new Event('qShow')
    evt.questions = e.questions
    evt.index = e.index
    evt.players = e.players
    evt.turn = e.turn
    document.dispatchEvent(evt)
  }
  getChoice(e) {
    e.preventDefault()
    // Variables to keep the scope of e to the event
    let data = e
    let correctAnswer = e.questions[e.index].correct_answer
    // store inputs in variables
    let a1 = document.querySelector('#answer1')
    let a2 = document.querySelector('#answer2')
    let a3 = document.querySelector('#answer3')
    let a4 = document.querySelector('#answer4')
    this.correctOrIncorrect = false    
    
    // checks if the question is true or false
    if (data.questions[data.index].type == 'boolean') {
      // checks to find out if the correct answer was chosen
      if (a1 && a1.checked && a1.value == correctAnswer) {
        this.correctOrIncorrect = true
      } else if (a2 && a2.checked && a2.value == correctAnswer) {
        this.correctOrIncorrect = true
      }
    } else {
      // checks to find out if the correct answer was chosen
      if (a1 && a1.checked && a1.value == correctAnswer) {
        this.correctOrIncorrect = true
      } else if (a2 && a2.checked && a2.value == correctAnswer) {
        this.correctOrIncorrect = true
      } else if (a3 && a3.checked && a3.value == correctAnswer) {
        this.correctOrIncorrect = true
      } else if (a4 && a4.checked && a4.value == correctAnswer) {
        this.correctOrIncorrect = true
      }
    }
      // Event that fires once the question has been answered
      let evt = new Event('turnOver')
      evt.index = e.index
      evt.questions = data.questions
      evt.players = data.players
      evt.turn = data.turn
      evt.correct = this.correctOrIncorrect
      document.dispatchEvent(evt)
  }
}
class Model {
  constructor() {
    document.addEventListener('dataGet', this.makeApiCall.bind(this))
    document.addEventListener('turnOver', this.turnEnd.bind(this))
  }
  // The method that occurs when a turn has ended
  turnEnd(e) {
    // disable the button to prevent it from being clicked again
    document.querySelector('#confirmBtn').disabled = true
    // if the question was answered correct
    if (e.correct) {
      // determines who's turn it is to answer
      if (e.turn == 0) {
        e.turn = 1
        e.players.playerOne.numCorrect++
      } else {
        e.turn = 0
        e.players.playerTwo.numCorrect++
      }
      // Reset the player attempts
      e.players.playerOne.attempts = 0
      e.players.playerTwo.attempts = 0
      // e.index++
      
    // If the answer was wrong
    } else {
      // determines who's turn it is to answer
      if (e.turn == 0) {
        e.turn = 1
        // Increase the player attempt
        e.players.playerOne.attempts = 1
      } else {
        e.turn = 0
        // Increase the player attempt
        e.players.playerTwo.attempts = 1
      }
    }
    // Event that sends the information into a buffer between here and the next tryEvent
    let evt = new Event('buffer')
    evt.questions = e.questions
    evt.index = e.index
    evt.players = e.players
    evt.turn = e.turn
    evt.correct = e.correct
    document.dispatchEvent(evt)
  }
  makeApiCall(e) {
    // make the call easier later
    let setupInfo = e.data
    // base url options
    let url = 'https://opentdb.com/api.php?amount=50'
    let options = { method: 'GET' }
    // check the data and configure the url accordingly
    if (setupInfo.category != 'any') {
      url += `&category=${setupInfo.category}`
    }
    if (setupInfo.difficulty != 'any') {
      url += `&difficulty=${setupInfo.difficulty}`
    }
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
            score: 0,
            attempts: 0
          },
          playerTwo: {
            name: setupInfo.tName,
            numCorrect: 0,
            score: 0,
            attempts: 0
          }
        }
        anime({
          targets: '#main',
          scale: [
            { value: 1, duration: 100 },
            { value: 0.2, duration: 100 },
            { value: 1, duration: 400 },
          ],
          duration: 2000,
        })
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
    document.addEventListener('nextTry', this.showQuestion.bind(this))
  }
  showQuestion(e) {
    // variables to shorten the use of it later and to keep the scope of e
    let questions = e.questions
    let i = e.index
    let players = e.players
    
    // Tests whether the question is a true/false or not
    if (questions[i].type == 'boolean') {
      let htmlString = `<div id="qData">
                        <p>Question: ${i+1}</p>
                        <progress value="32" min="0" max="32" id="timer"></progress>
                      </div>
                      <h1 id="currentQuestion">${questions[i].question}</h1>
                      <div class="answerChoices">
                        <div>
                          <input type="radio" name="answerSelect" id="answer1" value="${questions[i].answer_array[0]}">
                          <label for="answer1">${questions[i].answer_array[0]}</label>
                        </div>
                        <div>
                          <input type="radio" name="answerSelect" id="answer2" value="${questions[i].answer_array[1]}">
                          <label for="answer2">${questions[i].answer_array[1]}</label>
                        </div>
                      </div>
                      <button type="button" id="confirmBtn">Confirm</button>`
      document.querySelector('#main').innerHTML = htmlString
    // If the question if multiple choice
    } else {
      let htmlString = `<div id="qData">
                        <p>Question: ${i + 1}</p>
                        <progress value="32" min="0" max="32" id="timer"></progress>
                      </div>
                    <h1 id="currentQuestion">${questions[i].question}</h1>
                    <div class="answerChoices">
                      <div>
                          <input type="radio" name="answerSelect" id="answer1" value="${questions[i].answer_array[0]}">
                          <label for="answer1">${questions[i].answer_array[0]}</label>
                      </div>
                      <div>
                          <input type="radio" name="answerSelect" id="answer2" value="${questions[i].answer_array[1]}">
                          <label for="answer2">${questions[i].answer_array[1]}</label>
                      </div>
                      <div>
                          <input type="radio" name="answerSelect" id="answer3" value="${questions[i].answer_array[2]}">
                          <label for="answer3">${questions[i].answer_array[2]}</label>
                     </div>
                     <div>
                          <input type="radio" name="answerSelect" id="answer4" value="${questions[i].answer_array[3]}">
                          <label for="answer4">${questions[i].answer_array[3]}</label>
                     </div>
                    </div>
                      <button type="button" id="confirmBtn">Confirm</button>`
      document.querySelector('#main').innerHTML = htmlString
    }
    // determine the font size for the question
    if (questions[i].question.length >= 90) {
      document.querySelector('h1').style.fontSize = '1.2rem'
    }
    // enable the button again for use
    document.querySelector('#confirmBtn').disabled = false
    // KEEP TRACK OF PLAYER ONE SCORE AND DISPLAY
    if (players.playerOne.numCorrect == 1) {
      players.playerOne.score = 500
      Utils.animateScore('pOneScores', 'pointfive')
    } else if (players.playerOne.numCorrect == 2) {
      players.playerOne.score = 1000
      Utils.animateScore('pOneScores', 'onek')
    } else if (players.playerOne.numCorrect == 3) {
      players.playerOne.score = 2000
      Utils.animateScore('pOneScores', 'twok')
    } else if (players.playerOne.numCorrect == 4) {
      players.playerOne.score = 3000
      Utils.animateScore('pOneScores', 'threek')
    } else if (players.playerOne.numCorrect == 5) {
      players.playerOne.score = 4000
      Utils.animateScore('pOneScores', 'fourk')
    } else if (players.playerOne.numCorrect == 6) {
      players.playerOne.score = 5000
      Utils.animateScore('pOneScores', 'fivek')
    } else if (players.playerOne.numCorrect == 7) {
      players.playerOne.score = 6000
      Utils.animateScore('pOneScores', 'sixk')
    } else if (players.playerOne.numCorrect == 8) {
      players.playerOne.score = 7000
      Utils.animateScore('pOneScores', 'sevenk')
    } else if (players.playerOne.numCorrect == 9) {
      players.playerOne.score = 8000
      Utils.animateScore('pOneScores', 'eightk')
    } else if (players.playerOne.numCorrect == 10) {
      players.playerOne.score = 10000
      Utils.animateScore('pOneScores', 'tenk')
      document.querySelector('#main').innerHTML = `<p id="winner">${players.playerOne.name} wins!</p>
                                                  <p id="playAgain"><a href="/">Play Again</a></p>`
    }
    // KEEP TRACK OF PLAYER TWO SCORE AND DISPLAY
    if (players.playerTwo.numCorrect == 1) {
      players.playerTwo.score = 500
      Utils.animateScore('pTwoScores', 'pointfive') 
    } else if (players.playerTwo.numCorrect == 2) {
      players.playerTwo.score = 1000
      Utils.animateScore('pTwoScores', 'onek')
    } else if (players.playerTwo.numCorrect == 3) {
      players.playerTwo.score = 2000
      Utils.animateScore('pTwoScores', 'twok')
    } else if (players.playerTwo.numCorrect == 4) {
      players.playerTwo.score = 3000
      Utils.animateScore('pTwoScores', 'threek')
    } else if (players.playerTwo.numCorrect == 5) {
      players.playerTwo.score = 4000
      Utils.animateScore('pTwoScores', 'fourk')
    } else if (players.playerTwo.numCorrect == 6) {
      players.playerTwo.score = 5000
      Utils.animateScore('pTwoScores', 'fivek')
    } else if (players.playerTwo.numCorrect == 7) {
      players.playerTwo.score = 6000
      Utils.animateScore('pTwoScores', 'sixk')
    } else if (players.playerTwo.numCorrect == 8) {
      players.playerTwo.score = 7000
      Utils.animateScore('pTwoScores', 'sevenk')
    } else if (players.playerTwo.numCorrect == 9) {
      players.playerTwo.score = 8000
      Utils.animateScore('pTwoScores', 'eightk')
    } else if (players.playerTwo.numCorrect == 10) {
      players.playerTwo.score = 10000
      Utils.animateScore('pTwoScores', 'tenk')
      document.querySelector('#main').innerHTML = `<p id="winner">${players.playerOne.name} wins!</p>
                                                  <p id="playAgain"><a href="/">Play Again</a></p>`
    }
    // store html elements in variables
    let oneName = document.querySelector('#oneName')
    let twoName = document.querySelector('#twoName')
    // Set the names of the players on the page
    oneName.innerHTML = players.playerOne.name
    twoName.innerHTML = players.playerTwo.name

    // Let the players know who's turn it is
    if (e.turn == 0) {
      oneName.className = 'nameAnimate'
      oneName.addEventListener('animationend', () => oneName.classList.remove('nameAnimate'))
    } else {
      twoName.className = 'nameAnimate'
      twoName.addEventListener('animationend', () => twoName.classList.remove('nameAnimate'))
    }
    // Event fires to return the code to the function with the timer
    let evt = new Event('timerCheck')
    evt.questions = e.questions
    evt.index = i
    evt.players = players
    evt.turn = e.turn
    document.dispatchEvent(evt)
  }
}