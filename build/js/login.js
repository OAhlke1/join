var allInputs = document.querySelectorAll('input');
var logoBig = document.querySelector('.logo-big');
var logoBigWidth = logoBig.offsetWidth;
var logoBigHeight = logoBig.offsetHeight;
let userUrl = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/user';
let userValue = document.getElementById('mail-login');
let password = document.getElementById('password-login');
let error = document.getElementById('error-message');
let signUserName = document.getElementById('name-signin');
let signUserEmail = document.getElementById('mail-signin');
let signUserPassword = document.getElementById('password-signin');
let signUserPasswordConfirm = document.getElementById('confirm-passwordsignin');
let confirmationSign = document.getElementById('confirmation_sign');


function init() {
    toStartAtBeginning();
    rememberMe();
}

function toStartAtBeginning() {
    document.querySelector('.logo-big').style.aspectRatio = window.innerWidth / window.innerHeight;
    if (window.innerWidth > 825) {
        setTimeout(() => { shrinkLogoBig() }, 250);
    } else {
        logoBig.classList.add('disNone');
        document.querySelector('.topBar').classList.remove('disNone');
        document.querySelector('.form-block').classList.remove('disNone');
        document.querySelector('.terms-and-cond').classList.remove('disNone');
    }
    focused();
}

function shrinkLogoBig() {
    logoBig.classList.add('shrinking');
    setTimeout(() => {
        logoBig.classList.add('disNone');
        document.querySelector('.topBar').classList.remove('disNone');
        document.querySelector('.form-block').classList.remove('disNone');
        document.querySelector('.terms-and-cond').classList.remove('disNone');
    }, 720)
}

function focused() {
    allInputs.forEach((elem) => {
        if (elem.type != "checkbox") {
            elem.addEventListener('focus', () => {
                elem.classList.add('noBg');
                elem.setAttribute('placeholder', '');
            })
            elem.addEventListener('focusout', () => {
                elem.classList.remove('noBg');
                setPlaceholder(elem);
            })
        }
    })
}

function setPlaceholder(elem) {
    if (elem.id === "mail-login" || elem.id === "mail-signin") {
        elem.setAttribute('placeholder', 'Email');
    } else if (elem.id === "password-login" || elem.id === "password-signin") {
        elem.setAttribute('placeholder', 'Password');
    } else if (elem.id === "confirm-passwordsignin") {
        elem.setAttribute('placeholder', 'Confirm Password');
    } else if (elem.id === "name-signin") {
        elem.setAttribute('placeholder', 'Name');
    } 
}

function showLogInForm() {
    document.querySelector('#login').classList.remove('disNone');
    document.querySelector('#signup').classList.add('disNone');
    if (window.innerWidth <= 768) {
        document.querySelector('.sign-up-mobile').classList.remove('disNone');
    }
}

function showSignUpForm() {
    document.querySelector('#login').classList.add('disNone');
    document.querySelector('#signup').classList.remove('disNone');
    if (window.innerWidth <= 768) {
        document.querySelector('.sign-up-mobile').classList.add('disNone');
    }
}

/**
 * 
 * Load users from database to check it
 * 
 * @returns 
 */
async function loadUser() {
    let res = await fetch(userUrl + '.json');
    let data = await res.json();

    return data;
}

/**
 * 
 * Checks if the user exists
 * 
 */
async function checkLogin() {
    let data = await loadUser();
    let loginSuccess = false;
    let userName;
    let userEmail;
    let remember = document.getElementById('rememberMe').checked;

    for (const property in data) {
        if (data[property].email === userValue.value && data[property].password === password.value) {
            userName = data[property].name;
            userEmail = data[property].email;
            loginSuccess = true;
            break;
        }
    }

    if (loginSuccess) {
        localStorage.setItem('User', userName);
        localStorage.setItem('Email', userEmail);
        if (remember) {
            localStorage.setItem('Remember', true);
        } else {
            localStorage.setItem('Remember', '');
        }
        window.location.href = 'summary.html';
    } else {
        error.innerHTML = 'Check your email and password. Please try again.';
    }
}


/**
 * 
 * Load guest user without log in
 * 
 */
function checkLoginGuest() {
    localStorage.setItem('User', 'Guest');
    window.location.href = 'summary.html';
}


/**
 * 
 * If clicked on remember me by log in put an value to local storage
 * 
 */
function rememberMe() {
    let status = localStorage.getItem('Remember');
    if (status) {
        let email = localStorage.getItem('Email');
        userValue.value = email;
        document.getElementById('rememberMe').checked = true;
    }
}


/**
 * 
 * Check if the user already exists and prove the data that put in the fields
 * 
 */
async function checkSignUp() {
    document.getElementById('sign-error-message').innerHTML = '';
    if (signUserName.value !== '' && signUserEmail.value !== '' && signUserPassword.value !== '' && signUserPasswordConfirm.value !== '') {
        if (signUserPassword.value === signUserPasswordConfirm.value) {
            let data = {
                "email": signUserEmail.value,
                "name": signUserName.value,
                "password": signUserPassword.value
            }
            let users = await loadUser();
            let userExistsFirebase = false;

            for (const key in users) {
                if (users[key].email === signUserEmail.value) {
                    document.getElementById('sign-error-message').innerHTML = "User already exists! Please try again.";
                    userExistsFirebase = true; 
                    break; 
                }
            }
            if (!userExistsFirebase) {
                fadeInConfirmationSign();
                signUp(data);
                showLogInForm();
            }

        } else {
            document.getElementById('sign-error-message').innerHTML = "Your passwords don't match. Please try again.";
        }
    } else {
        document.getElementById('sign-error-message').innerHTML = "Something missed! Please fill all fields";
    }
}

/**
 * 
 * Post the new User to the database
 * 
 * @param {*} data 
 * @returns 
 */
async function signUp(data = {}) {
    let res = await fetch(userUrl + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return resToJson = await res.json();
}

/**
 * 
 * Enable the button if policy is accepted and if not disabled it
 * 
 */
function acceptPolicy() {
    let checkBox = document.getElementById('acceptPp');
    let button = document.getElementById('signInButton');
    if (checkBox.checked === true) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', 'true');
    }
}


function fadeInConfirmationSign() {
    confirmationSign.classList.remove('d-none');
    confirmationSign.classList.remove('not-added');
    confirmationSign.classList.add('added');
    setTimeout(fadeOutConfirmationSign, 1000);
}


function fadeOutConfirmationSign() {
    confirmationSign.classList.remove('added');
    confirmationSign.classList.add('not-added');
    setTimeout(()=>{
        confirmationSign.classList.add('d-none');
    }, 700);
}


