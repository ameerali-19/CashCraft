document.addEventListener("DOMContentLoaded", init, false);

let globalRef;
function init(){
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    globalRef = database.ref("users");
    userRef = globalRef.child("user1");

    document.getElementById("addIncome").addEventListener("click",addIncome,false);
    document.getElementById("addExpense").addEventListener("click",addExpense,false);
    document.getElementById("extras").addEventListener("click",getBalance,false);

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

globalRef.on('value', getBalance);
function getBalance(){
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("DB updates", data);
        document.getElementById("balance").innerHTML = data.balance;
    });    
}


function addIncome(){
    
}


function addExpense(){

    var expense = document.getElementById("expense").value;
    userRef.update({
        balance: expense
      })
        .then(() => {
          console.log("New balance = ",expense);
        })
        .catch((error) => {
          console.error("Error updating balance:", error);
        }); 
    
    getBalance();
}

