var allInputs = document.querySelectorAll('input');
var logoBig = document.querySelector('.logo-big');
var logoBigWidth = logoBig.offsetWidth;
var logoBigHeight = logoBig.offsetHeight;
let userUrl = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/user';
let userValue = document.getElementById('mail-login');
let password = document.getElementById('password-login');
let error = document.getElementById('error-message');

function init () {
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
    } else if (elem.id === "password-login" || elem.id === "password-signin" || elem.id === "confirm-password-signin") {
        elem.setAttribute('placeholder', 'Password');
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

async function loadUser() {
    let res = await fetch(userUrl + '.json');
    let data = await res.json();

    return data;
}

async function checkLogin() {
    let data = await loadUser();
    let loginSuccess = false;
    let userName;
    let userEmail;
    let remember = document.getElementById('rememberMe').checked;

    data.forEach((user) => {
        if (user.email === userValue.value && user.password === password.value) {
            userName = user.name;
            userEmail = user.email;
            loginSuccess = true;
        }
    });

    if (loginSuccess) {
        localStorage.setItem('User', userName);
        localStorage.setItem('Email', userEmail);
        if (remember) {
            localStorage.setItem('Remember', true);
        }
        window.location.href = 'summary.html';
    } else {
        error.innerHTML = 'Wrong password Ups! Try Again.';
    }
}

function rememberMe() {
    let status = localStorage.getItem('Remember');
    if (status) {
        let email = localStorage.getItem('Email');
        userValue.value = email;
    }
}


