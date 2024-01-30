document.addEventListener("DOMContentLoaded", init, false);
function init(){
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    globalRef = database.ref("users");
    userRef = globalRef.child("user1");
    
    globalRef.on('value', updateData);
    globalRef.on('value', addChart);
    document.getElementById("addCredit").addEventListener("click",updateCredit,false);
    document.getElementById("addDebt").addEventListener("click",updateDebt,false);
    document.getElementById("changeGraphSource").addEventListener("change",changeGraphSource,false);
    document.getElementById("changeChart").addEventListener("change",changeChart,false);

    isFirstLoad = true;
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

let data;
let isFirstLoad;
function updateData(){
    userRef.on('value', (snapshot) => {
        data = snapshot.val();
        document.getElementById("balance").innerHTML = data.balance;
        document.getElementById("totalCredit").innerHTML = data.totalCredit;
        document.getElementById("totalDebt").innerHTML = data.totalDebt;
    });
    if(isFirstLoad){
        document.getElementById("name").innerHTML = data.name;
        isFirstLoad = false;
        graphSource = "debt";
        graphType = "pie";
    }
    console.log("data extracted");
}

function updateCredit(){
    const creditAmount = parseInt(document.getElementById("creditAmount").value);
    const creditName = document.getElementById("creditName").value;

    if(creditAmount == "" || creditName == ""){
        document.getElementById("creditError").innerHTML = "Amount or Name cannot be empty";
        return ;
    }    

    const currentDate = new Date();    
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const creditData = {
        amount : creditAmount,
        name : creditName,
        date : date,
        time : time
    };
    const creditsRef = userRef.child("credits");
    creditsRef.push(creditData)
    .then(() => {
        userRef.update({
            totalCredit: parseFloat(data.totalCredit) + parseFloat(creditAmount)
          })
            .then(() => {
              console.log("Credit updated");
            })
            .catch((error) => {
              console.error("Error updating credit:", error);
            });   
        console.log("Credit added successfully!");
    })
    .catch((error) => {
        console.error("Error adding data:", error);
    });
    
    document.getElementById("creditAmount").value = "";
    document.getElementById("creditName").value = "";
    document.getElementById("creditError").innerHTML = "";

}

function updateDebt(){
    const debtAmount = parseInt(document.getElementById("debtAmount").value);
    const debtName = document.getElementById("debtName").value;

    if(debtAmount == "" || debtName == ""){
        document.getElementById("debtError").innerHTML = "Amount or Name cannot be empty";
        return ;
    }    

    const currentDate = new Date();    
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const debtData = {
        amount : debtAmount,
        name : debtName,
        date : date,
        time : time
    };
    const debtRef = userRef.child("debts");
    debtRef.push(debtData)
    .then(() => {
        userRef.update({
            totalDebt: parseFloat(data.totalDebt) + parseFloat(debtAmount)
          })
            .then(() => {
              console.log("Debt updated");
            })
            .catch((error) => {
              console.error("Error updating credit:", error);
            });   
        console.log("Debt added successfully!");
    })
    .catch((error) => {
        console.error("Error adding data:", error);
    });
    
    document.getElementById("debtAmount").value = "";
    document.getElementById("debtName").value = "";
    document.getElementById("debtError").innerHTML = "";
}

function changeGraphSource(){
    console.log("changeGraphSource");
    graphSource = document.getElementById("changeGraphSource").value;
    addChart();
}

function changeChart(){
    console.log("changeChart");    
    graphType = document.getElementById("changeChart").value;
    addChart();
}

let graphSource;
let graphType;
let debtChart;
function addChart() {

    userRef.once('value')
    .then((snapshot) => {
        newData = snapshot.val();
        
        let debtData = graphSource == "debt" ? newData.debts : newData.credits;
        
        const names = [];
        const counts = [];
        const amounts = [];
        
        for (const debtID in debtData) {
            const debt = debtData[debtID];
            const name = debt.name;
            const amount = debt.amount;
            
            const index = names.indexOf(name);
            if (index !== -1) {
                counts[index]++;
                amounts[index] += amount;
            } else {
                names.push(name);
            counts.push(1);
            amounts.push(amount);
            }
        }
        
        const ctx = document.getElementById('debtChart').getContext('2d');
        
        if(debtChart){
            debtChart.destroy();
        }
        
        debtChart = new Chart(ctx, {
            type: graphType,
            data: {
                labels: names,
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
    })
    .catch((error) => {
        console.error("Error adding chart:", error);
    });
}