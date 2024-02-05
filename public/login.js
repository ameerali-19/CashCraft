//import { getAuth, signInWithEmailAndPassword } from "/node_modules/firebase/auth/";
//Firebase configuration
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
let auth;
let database;

document.addEventListener("DOMContentLoaded", init, false);

// Initializes the whole document with necessary parameters
// Adds event listeners for every component necessary
function init() {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    database = firebase.database();

    document.getElementById("signIn").addEventListener("click",login,false);
    document.getElementById("signUp").addEventListener("click",register,false);
    document.getElementById("forgotPassword").addEventListener("click",forgotPassword,false);
    document.getElementById("passwordReset").addEventListener("click",passwordReset,false);

    console.log("init");
}


function login(){
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email,password)
    .then(()=>{
        const user = auth.currentUser;
        console.log(user.uid);
        window.location.href = "home.html";
    })
    .catch((error)=>{
        document.getElementById("signInError").innerHTML = "Invalid username or password";
        console.log(error.message);
        console.log(error.code);
    });
}

//validates email and password
function validateEmail(email){
    flag = true;
    var validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!(email.match(validEmailRegex))){
        flag = false;
    }
    return flag;
}

function validatePassword(password){
    flag = true;
    if(password.length<6){
        flag = false;
    }
    return flag;
}

function register(){
    var email = document.getElementById("newUsername").value;
    var password = document.getElementById("newPassword").value;
    var name = document.getElementById("name").value;
    var balance = document.getElementById("balance").value;

    if(!validateEmail(email)){
        document.getElementById("signUpError").innerHTML = "Invalid user name.Use a proper email.";
        return
    }
    
    if(!validatePassword(password)){
        document.getElementById("signUpError").innerHTML = "Password must be atleast 6 characters.";
        return
    }

    auth.createUserWithEmailAndPassword(email,password)
    .then(()=>{
        var user = auth.currentUser;

        const userData = {
            name : name,
            balance : balance,
            totalCredit : 0,
            totalDebt : 0
        }
    
        database.ref().child('users/' + user.uid).set(userData)
        .then(()=>{
            console.log("User added to DB"+user.uid);
            window.location.href = "home.html";
        })
        .catch((error)=>{
            console.log(error);
        });
    
    })
    .catch(()=>{
        document.getElementById("signUpError").innerHTML = "Error creating user";
        console.log(error.message);
        console.log(error.code);
    });
}

function forgotPassword(){
    document.getElementById('login').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'block';
}

function passwordReset(){
    var email = document.getElementById("forgotUsername").value;
    auth.sendPasswordResetEmail(email)
    .then(()=>{
        alert("Password reset email send");
        window.location.href = "login.html";
    })
    .catch(()=>{
        console.log("email not send");
    });
}