document.addEventListener("DOMContentLoaded", init, false);

function init() {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();

    auth = firebase.auth();

    globalRef = database.ref("users");
    auth.onAuthStateChanged(user => {
        if (user) {
            userRef = globalRef.child(user.uid);
            userRef.on('value', (snapshot) => {
                const data = snapshot.val();
        
                document.getElementById("name").innerHTML = data.name;
                document.getElementById("balance").innerHTML = data.balance;
        
                function addTableRow(id, amount, section, date, time) {
                    const table = document.getElementById("data-table");
                    const row = table.insertRow();
                    const cellAmount = row.insertCell(0);
                    const cellSection = row.insertCell(1);
                    const cellDate = row.insertCell(2);
                    const cellTime = row.insertCell(3);
        
                    cellAmount.innerHTML = amount;
                    cellSection.innerHTML = section;
                    cellDate.innerHTML = date || "";
                    cellTime.innerHTML = time || "";
                }
        
                Object.entries(data.expenses).forEach(([id, transaction]) => {
                    addTableRow(id, transaction.amount, transaction.section, transaction.date, transaction.time);
                });
                Object.entries(data.incomes).forEach(([id, transaction]) => {
                    addTableRow(id, transaction.amount, transaction.section, transaction.date, transaction.time);
                });
        
            });
        }
        else{
            window.location.href = "login.html";
        }
    });
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