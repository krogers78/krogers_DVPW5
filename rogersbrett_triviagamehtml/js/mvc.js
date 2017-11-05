class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()
    // variables for later use
    this.oName = ''
    this.tName = ''
    this.category = ''
    this.difficulty = ''
    this.playerData = new PlayerData()

    document.querySelector('#submitBtn').addEventListener('click', this.captureForm.bind(this))
  }
  captureForm(e) {
    e.preventDefault()
    this.playerData.oName = document.querySelector('#pOneName').value
    this.playerData.tName = document.querySelector('#pTwoName').value
    this.playerData.category = document.querySelector('#categoryPicker').value
    this.playerData.difficulty = document.querySelector('#difficultyPicker').value

    let evt = new Event('dataGet')
    evt.data = this.playerData
    document.dispatchEvent(evt)
  }
  getData() {
    let newData = []
    let url = 'https://opentdb.com/api.php?amount=10'
    let options = { method: "GET" }

    fetch(url, options)
      .then(response => response.json())
      .then(responseAsJSON => {
        newData = responseAsJSON.results
        newData.forEach(e => {
          e.answer_array = Utils.shuffle([...e.incorrect_answers, e.correct_answer])
        })
      })
      .catch(error => {
        console.log('An Error Occured: ', error)
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

    fetch(url, options)
      .then(response => response.json())
      .then(responseAsJSON => {
        console.log('FETCH', responseAsJSON.results)
      })
      .catch(err => {
        throw `An Error Occured: ${err}`
      })
  }
}
class View {
  constructor() {
  }
}