class Utils {
  // fisher yates shuffle
  static shuffle(array) {
    let m = array.length, t, i
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
     i = Math.floor(Math.random() * m--)
     // And swap it with the current element.
     t = array[m]
     array[m] = array[i]
     array[i] = t
    }
    return array
  }
  static animateScore(id, score) {
    if (!(document.querySelector(`#${id} .${score}`).style.visibility == 'visible')) {
      document.querySelector(`#${id} .${score}`).style.visibility = 'visible'
      anime({
        targets: `#${id} .${score}`,
        scale: [
          { value: 0.2, duration: 100 },
          { value: 1, duration: 800 }
        ],
        duration: 1000
      })
    }
  }
  static itemBounce(id) {
    anime({
      targets: id,
      scale: [
        { value: 0.2, duration: 100 },
        { value: 1, duration: 800 }
      ],
      duration: 1000
    })
  }
}