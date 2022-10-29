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
const readFromFile_Button = document.getElementById("readFromFile-btn")
const readFromLocalStorage_Button = document.getElementById("readFromLocalStorage-btn")
const pickWinner_Button = document.getElementById("pickWinner-btn")
const resetWinners_Button = document.getElementById("resetWinners-btn")

//code

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
  saveToLocalStorage('peopleList', peopleList)
}

//read from file button
readFromFile_Button.onclick = () => {
  peopleList = []
  readFromFile('./js/data.json')
  resetWinners()
}
//read from LS button
readFromLocalStorage_Button.onclick = () => {
  peopleList = readFromLocalStorage('peopleList') || []
  updateCounter()
  resetWinners()
}

//pick winner button
pickWinner_Button.onclick = () => {
  if (peopleList.length == 0){
    Swal.fire(
      'Error',
      'No hay personas registradas',
      'error'
    )
    return
  }
  if (winnersCounter < winnersLimit) {
    let winner
    let check_NoWinners = peopleList.some((i) => i.isWinner === false) //there must be at least one person.isWinner == false
    if (check_NoWinners) {
      do {
        winner = getRandomInt(peopleList.length)  //find winner based on: (math.random => array position)
      } while (peopleList[winner].isWinner); //skip if person already won
      peopleList[winner].isWinner = true  //flag chosen winner
      renderLastWinner(winner)  //display winner
      renderEveryWinner()
      winnersCounter++
    } else {
      Swal.fire({
        title: 'Espera!',
        text: 'Todas las personas registradas ya ganaron un premio.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reiniciar ganadores'
      }).then((result) => {
        resetWinners()
        if (result.isConfirmed) {
          Swal.fire(
            'OK',
            'Ganadores reiniciados',
            'success'
          )
        }
      })
    }
  } else {
    Swal.fire(
      'Espera!',
      'Se han acabado los premios',
      'warning'
    )
  }
}

//clear winners button
resetWinners_Button.onclick = () => {
  resetWinners()
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

function resetWinners(){
  const winnerCardsDiv = document.getElementById("winnerCardsDiv")

  peopleList.forEach(person => { person.winnerFlagClear() }); //clear flags using metod
  winnerCardsDiv.innerHTML = ""
  winnersCounter = 0
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
  .then( (response) => response.json() )
  .then( (dataArray) => {
    for (const object of dataArray) {
      pushPersonToPeopleList(object)
    }
  } )
}

function updateCounter(){
  signUpCounter.innerText = `${peopleList.length}`  //display enrolled people number
}

function pushPersonToPeopleList(object){
  const {age, email, firstname, lastname, phone} = object
  const newPerson = new person(firstname, lastname, age, phone, email)
  peopleList.push(newPerson)
  updateCounter()
}