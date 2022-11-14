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
class prize {
  constructor(prize_id, name, pic_path){
    this.id = prize_id;
    this.name = name;
    this.picture = pic_path;
  }
}
//get DOM elements
const loadFile_btn = document.getElementById("loadFile-btn")      //LOAD FILE button
const openForm_btn = document.getElementById("openForm-btn")      //MANUAL REGISTER button
const age = document.getElementById("inputAge")                   //AGE form field
const signUp_btn = document.getElementById("signUp-btn")          //SIGN UP form button
const pickWinner_btn = document.getElementById("pickWinner-btn")  //PICK WINNER form button
const reset_btn = document.getElementById("reset-btn")            //RESET button

//code
let peopleList = readFromLocalStorage('peopleList') || []
let prizeList = readFromLocalStorage('prizeList') || []
if(prizeList.length === 0) readFromFile('./js/prize_data.json', 'prizeData')
let winnersCounter = 0
let availablePrizes = prizeList.length
updateCounter()
check_flags_and_load_html()

//read from file button
loadFile_btn.onclick = () => {
  saveToLocalStorage('loadPeopleByFile_flag', true)
  saveToLocalStorage('loadPeopleByForm_flag', false)
  readFromFile('./js/people_data.json', 'peopleData')
  Toastify({
    text: "PEOPLE LIST LOADED",
    duration: 4000,
    style: {
      background: "linear-gradient(to right, #c8ddde, #3f6264)",
    }
  }).showToast();
  check_flags_and_load_html()
  
}

//open form
openForm_btn.onclick = () => {
  const register_form = document.getElementById("register-form")
  register_form.classList.remove('display_none')
}

//force age range
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
signUp_btn.onclick = () => {
  saveToLocalStorage('loadPeopleByForm_flag', true)
  saveToLocalStorage('loadPeopleByFile_flag', false)
  const phone = document.getElementById("inputPhone")
  const email = document.getElementById("inputEmail")
  const lastname = document.getElementById("inputLastname")
  const firstname = document.getElementById("inputFirstname")
  if (age.value && phone.value && email.value && lastname.value && firstname.value) { //only add person if there aren't null values
    const newPerson = new person(firstname.value, lastname.value, age.value, phone.value, email.value) 
    peopleList.push(newPerson)
    updateCounter()
    saveToLocalStorage('peopleList', peopleList)
  }
}

//pickWinner button
pickWinner_btn.onclick = () => {
  if (peopleList.length == 0){
    Swal.fire(
      'Error',
      'People List is empty',
      'error'
    )
    return
  }
  if (availablePrizes) {
    let winner
    let check_NoWinners = peopleList.some((i) => i.isWinner === false) //there must be at least one person.isWinner == false
    if (check_NoWinners) {
      do {
        winner = getRandomInt(peopleList.length)  //find winner based on: (math.random => array position)
      } while (peopleList[winner].isWinner); //skip if person already won
      peopleList[winner].isWinner = true  //flag chosen winner
      renderLastWinner(winner)  //display winner
      // renderEveryWinner() //pendiente armar funcion
      winnersCounter++
      availablePrizes--
      updateCounter()
    } else {
      Swal.fire({
        title: 'Wait!',
        text: 'Everyone on the list had won at least once.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'RESTART'
      }).then(() => {
        localStorage.clear()
        location.reload()
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

//reset button
reset_btn.onclick = () => {
  Swal.fire({
    title: 'Wait!',
    text: 'Click Ok if you want to start over. This will erase current people list.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EB6440',
    cancelButtonColor: '#c8ddde',
    confirmButtonText: 'Ok'
  }).then(() => {
      localStorage.removeItem('peopleList')
      localStorage.removeItem('loadPeopleByForm_flag')
      localStorage.removeItem('loadPeopleByFile_flag')
      location.reload()
    } 
  )
} 

//functions
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
  saveToLocalStorage('peopleList', peopleList)
  updateCounter()
}

function pushPrizeToList(object){
  const {id, name, picture} = object
  const newPrize = new prize(id, name, picture)
  prizeList.push(newPrize)
  saveToLocalStorage('prizeList', prizeList)
}

function saveToLocalStorage(key, value){
  localStorage.setItem(key, JSON.stringify(value))
}

function readFromLocalStorage(key){
  let dataFromLocalStorage = JSON.parse(localStorage.getItem(key))
  return dataFromLocalStorage
}

function readFromFile(filePath, option){
  fetch(filePath)
  .then( (response) => response.json() )
  .then( (dataArray) => {
    for (const object of dataArray) {
      if (option === 'peopleData') {
        pushPersonToPeopleList(object)
      } else {
        pushPrizeToList(object)
      }
    }
    updateCounter()
  } )
}

function check_flags_and_load_html(){
  const welcomeDiv = document.getElementById('welcomeDiv')
  const loadPeopleByForm_flag = readFromLocalStorage('loadPeopleByForm_flag') || false
  const loadPeopleByFile_flag = readFromLocalStorage('loadPeopleByFile_flag') || false
  if (!loadPeopleByFile_flag && !loadPeopleByForm_flag){
    welcomeDiv.classList.remove('display_none')
    return
  }
  if (loadPeopleByForm_flag){
    welcomeDiv.innerHTML =  ` <div class="text-center text-color-2">
                                <p class="titleBig m-1">Welcome</p>
                                <p class="titleSmall">Add as manny people as you please.</p>
                              </div>
                              <div class="flex-media">
                                <button class="btn-secondary m-1" id="openForm-btn">REGISTER</button>
                              </div>
                            `
    welcomeDiv.classList.remove('display_none')
    return
  }
  if (loadPeopleByFile_flag) {
    welcomeDiv.innerHTML = ''
    welcomeDiv.classList = ''
  }
}

function renderLastWinner(winner){
  const winnerDiv = document.getElementById("winnerDiv")
  const imgPath = `./img/prizes/${prizeList[availablePrizes-1].picture}`
  const prizeName = prizeList[availablePrizes-1].name
  const winnerName = `${peopleList[winner].firstname} ${peopleList[winner].lastname}`
  winnerDiv.innerHTML = `
                          <div class="card">
                            <img src="${imgPath}" alt="Prize Picture">
                            <div class="cardDescription">
                              <p class="cardTitle">You WON!</p>
                              <p class="cardText">${prizeName}</p>
                              <p class="cardTitle">${winnerName}</p>
                            </div>
                          </div>
                        `
}