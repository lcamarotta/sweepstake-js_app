class person {
  constructor(firstname, lastname, age, phone, email){
    this.firstname = firstname;
    this.lastname = lastname;
    this.age = age;
    this.phone = phone;
    this.email = email;
    this.isWinner= false;
  }
}

let peopleList = []
let peopleCounter = document.getElementById("peopleCounter")

//register button
let enroll = document.getElementById("enroll-btn")
enroll.onclick = (e) => {
  e.preventDefault()
  let firstname = document.getElementById("inputFirstname")
  let lastname = document.getElementById("inputLastname")
  let age = document.getElementById("inputAge")
  let phone = document.getElementById("inputPhone")
  let email = document.getElementById("inputEmail")

  peopleList.push( new person(firstname.value, lastname.value, age.value, phone.value, email.value) )
  peopleCounter.innerText = `${peopleList.length}` //display enrolled people number
}

//sweepstake button
const pickWinner = document.getElementById("pickWinner-btn")
pickWinner.onclick = () => {
  const peopleList_noWinners = peopleList.filter( (i) => i.isWinner === false)  //filter out people who already won
  if (peopleList_noWinners.length == 0) alert('Todas las personas registradas ya ganaron al menos una vez. Se debe registrar mas personas o resetear los ganadores')
  let winner = getRandomInt(peopleList_noWinners.length)  //find winner based on: (math.random => array position)
  peopleList[winner].isWinner = true  //flag winner
  renderWinner(winner)  //display winner
}

//show winners
const showWinner = document.getElementById("showWinner-btn")

//functions:
function getRandomInt(maxNum) {
  return Math.floor(Math.random() * maxNum);
}

function renderWinner(winner){
  let winnerDiv = document.getElementById("winnerDiv")
  winnerDiv.innerHTML = `
                          <div class="container setBorder">
                            <p class="titleBig mb-1">Saliste Sorteado!</p>
                            <p class="titleSmall mb-1">${peopleList[winner].firstname} ${peopleList[winner].lastname}</p>
                            <p class="my-0">Tel: ${peopleList[winner].phone}</p>
                            <p class="my-0">email: ${peopleList[winner].email}</p>
                          </div>
                        `
  winnerDiv.className = "col my-5"
}