document.addEventListener("DOMContentLoaded", init, false);
function init(){
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    globalRef = database.ref("users");
    userRef = globalRef.child("user1");
    
    globalRef.on('value', changeBalance);
    globalRef.on('value', addChart);
    document.getElementById("addIncome").addEventListener("click",addIncome,false);
    document.getElementById("addExpense").addEventListener("click",addExpense,false);
    document.getElementById("accStatement").addEventListener("click",function(){
        window.location.href = "accountstatement/accountstatement.html"
    },false);
    document.getElementById("debt").addEventListener("click",function(){
        window.location.href = "debt/debt.html"
    },false);
    document.getElementById("changeChart").addEventListener("change",changeChart,false);
    document.getElementById("changeGraphSource").addEventListener("change",changeGraphSource,false);
    
    graphSourceFlag = 0;

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

//Changes the balances and the chart in the HTML page
let data;
let graphSourceFlag;
function changeBalance(){
    userRef.on('value', (snapshot) => {
        data = snapshot.val();
        document.getElementById("balance").innerHTML = data.balance;
        document.getElementById("name").innerHTML = data.name;
    });
    if(graphSourceFlag == 0){
        graphSource = graphSource != data.incomes ? data.expenses : data.incomes;
        graphSourceFlag = 1;
    }
    console.log("data extracted");
}

//Updates the balance in the Database
function updateBalance(amt){
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
        updateBalance(income);    
        console.log("Income added successfully!");
    })
    .catch((error) => {
        console.error("Error adding data:", error);
    });
    
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
    document.getElementById("expense").value = "";
    document.getElementById("expenseSections").value = "";
    document.getElementById("addExpenseError").innerHTML = "";
}

let chartType = "pie";
function changeChart(){
    chartType = chartType === "pie" ? "bar" : "pie" ; 
    addChart();
}
let expenseChart;
let graphSource;
function changeGraphSource(){
    const selectedOption = document.getElementById("changeGraphSource").value;
    graphSource = selectedOption == "expenses" ? data.expenses : data.incomes;
    addChart();
}

function addChart() {

    let expensesData = graphSource;
        
    const sections = [];
    const counts = [];
    const amounts = [];
        
    for (const expenseId in expensesData) {
        const expense = expensesData[expenseId];
        const section = expense.section;
        const amount = expense.amount;
            
        const index = sections.indexOf(section);
        if (index !== -1) {
            counts[index]++;
            amounts[index] += amount;
        } else {
            sections.push(section);
            counts.push(1);
            amounts.push(amount);
            }
        }
            
        const ctx = document.getElementById('expenseChart').getContext('2d');
            
        if(expenseChart){
            expenseChart.destroy();
        }
            
        expenseChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: sections,
                datasets: [{
                    data: amounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(32, 133, 236, 0.7)',
                        'rgba(206, 169, 188, 0.7)',
                        'rgba(50, 50, 50, 0.7)',
                    ],
                    borderWidth: 0,
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
    console.log("Chart creation completed");
}