var allInputs = document.querySelectorAll('input');
let userUrl = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/user';
let userValue = document.getElementById('mail-login');
let userName;
let userEmail;
let password = document.getElementById('password-login');
let loginSuccess = false;
let error = document.getElementById('error-message');
let signUserName = document.getElementById('name-signin');
let signUserEmail = document.getElementById('mail-signin');
let signUserPassword = document.getElementById('password-signin');
let signUserPasswordConfirm = document.getElementById('confirm-passwordsignin');
let confirmationSign = document.getElementById('confirmation_sign');
let logoBig = document.querySelector('.logo-big .svgCont .svgCont-inner');
let logoBigWidth = logoBig.offsetWidth;
let logoBigHeight = logoBig.offsetHeight;
let logoBigTop = logoBig.getBoundingClientRect().top;
let logoBigPositionLeft = logoBig.getBoundingClientRect().left;
let logoSmall = document.querySelector('#logo-desktop');
let logoSmallWidth = logoSmall.offsetWidth;
let logoSmallHeight = logoSmall.offsetHeight;
let logoSmallPositionTop = logoSmall.getBoundingClientRect().top;
let logoSmallPositionLeft = logoSmall.getBoundingClientRect().left;

function init() {
    setupShrinking();
    rememberMe();
}

/**
 * 
 * @function setupShrinking sets the top and left position of the big logo.
 * At first it was not absolutely positioned, so that its parents display flex centeres it.
 * That ensures, that the big logo is not flickering at first from the upper left corner to the center, but is set to the viewports
 * center right at the beginning.
 * But after function call gets that position type for making the effect work properly.
 * Then, after a quater of a second, it calls the @function shrinkLogoBig if the width of the viewport is greater than 825 pixels.
 */
function setupShrinking() {
    logoBig.style.top = `${(window.innerHeight - logoBigHeight)/2}px`;
    logoBig.style.left = `${(window.innerWidth - logoBigWidth)/2}px`;
    logoBig.style.position = "absolute";
    if (window.innerWidth > 825) {
        setTimeout(shrinkLogoBig, 250);
    } else {
        logoBig.classList.add('disNone');
        focused();
    }
}

/**
 * 
 * @param {number} p is the the amount of promille for each the difference in
 *      width and height
 *      and the top and left position
 * of the big and small logo.
 * At the beginning, p = 1000, and therefore 1000 promille of each differences are added to the width, height, top and left position
 * of the small logo. 
 * But then, p gets smaller, and therefore only a fraction of the entire differences is added to the widht, height top and left position
 * of the small logo until eventually, the big logo is at the same spot as the small logo an of the same size.
 * Then, when the big logo is of the same width as the small logo, the big logo is hidden.
 * @returns 
 */
function shrinkLogoBig(p = 1000) {
    logoBig.style.top = `${logoSmallPositionTop + (logoBigTop - logoSmallPositionTop)*p/1000}px`;
    logoBig.style.left = `${logoSmallPositionLeft + (logoBigPositionLeft - logoSmallPositionLeft)*p/1000}px`;
    logoBig.style.width = `${logoSmallWidth + (logoBigWidth-logoSmallWidth)*p/1000}px`;
    logoBig.style.height = `${logoSmallHeight + (logoBigHeight-logoSmallHeight)*p/1000}px`;
    if(logoBig.offsetWidth <= logoSmallWidth) {
        document.querySelector('.logo-big').classList.add('disNone');
        return;
    }
    p -= 20;
    setTimeout(()=>{shrinkLogoBig(p)}, 10);
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
 * Load users from database for checking them.
 * 
 * @returns 
 */
async function loadUser() {
    let data = await fetch(userUrl + '.json');
    return await data.json();
}

/**
 * 
 * @function checkLogin checks if the user exists
 * 
 */
async function checkLogin() {
    let data = await loadUser();
    for (const property in data) {
        if (data[property].email === userValue.value && data[property].password === password.value) {
            userName = data[property].name;
            userEmail = data[property].email;
            loginSuccess = true;
            setLocalStorageForUser();
            break;
        }
    }
    if (loginSuccess) {
        setLocalStorageForUser();
    } else {
        error.innerHTML = 'Check your email and password. Please try again.';
    }
}

/**
 * 
 * @function setLocalStorageForUser sets the name and mail-adress of the found user to the browsers local storage.
 */
function setLocalStorageForUser() {
    localStorage.setItem('User', userName);
    localStorage.setItem('Email', userEmail);
    if (document.getElementById('rememberMe').checked) {
        localStorage.setItem('Remember', true);
    } else {
        localStorage.setItem('Remember', '');
    }
    window.location.href = 'summary.html';
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

/**
 * 
 * Shows succesfully Sign up information
 * 
 */
function fadeInConfirmationSign() {
    confirmationSign.classList.remove('d-none');
    confirmationSign.classList.remove('not-added');
    confirmationSign.classList.add('added');
    setTimeout(fadeOutConfirmationSign, 1000);
}

/**
 * 
 * Hides succesfully Sign up information
 * 
 */
function fadeOutConfirmationSign() {
    confirmationSign.classList.remove('added');
    confirmationSign.classList.add('not-added');
    setTimeout(()=>{
        confirmationSign.classList.add('d-none');
        showLogInForm();
    }, 700);
}

/**
 * 
 * Validate the input value fot the name
 * 
 */
function validateName() {
    let error = document.getElementById('error-message-name');
    let name = document.getElementById('name-signin').value;
    let nameRegex = /^[A-Za-zÄÖÜäöüß\s]+$/;
    if (!nameRegex.test(name)) {
      error.classList.remove('disNone');
    } else {
      error.classList.add('disNone');
    }
  }

  /**
 * 
 * Validate the input value fot the email
 * 
 */
  function validateEmail() {
    let error = document.getElementById('error-message-email');
    let email = document.getElementById('mail-signin').value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      error.classList.remove('disNone');
    } else {
      error.classList.add('disNone');
    }
  }

  /**
 * 
 * Checks if passwords match
 * 
 */
  function checkPasswordInput() {
    let password = document.getElementById('password-signin');
    let passwordConfirm = document.getElementById('confirm-passwordsignin');
    let error = document.getElementById('sign-error-message');
    if (!password.value !== '') {
      if (password.value !== passwordConfirm.value) {
        error.innerHTML = "Your passwords don't match. Please try again.";
      } else {
        error.innerHTML = "";
      }
    }
  }