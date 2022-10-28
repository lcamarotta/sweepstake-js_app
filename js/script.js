class person {
  constructor(firstname, lastname, age, phone, email){
    this.firstname = firstname.toUpperCase();
    this.lastname = lastname.toUpperCase();
    this.age = age;
    this.phone = phone;
    this.email = email;
    this.isWinner= false;
  }
  winnerFlagClear(){
    this.isWinner = false;
  }
}
//globals var
let peopleList = []
let winnersLimit = 5  //depends on how many prizes are available
let winnersCounter = 0  //count winners so it does not exceed prize availability
const signUp_Button = document.getElementById("signUp-btn")
const signUpCounter = document.getElementById("signUpCounter")
const pickWinner_Button = document.getElementById("pickWinner-btn")
const resetWinners_Button = document.getElementById("resetWinners-btn")

//code
readFromFile('./js/data.json')
console.log('test', peopleList)
saveToLocalStorage('peopleList', peopleList)
updateCounter()

//buttons
//signUp button
signUp_Button.onclick = (e) => {
  const age = document.getElementById("inputAge")
  const phone = document.getElementById("inputPhone")
  const email = document.getElementById("inputEmail")
  const lastname = document.getElementById("inputLastname")
  const firstname = document.getElementById("inputFirstname")
  const newPerson = new person(firstname.value, lastname.value, age.value, phone.value, email.value) 
  
  e.preventDefault()
  peopleList.push(newPerson)
  updateCounter()
}

//pick winner button
pickWinner_Button.onclick = () => {
  if (winnersCounter < winnersLimit) {
    let winner
    let check_NoWinners = peopleList.some((i) => i.isWinner === false) //there must be at least one person.isWinner == false
    if (check_NoWinners) {
      do {
        winner = getRandomInt(peopleList.length)  //find winner based on: (math.random => array position)
      } while (peopleList[winner].isWinner); //skip if person already won
      peopleList[winner].isWinner = true  //flag chosen winner
      console.log('me fui')
      renderLastWinner(winner)  //display winner
      console.log('volvi')
      renderEveryWinner()
      winnersCounter++
    } else {
      alert('Todas las personas registradas ya ganaron al menos una vez. Se debe registrar mas personas o resetear los ganadores')
    }
  } else {
    alert('No hay mas premios - Resetee a los ganadores')
  }
}

//clear winners button
resetWinners_Button.onclick = () => {
  const winnerCardsDiv = document.getElementById("winnerCardsDiv")

  peopleList.forEach(person => { person.winnerFlagClear() }); //clear flags using metod
  winnerCardsDiv.innerHTML = ""
  winnersCounter = 0
}

//functions:
function getRandomInt(maxNum) {
  return Math.floor(Math.random() * maxNum);
}

function renderLastWinner(winner){
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
  return
}

function renderEveryWinner(){
  let card
  let winnerNumber = winnersLimit
  const winnersList = peopleList.filter((i) => i.isWinner === true)
  const winnerCardsDiv = document.getElementById("winnerCardsDiv")
  winnerCardsDiv.innerHTML = ""
  winnersList.forEach(winner => {
    card = document.createElement("div")
    card.classList.add('card', 'col-2', 'm-2')
    card.innerHTML =  `
                        <img src="./img/${winnerNumber}.jpg" class="card-img-top" alt="Imagen de premio">
                        <div class="card-body text-center">
                          <h5 class="card-title">Premio Nro.${winnerNumber}</h5>
                          <p class="card-text my-0">${winner.firstname} ${winner.lastname}</p>
                          <p class="card-text my-0">Tel: ${winner.phone}</p>
                          <p class="card-text my-0">Email: ${winner.email}</p>
                        </div>
                      `
    winnerCardsDiv.appendChild(card)
    winnerNumber--
  });
  return
}

function saveToLocalStorage(key, value){ //key must be string
  localStorage.setItem(key, JSON.stringify(value))
}

function readFromLocalStorage(key){
  let dataFromLocalStorage = JSON.parse(localStorage.getItem(key))
  return dataFromLocalStorage
}

function readFromFile(filePath){
  fetch(filePath)
  .then( (obj) => obj.json() )
  .then( (data) => {
    console.log(data)
    console.log(peopleList)
    peopleList = data
    console.log(peopleList)
  } ) //should get array of objects
}

function updateCounter(){
  signUpCounter.innerText = `${peopleList.length}`  //display enrolled people number
}

async function readFromFile(filePath){
  let obj = await fetch(filePath)
  let data = await obj.json()
  console.log('obj', obj)
  console.log('data', data)
  return data
}
peopleList = []
console.log('empty people list', peopleList)
peopleList = readFromFile('./js/data.json')
console.log('not empty list', peopleList)