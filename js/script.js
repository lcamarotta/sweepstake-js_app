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
  constructor(prize_name, description, file_name){
    this.name = prize_name;
    this.description = description;
    this.file = file_name;
  }
}