//object classes
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

let prizeList = []
let winnersCounter = 0
let availablePrizes = 0
let peopleList = readFromsessionStorage('peopleList') || []

fetch('./js/prize_data.json')
  .then( (response) => response.json() )
  .then( (dataArray) => {
    prizeList = dataArray
    availablePrizes = prizeList.length
    updateCounter()
  } )
check_flags_and_load_html()

//read from file button
const loadFile_btn = document.getElementById("loadFile-btn")
if (loadFile_btn != null) {
  loadFile_btn.onclick = () => {
    saveTosessionStorage('loadPeopleByFile_flag', true)
    saveTosessionStorage('loadPeopleByForm_flag', false)
    readFromFile('./js/people_data.json')
    Toastify({
      text: "PEOPLE LIST LOADED",
      duration: 4000,
      style: {
        background: "linear-gradient(to right, #93d17b, #61d234)",
      }
    }).showToast();
    check_flags_and_load_html()
  }
}

//force age range
const age = document.getElementById("inputAge")
age.onchange = () => {
  if(age.value < 18){
    age.value = 18
    age.innerText = '18'
  }
  if(age.value > 110){
    age.value = 110
    age.innerText = '110'
  }
}

//form signUp button
const signUp_btn = document.getElementById("signUp-btn")
signUp_btn.onclick = () => {
  saveTosessionStorage('loadPeopleByForm_flag', true)
  saveTosessionStorage('loadPeopleByFile_flag', false)
  const phone = document.getElementById("inputPhone")
  const email = document.getElementById("inputEmail")
  const lastname = document.getElementById("inputLastname")
  const firstname = document.getElementById("inputFirstname")
  if (age.value && phone.value && email.value && lastname.value && firstname.value) { //only add person if there aren't null values
    const newPerson = new person(firstname.value, lastname.value, age.value, phone.value, email.value) 
    peopleList.push(newPerson)
    updateCounter()
    saveTosessionStorage('peopleList', peopleList)
  }
}

//pickWinner button
const pickWinner_btn = document.getElementById("pickWinner-btn")
pickWinner_btn.onclick = () => {
  if (peopleList.length == 0){
    Swal.fire(
      'Error',
      'People List is empty. Register or load from file first',
      'error'
    )
    return
  }
  hideWelcomeDiv()
  if (availablePrizes) {
    let winner
    let check_NoWinners = peopleList.some((i) => i.isWinner === false) //there must be at least one person.isWinner == false
    if (check_NoWinners) {
      do {
        winner = getRandomInt(peopleList.length)  //find winner based on: (math.random => array position)
      } while (peopleList[winner].isWinner); //skip if person already won
      peopleList[winner].isWinner = availablePrizes  //flag chosen winner
      renderLastWinner(winner)  //display winner
      winnersCounter++
      availablePrizes--
      updateCounter()
    } else {
      Swal.fire({
        title: 'Wait!',
        text: 'Everyone on the list had already won.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Show Winners'
      }).then((result) => {
        if (result.isConfirmed) {
          renderWinners()
        }
      })
    }
  } else {
    Swal.fire(
      'Wait!',
      'You ran out of prizes!',
      'warning'
    )
  }
}

//functions
function reset(){
  Swal.fire({
    title: 'Caution!',
    text: 'Click Ok to start over. This will erase current people list.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EB6440',
    cancelButtonColor: '#c8ddde',
    confirmButtonText: 'Ok'
  }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('peopleList')
        sessionStorage.removeItem('loadPeopleByForm_flag')
        sessionStorage.removeItem('loadPeopleByFile_flag')
        location.reload()
      }
    } 
  )
}

function getRandomInt(maxNum) {
  return Math.floor(Math.random() * maxNum);
}

function updateCounter(){
  const peopleListCounter = document.getElementById("peopleListCounter")
  const prizeCounter = document.getElementById("prizeCounter")
  peopleListCounter.innerText = `${peopleList.length}`
  prizeCounter.innerText = `${availablePrizes}`
}

function pushPersonToPeopleList(object){
  const {age, email, firstname, lastname, phone} = object
  const newPerson = new person(firstname, lastname, age, phone, email)
  peopleList.push(newPerson)
  saveTosessionStorage('peopleList', peopleList)
  updateCounter()
}

function saveTosessionStorage(key, value){
  sessionStorage.setItem(key, JSON.stringify(value))
}

