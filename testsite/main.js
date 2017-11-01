// Marvel API
// https://gateway.marvel.com:443/v1/public/comics?title=Wolverine&apikey=619e8982dc6d0215038b7966347bc50a'
// Weather API
// http://api.wunderground.com/api/4a01fcdd0c5d1b69/conditions/q/CA/San_Francisco.json
// Trivia API
// https://opentdb.com/api.php?amount=10
// Pokemon API
// https://pokeapi.co/api/v2/pokemon/1/

window.addEventListener('load', e => {
  // let cor = "https://cors-anywhere.herokuapp.com/"
  let url = 'https://opentdb.com/api.php?amount=10'
  let options = { method: "GET" }

  console.log(url)

  fetch (url, options)
    .then(response => response.json())
    .then(responseAsJSON => {
      captureResults(responseAsJSON.results)
      console.log(responseAsJSON.results)
      if (document.querySelector('#finalAnswer')) {
        document.querySelector('#finalAnswer').addEventListener('click', e => {
          if (cAnswer.checked) {
            console.log('Correct Answer!')
          } else {
            console.log('Incorrect Answer!')
          }
        })      

      }

    })
    .catch(error => {
      console.log('An Error Occured: ', error)
    })

    function captureResults(data) {
      let htmlString = `<h3>${data[0].question}</h3>
                        <label><input type="radio" name="answer" id="wAnswer1">${data[0].incorrect_answers[1]}</label>
                        <label><input type="radio" name="answer" id="wAnswer2">${data[0].incorrect_answers[0]}</label>
                        <label><input type="radio" name="answer" id="cAnswer">${data[0].correct_answer}</label>
                        <label><input type="radio" name="answer" id="wAnswer3">${data[0].incorrect_answers[2]}</label>
                        <button id="finalAnswer">Submit</button>`
      document.querySelector('body').innerHTML = htmlString
    }
})