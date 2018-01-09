class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()
    // variables for later use
    this.playerData = new PlayerData()
    this.pTurn = 0
    this.correctOrIncorrect = false

    // Fires upon clicking the submit button for questions
    document.querySelector('#submitBtn').addEventListener('click', this.captureForm.bind(this))
    // All the event listeners to make the program function as intended
    document.addEventListener('apiGet', this.showQuestion.bind(this))
    document.addEventListener('confirmClicked', this.getChoice.bind(this))
    document.addEventListener('timerCheck', this.timerTest.bind(this))
    document.addEventListener('buffer', this.buffer.bind(this))
    document.addEventListener('gameOver', this.gameOver.bind(this))
    document.addEventListener('gameOver', this.gameOver.bind(this))
    document.addEventListener('startGameAnew', this.captureForm.bind(this))
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
      }, 3000)
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
        }, 3000)
      // If the players still have an attempt left
      } else {
        // display quickly that they got the wrong answer
        if (e.questions[e.index].type == 'boolean') {
          if (a1.checked) {
            document.querySelector('#answer1 + label').style.background = '#FF0002'
          } else if (a2.checked) {
            document.querySelector('#answer2 + label').style.background = '#FF0002'
          }
        } else {
          if (a1.checked) {
            document.querySelector('#answer1 + label').style.background = '#FF0002'          
          } else if (a2.checked) {
            document.querySelector('#answer2 + label').style.background = '#FF0002'          
          } else if (a3.checked) {
            document.querySelector('#answer3 + label').style.background = '#FF0002'          
          } else if (a4.checked) {
            document.querySelector('#answer4 + label').style.background = '#FF0002'          
          }
        }
        let y = setInterval(() => {
          // reset all the answer colors back to the original color
          document.querySelector('.answerChoices input[type=radio] + label').style.background = 'rgb(0, 75, 122)'
          let evt = new Event('nextTry')
          evt.questions = e.questions
          evt.index = e.index
          evt.players = e.players
          evt.turn = e.turn
          document.dispatchEvent(evt)
          clearInterval(y)
        }, 750)
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
    let err = []
    // check if the player one name is blank
    if (document.querySelector('#pOneName').value == '') {
      document.querySelector('#pOneName').insertAdjacentHTML('afterEnd', '<p class="error">Please enter a name!</p>')
      err.push('pOne')
    }
    // check if the player two name is blank
    if (document.querySelector('#pTwoName').value == '') {
      document.querySelector('#pTwoName').insertAdjacentHTML('afterEnd', '<p class="error">Please enter a name!</p>')
      err.push('ptwo')
    }
    // let the form submit if there are no errors
    if (err.length == 0) {
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
  // capture the player answer choice
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
  // method that listens for the click if they want to play a new game
  gameOver(e) {
    let players = e.players
    // reset the player information
    players.playerOne.numCorrect = 0
    players.playerOne.score = 0
    players.playerTwo.numCorrect = 0
    players.playerTwo.score = 0
    // Add an event listener for the play again click
    document.querySelector('#playAgain').addEventListener('click', () => {
      // 
      //  I KNOW THIS IS RIDICULOUS, BUT THROUGH ALL KINDS OF TRIAL AND ERROR
      //  THIS IS THE ONLY WAY MADE ALL THE SCORES HIDDEN AGAIN :/
      // 
      document.querySelector('#pOneScores .pointfive').style.visibility = 'hidden'
      document.querySelector('#pOneScores .onek').style.visibility = 'hidden'
      document.querySelector('#pOneScores .twok').style.visibility = 'hidden'
      document.querySelector('#pOneScores .threek').style.visibility = 'hidden'
      document.querySelector('#pOneScores .fourk').style.visibility = 'hidden'
      document.querySelector('#pOneScores .fivek').style.visibility = 'hidden'
      document.querySelector('#pOneScores .sixk').style.visibility = 'hidden'
      document.querySelector('#pOneScores .sevenk').style.visibility = 'hidden'
      document.querySelector('#pOneScores .eightk').style.visibility = 'hidden'
      document.querySelector('#pOneScores .tenk').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .pointfive').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .onek').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .twok').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .threek').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .fourk').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .fivek').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .sixk').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .sevenk').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .eightk').style.visibility = 'hidden'
      document.querySelector('#pTwoScores .tenk').style.visibility = 'hidden'
      let evt = new Event('newGame')
      evt.players = players
      document.dispatchEvent(evt)
    })
  }
}
