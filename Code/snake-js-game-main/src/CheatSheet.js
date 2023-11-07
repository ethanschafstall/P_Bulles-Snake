class User {
    name;
    constructor(name) 
    {}
  }
  
  
  alert(typeof User); // function
  User(); // Error: Class constructor User cannot be invoked without 'new'
  
  let User = class {
    sayHi() {
      alert("Hello");
    }
  };