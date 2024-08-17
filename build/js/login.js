var allInputs = document.querySelectorAll('input');
let userUrl = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/user';
let userValue = document.getElementById('mail-login');
let password = document.getElementById('password-login');
let error = document.getElementById('error-message');
let signUserName = document.getElementById('name-signin');
let signUserEmail = document.getElementById('mail-signin');
let signUserPassword = document.getElementById('password-signin');
let signUserPasswordConfirm = document.getElementById('confirm-passwordsignin');
let confirmationSign = document.getElementById('confirmation_sign');
let logoBig = document.querySelector('.logo-big .svgCont .svgCont-inner');
let logoBigWidth;
let logoBigHeight;
let logoBigTop;
let logoBigLeft;
let logoSmall = document.querySelector('#logo-desktop');
let logoSmallWidth;
let logoSmallHeight;
let logoSmallTop;
let logoSmallLeft;

function init() {
    toStartAtBeginning();
    rememberMe();
}

function toStartAtBeginning() {
    logoBigWidth = logoBig.offsetWidth;
    logoBigHeight = logoBig.offsetHeight;
    logoBig.style.position = "absolute";
    logoBig.style.top = `${(window.innerHeight - logoBigHeight)/2}px`;
    logoBig.style.left = `${(window.innerWidth - logoBigWidth)/2}px`;
    logoBigTop = logoBig.getBoundingClientRect().top;
    logoBigLeft = logoBig.getBoundingClientRect().left;
    logoSmallWidth = logoSmall.offsetWidth;
    logoSmallHeight = logoSmall.offsetHeight;
    logoSmallTop = logoSmall.getBoundingClientRect().top;
    logoSmallLeft = logoSmall.getBoundingClientRect().left;
    if (window.innerWidth > 825) {
        setTimeout(shrinkLogoBig, 250);
    } else {
        logoBig.classList.add('disNone');
        focused();
    }
}

function shrinkLogoBig(p = 1000) {
    logoBig.style.top = `${logoSmallTop + (logoBigTop - logoSmallTop)*p/1000}px`;
    logoBig.style.left = `${logoSmallLeft + (logoBigLeft - logoSmallLeft)*p/1000}px`;
    logoBig.style.width = `${logoSmallWidth + (logoBigWidth-logoSmallWidth)*p/1000}px`;
    logoBig.style.height = `${logoSmallHeight + (logoBigHeight-logoSmallHeight)*p/1000}px`;
    if(logoBig.offsetWidth <= logoSmallWidth) {
        document.querySelector('.logo-big').classList.add('disNone');
        focused();
        return;
    }
    p -= 20;
    setTimeout(()=>{shrinkLogoBig(p)}, 10);
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
                signUp(data);
                fadeInConfirmationSign();
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
        showLogInForm();
    }, 700);
}