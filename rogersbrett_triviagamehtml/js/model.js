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
    // Event that sends the information into a method to display the score and move on from there
    let evt = new Event('showScore')
    evt.questions = e.questions
    evt.index = e.index
    evt.players = e.players
    evt.turn = e.turn
    evt.correct = e.correct
    document.dispatchEvent(evt)
  }
  // The method that makes the API call for the data
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
            numCorrect: 9,
            score: 0,
            attempts: 0
          },
          playerTwo: {
            name: setupInfo.tName,
            numCorrect: 9,
            score: 0,
            attempts: 0
          }
        }
        // Set the names of the players on the page
        document.querySelector('#oneName').innerHTML = playerInfo.playerOne.name
        document.querySelector('#twoName').innerHTML = playerInfo.playerTwo.name
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