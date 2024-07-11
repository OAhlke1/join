async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    if (typeof callback === 'function') {
        callback();
    }
}

function showUserMenu (){
    let userMenu = document.getElementById('user-menu');
    userMenu.classList.toggle('d-none');
}

function loadUserInitials() {
    let user = localStorage.getItem('User');
    let initials = document.getElementById('user-button-initials');
    initials.innerHTML = getInitials(user);
}

setTimeout(() => {
    loadUserInitials();
}, 150);

function getInitials(name) {
    let parts = name.split(' ')
    let initials = ''
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].length > 0 && parts[i] !== '') {
            initials += parts[i][0]
        }
    }
    return initials;
}

function logout() {
    localStorage.setItem('User', '');
}

function checkLogin(){
    let user = localStorage.getItem('User');
    if(!user){
        window.location.href = 'login.html';
    }
}

function extractFilename(url) {
    // Erstellen Sie ein URL-Objekt
    const urlObj = new URL(url);
    
    // Extrahieren Sie den Pfad aus der URL
    const pathname = urlObj.pathname;
    
    // Extrahieren Sie den Dateinamen aus dem Pfad
    const filenameWithExtension = pathname.substring(pathname.lastIndexOf('/') + 1);
    
    // Entfernen Sie die Dateierweiterung
    const filename = filenameWithExtension.split('.').slice(0, -1).join('.');
    
    return filename;
  }
  

  function activeLink() {
      setTimeout(() => {
        const url = window.location.href;
        const filename = extractFilename(url);
        console.log(filename); // Gibt 'summary' aus
      console.log(document.getElementById(filename));
        document.getElementById(filename).classList.add('active');
    }, 150);
 
}

activeLink();
  