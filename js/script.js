class person {
  constructor(firstname, lastname, age, phone, email){
    this.firstname = firstname;
    this.lastname = lastname;
    this.age = age;
    this.phone = phone;
    this.email = email;
    this.isWinner= false;
  }
  winnerFlagClear(){
    this.isWinner = false;
  }
}

let peopleList = []
let prizeLimit = 5
let prizeCounter = 1
const peopleCounter = document.getElementById("peopleCounter")

//register button
const enroll = document.getElementById("enroll-btn")
enroll.onclick = (e) => {
  e.preventDefault()
  const firstname = document.getElementById("inputFirstname")
  const lastname = document.getElementById("inputLastname")
  const age = document.getElementById("inputAge")
  const phone = document.getElementById("inputPhone")
  const email = document.getElementById("inputEmail")

  peopleList.push( new person(firstname.value, lastname.value, age.value, phone.value, email.value) )
  peopleCounter.innerText = `${peopleList.length}` //display enrolled people number
}

//sweepstake button
const pickWinner = document.getElementById("pickWinner-btn")
pickWinner.onclick = () => {
  if (prizeCounter <= prizeLimit) {
    let winner
    let checkNoWinners = peopleList.some((i) => i.isWinner === false) //there must be at least one person.isWinner == false
    if (checkNoWinners) {
      do {
        winner = getRandomInt(peopleList.length)  //find winner based on: (math.random => array position)
      } while (peopleList[winner].isWinner); //skip person if already won
      peopleList[winner].isWinner = true  //flag winner
      renderWinner(winner)  //display winner
      prizeCounter++
    } else {
      alert('Todas las personas registradas ya ganaron al menos una vez. Se debe registrar mas personas o resetear los ganadores')
    }
  } else {
    alert('No hay mas premios - Resetee a los ganadores')
  }
}

//clear winners flag button
const clearFlags = document.getElementById("clearFlags-btn")
clearFlags.onclick = () => {
  peopleList.forEach( person => { person.winnerFlagClear() }); //clear flags using object.metod
  const winnerCardsDiv = document.getElementById("winnerCardsDiv")
  winnerCardsDiv.innerHTML = ""
  prizeCounter = 1
}

//show every winner
const showWinner = document.getElementById("showWinner-btn")
showWinner.onclick = () => {
  let peopleList_Winners = peopleList.filter( (i) => i.isWinner === true)
  if (peopleList_Winners.length == 0) alert('Aun no hay ningun ganador')
  renderEveryWinner(peopleList_Winners)
}

//functions:
function getRandomInt(maxNum) {
  return Math.floor(Math.random() * maxNum);
}

function renderWinner(winner){
  const winnerDiv = document.getElementById("winnerDiv")
  winnerDiv.innerHTML = `
                          <div class="container setBorder">
                            <p class="titleBig mb-1">Saliste Sorteado!</p>
                            <p class="titleSmall mb-1">${peopleList[winner].firstname} ${peopleList[winner].lastname}</p>
                            <p class="my-0">Tel: ${peopleList[winner].phone}</p>
                            <p class="my-0">Email: ${peopleList[winner].email}</p>
                          </div>
                        `
  winnerDiv.className = "col my-5"
}

function renderEveryWinner(winners){
  let num = 0
  let card
  const winnerCardsDiv = document.getElementById("winnerCardsDiv")
  winnerCardsDiv.innerHTML = ""
  winners.forEach(winner => {
    num++
    card = document.createElement("div")
    card.classList.add('card', 'col-2', 'm-2')
    card.innerHTML =  `
                        <img src="./img/${num}.jpg" class="card-img-top" alt="Imagen de premio">
                        <div class="card-body text-center">
                          <h5 class="card-title">Premio Nro.${num}</h5>
                          <p class="card-text my-0">${winner.firstname} ${winner.lastname}</p>
                          <p class="card-text my-0">Tel: ${winner.phone}</p>
                          <p class="card-text my-0">Email: ${winner.email}</p>
                        </div>
                      `
    winnerCardsDiv.appendChild(card)
  });
}