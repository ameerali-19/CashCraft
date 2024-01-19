document.addEventListener("DOMContentLoaded", init, false);

function init(){
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    globalRef = database.ref("users");
    globalRef.on('value', updateBalance);
    userRef = globalRef.child("user1");

    document.getElementById("addIncome").addEventListener("click",addIncome,false);
    document.getElementById("addExpense").addEventListener("click",addExpense,false);
    document.getElementById("extras").addEventListener("click",updateBalance,false);
  

    console.log("init");
}


const firebaseConfig = {
    apiKey: "AIzaSyDwZ4DRzgDSKfei6jd6_u4sJf3cVECV3nE",
    authDomain: "cashcraftfinances.firebaseapp.com",
    databaseURL: "https://cashcraftfinances-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cashcraftfinances",
    storageBucket: "cashcraftfinances.appspot.com",
    messagingSenderId: "722045083194",
    appId: "1:722045083194:web:f7bb83002d2da07a32df03",
    measurementId: "G-1PWK0RT8N6"
};

function updateBalance(){
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        //console.log("updateBalance called");
        document.getElementById("balance").innerHTML = data.balance;
    });    
}


function addIncome(){
    var income = parseFloat(document.getElementById("income").value);
    let data;
    userRef.once('value', (snapshot) => {
        data = snapshot.val();
    });
    
    userRef.update({
        balance: income + parseFloat(data.balance)
      })
        .then(() => {
          console.log("Balance updated");
        })
        .catch((error) => {
          console.error("Error updating balance:", error);
        }); 
    
    updateBalance();
    document.getElementById("income").value = "";
}


function addExpense(){

    var expense = parseFloat(document.getElementById("expense").value);
    let data;
    userRef.once('value', (snapshot) => {
        data = snapshot.val();
    });
    
    userRef.update({
        balance: parseFloat(data.balance) - expense 
      })
        .then(() => {
          console.log("Balance updated");
        })
        .catch((error) => {
          console.error("Error updating balance:", error);
        }); 
    
    updateBalance();
    document.getElementById("expense").value = "";
}

