document.addEventListener("DOMContentLoaded", init, false);

function init(){
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    globalRef = database.ref("users");
    userRef = globalRef.child("user1");
    
    globalRef.on('value', changeBalance);
    document.getElementById("addIncome").addEventListener("click",addIncome,false);
    document.getElementById("addExpense").addEventListener("click",addExpense,false);
    document.getElementById("accStatement").addEventListener("click",accStatement,false);
  
    addChart();
    
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

//Changes the balances in the HTML page
function changeBalance(){
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        //console.log("changeBalance called");
        document.getElementById("balance").innerHTML = data.balance;
    });   
    addChart(); 
}

//Updates the balance in the Database
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
    if(expense == "" || section == ""){
        document.getElementById("addIncomeError").innerHTML = "Amount or Section cannot be empty";
        return ;
    }    
    const currentDate = new Date();    
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const incomeData = {
        amount : income,
        section : section,
        date : date,
        time : time
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
    document.getElementById("incomeSections").value = "";
    document.getElementById("addIncomeError").innerHTML = "";
}


function addExpense(){
    var expense = parseFloat(document.getElementById("expense").value);
    var section = document.getElementById("expenseSections").value;
    if(expense == "" || section == ""){
        document.getElementById("addExpenseError").innerHTML = "Amount or Section cannot be empty";
        return ;
    }   
    const currentDate = new Date();    
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const expenseData = {
        amount : expense,
        section : section,
        date : date,
        time : time
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
    document.getElementById("expenseSections").value = "";
    document.getElementById("addExpenseError").innerHTML = "";
}

function accStatement(){
    console.log("Check");
    window.location.href = "accountstatement.html"
}

let expenseChart;
function addChart() {
    userRef.child("expenses").once('value')
        .then((snapshot) => {
            const expensesData = snapshot.val();

            // Rest of the code to process and display the chart...
            const sections = [];
            const counts = [];

            for (const expenseId in expensesData) {
                const expense = expensesData[expenseId];
                const section = expense.section;

                const index = sections.indexOf(section);
                if (index !== -1) {
                    counts[index]++;
                } else {
                    sections.push(section);
                    counts.push(1);
                }
            }

            const ctx = document.getElementById('expenseChart').getContext('2d');

            if(expenseChart){
                expenseChart.destroy();
            }

            expenseChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: sections,
                    datasets: [{
                        data: counts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            // Add more colors as needed
                        ],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Expense Distribution by Section',
                    },
                },
            });
        })
        .catch((error) => {
            console.error("Error fetching expenses data:", error);
        });
}