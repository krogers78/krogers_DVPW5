class View {
  constructor() {
    document.addEventListener('qShow', this.showQuestion.bind(this))
    document.addEventListener('nextTry', this.showQuestion.bind(this))
    document.addEventListener('showScore', this.showScore.bind(this))
    document.addEventListener('newGame', this.newGame.bind(this))
  }
  // displays the question on the page
  showQuestion(e) {
    // variables to shorten the use of it later and to keep the scope of e
    let questions = e.questions
    let i = e.index
    let players = e.players

    // Tests whether the question is a true/false or not
    if (questions[i].type == 'boolean') {
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
  
    // store html elements in variables
    let oneName = document.querySelector('#oneName')
    let twoName = document.querySelector('#twoName')
    // Set the names of the players on the page
    oneName.innerHTML = players.playerOne.name
    twoName.innerHTML = players.playerTwo.name

    // Let the players know who's turn it is
    if (e.turn == 0) {
      oneName.classList.add('yourTurn')
      Utils.itemBounce(oneName)
      twoName.classList.remove('yourTurn')
    } else {
      twoName.classList.add('yourTurn')
      Utils.itemBounce(twoName)      
      oneName.classList.remove('yourTurn')
    }
    // Event fires to return the code to the function with the timer
    let evt = new Event('timerCheck')
    evt.questions = e.questions
    evt.index = i
    evt.players = players
    evt.turn = e.turn
    document.dispatchEvent(evt)
  }
  // displays the score for the players
  showScore(e) {
    let players = e.players
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
                                                  <p id="playAgain">Play Again></p>`
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
                                                  <p id="playAgain">Play Again</p>`
      
    }
    if (players.playerOne.numCorrect == 10 || players.playerTwo.numCorrect == 10) {
      let evt = new Event('gameOver')
      evt.players = players
      document.dispatchEvent(evt)
    } else {
          // Event that sends the information into a buffer between here and the next tryEvent
          let evt = new Event('buffer')
          evt.questions = e.questions
          evt.index = e.index
          evt.players = e.players
          evt.turn = e.turn
          evt.correct = e.correct
          document.dispatchEvent(evt)
    }
  }
  // method to begin a new game
  newGame(e) {
    // repopulate the view with the form
    document.querySelector('#main').innerHTML = `<form id="gameSetup">
        <p>
          <label>
            Player One:
            <input type="text" id="pOneName" required value="${e.players.playerOne.name}">
          </label>
        </p>
        <p>
          <label>
            Player Two:
            <input type="text" id="pTwoName" required value="${e.players.playerTwo.name}">
          </label>
        </p>
        <p>
          <label>
            Category
            <select id="categoryPicker">
              <option value="any">Surprise Me</option>
              <option value="9">General Knowledge</option>
              <option value="10">Entertainment: Books</option>
              <option value="11">Entertainment: Film</option>
              <option value="12">Entertainment: Music</option>
              <option value="13">Entertainment: Musicals &amp; Theatres</option>
              <option value="14">Entertainment: Television</option>
              <option value="15">Entertainment: Video Games</option>
              <option value="16">Entertainment: Board Games</option>
              <option value="17">Science &amp; Nature</option>
              <option value="18">Science: Computers</option>
              <option value="19">Science: Mathematics</option>
              <option value="20">Mythology</option>
              <option value="21">Sports</option>
              <option value="22">Geography</option>
              <option value="23">History</option>
              <option value="24">Politics</option>
              <option value="25">Art</option>
              <option value="26">Celebrities</option>
              <option value="27">Animals</option>
              <option value="28">Vehicles</option>
              <option value="29">Entertainment: Comics</option>
              <option value="30">Science: Gadgets</option>
              <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
              <option value="32">Entertainment: Cartoon &amp; Animations</option>
            </select>
          </label>
         </p>
        <p>
          <label>
            Select a Difficulty
            <select id="difficultyPicker">
              <option value="any">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
         </p>
        <button type="submit" id="submitBtn">Start Game</button>
      </form>`
    // On submit fire an event to start the game
    document.querySelector('form').addEventListener('submit', e => {
      e.preventDefault()
      let evt = new Event('startGameAnew')
      document.dispatchEvent(evt)
    })
  }
}