function readFromsessionStorage(key){
  let dataFromsessionStorage = JSON.parse(sessionStorage.getItem(key))
  return dataFromsessionStorage
}

function readFromFile(filePath){
  fetch(filePath)
  .then( (response) => response.json() )
  .then( (dataArray) => {
    for (const object of dataArray) {
      pushPersonToPeopleList(object)
    }
    updateCounter()
  } )
}

function display_toggle(dom_element) {
  const element = document.getElementById(dom_element)
  element.classList.toggle('display_none')
}

function check_flags_and_load_html(){
  const welcomeDiv = document.getElementById('welcomeDiv')
  const loadPeopleByForm_flag = readFromsessionStorage('loadPeopleByForm_flag') || false
  const loadPeopleByFile_flag = readFromsessionStorage('loadPeopleByFile_flag') || false
  if (!loadPeopleByFile_flag && !loadPeopleByForm_flag){
    welcomeDiv.classList.remove('display_none')
    return
  }
  if (loadPeopleByForm_flag){
    welcomeDiv.innerHTML =  ` <div class="text-center text-color-2">
                                <p class="titleBig m-1">Welcome</p>
                                <p class="titleSmall">Add as manny people as you please.</p>
                                <p class="titleSmall">When finished click 'PICK WINNER'.</p>
                              </div>
                              <div class="flex-media">
                                <button class="btn-secondary m-1" onclick="display_toggle('register-form')">REGISTER</button>
                              </div>
                            `
    welcomeDiv.classList.remove('display_none')
    return
  }
  if (loadPeopleByFile_flag) {
    hideWelcomeDiv()
  }
}

function hideWelcomeDiv () {
  const welcomeDiv = document.getElementById('welcomeDiv')
  welcomeDiv.innerHTML = ''
  welcomeDiv.classList = 'display_none'
}

function renderLastWinner(winner){
  display_toggle('winnerDivParent')
  const winnerDiv = document.getElementById("winnerDiv")
  const imgPath = `./img/prizes/${prizeList[availablePrizes-1].picture}`
  const prizeName = prizeList[availablePrizes-1].name
  const prizeID = prizeList[availablePrizes-1].id
  const winnerName = `${peopleList[winner].firstname} ${peopleList[winner].lastname}`
  winnerDiv.innerHTML = `
                          <div class="card">
                            <img src="${imgPath}" alt="Prize Picture">
                            <div class="cardDescription">
                              <p class="cardTitle">${winnerName}</p>
                              <p class="cardText">You WON!</p>
                              <p class="cardText">Prize Number ${prizeID}</p>
                              <p class="cardTitle">${prizeName}</p>
                            </div>
                          </div>
                          <div>
                            <button type="button" class="btn-secondary px-2 py-1" onclick="display_toggle('winnerDivParent')">GO BACK</button>
                          </div>
                        `
}

function renderWinners(){
  const allWinnersDiv = document.getElementById("allWinnersDiv")
  const buttonsDiv = document.getElementById("buttonsDiv")
  const winnerArray = peopleList.filter( (person) => person.isWinner !== false )
  if(winnerArray.length === 0){
    Toastify({
      text: "No winners yet. Click PICK WINNER first",
      duration: 5000,
      style: {
        background: "linear-gradient(to right, #eb4040, #EB6440)",
      }
    }).showToast();
    return
  }
  winnerArray.sort((a, b) => {
    return (a.isWinner > b.isWinner ? 1 : -1)
    } )
  winnerArray.forEach(winner => {
    const imgPath = `./img/prizes/${prizeList[winner.isWinner-1].picture}`
    const cardContainer = document.createElement("div")
    cardContainer.innerHTML = `
                                <div class="card">
                                  <img src="${imgPath}" alt="Prize Picture">
                                  <div class="cardDescription">
                                    <p class="titleSmall">${winner.firstname} ${winner.lastname}</p>
                                    <p class="cardText">${winner.age} years old</p>
                                    <p class="cardText">${winner.email}</p>
                                    <p class="cardText">Phone: ${winner.phone}</p>
                                    <p class="titleSmall">Winner N°${winner.isWinner}</p>
                                    <p class="titleSmall">Prize ${prizeList[winner.isWinner-1].name}</p>
                                  </div>
                                </div>
                              `
    allWinnersDiv.appendChild(cardContainer)
  });
  allWinnersDiv.classList.remove('display_none')
  buttonsDiv.classList.add('display_none')
}