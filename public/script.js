document.addEventListener("DOMContentLoaded", init, false);

function init(){
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    globalRef = database.ref("users");
    globalRef.on('value', changeBalance);
    userRef = globalRef.child("user1");

    document.getElementById("addIncome").addEventListener("click",addIncome,false);
    document.getElementById("addExpense").addEventListener("click",addExpense,false);
    document.getElementById("extras").addEventListener("click",changeBalance,false);
  

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

function changeBalance(){
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        //console.log("changeBalance called");
        document.getElementById("balance").innerHTML = data.balance;
    });    
}

function updateBalance(amt){
    let data;
    userRef.once('value', (snapshot) => {
        data = snapshot.val();
    });
    userRef.update({
        balance: parseFloat(data.balance) + parseFloat(amt)
      })
        .then(() => {
          console.log("Balance updated");
        })
        .catch((error) => {
          console.error("Error updating balance:", error);
        }); 
}

function addIncome(){
    var income = parseFloat(document.getElementById("income").value);
    var section = document.getElementById("incomeSections").value;
    const incomeData = {
        amount : income,
        section : section
    };
    const incomesRef = userRef.child("incomes");
    incomesRef.push(incomeData)
    .then(() => {
        console.log("Income added successfully!");
    })
    .catch((error) => {
        console.error("Error adding data:", error);
    });

    updateBalance(income);    
    changeBalance();
    document.getElementById("income").value = "";
}


function addExpense(){
    var expense = parseFloat(document.getElementById("expense").value);
    var section = document.getElementById("expenseSections").value;
    const expenseData = {
        amount : expense,
        section : section
    };
    const incomesRef = userRef.child("expenses");
    incomesRef.push(expenseData)
    .then(() => {
        console.log("Expense added successfully!");
    })
    .catch((error) => {
        console.error("Error adding data:", error);
    });
    updateBalance(expense*-1);
    changeBalance();
    document.getElementById("expense").value = "";
}

