const BASE_URL =
  "https://join-249-default-rtdb.europe-west1.firebasedatabase.app";

let contacts = [];
let tasks = [];
let puffer;
let newChar;
let letterBlock = ``;
let contactsString = "";
let contactList = document.querySelector(".contactList");
let contactsIndex = 0;
let showContacts = document.querySelector("#showContact");
let toggleEditContact = true;
let toggleAddContact = true;
let toggleInfoContact = false;
let contactKeys = [];
let sureLastName;
let nameSuffix = false;
let newContact;
let q = 0;
let presentlyIndexContacts;
let information = document.querySelector(".informationPopUp");
let color;

function init() {
  includeHTML();
  getContacts();
  checkForEmptyLetterBoxes();
}

async function getContacts() {
  contacts = await fetch(BASE_URL + "/contacts.json");
  contacts = await contacts.json();
  getTasks();
  setContactsAsArray();
  sorter();
}

function closeOverlaysWithEscape(event) {
  if(event.key === "Escape") {
    toggleAddContact = false;
    toggleEditContact = false;
    addContactToggle();
    editContactToggle();
  }
}

async function getTasks() {
  let response = await fetch(BASE_URL + "/tasks.json");
  response = await response.json();
  for (let [key, value] of Object.entries(response)) {
    tasks.push(value);
  }
}

function setContactsAsArray() {
  let contacsKeysArray = [];
  for (let [key, value] of Object.entries(contacts)) {
    contacsKeysArray.push([key, value]);
  }
  contacts = contacsKeysArray;
}

function sorter() {
  contacts.sort((a, b) => {
    if (a[1].lastName > b[1].lastName) {
      return 1;
    } else if (a[1].lastName < b[1].lastName) {
      return -1;
    } else {
      return a[1].sureName > b[1].sureName
        ? 1
        : a[1].sureName < b[1].sureName
        ? -1
        : 0;
    }
  });
  renderIntoLetterBox();
}

function renderIntoLetterBox() {
  if (contacts.length === 0) {
    showContacts.innerHTML = "";
  }
  newChar = contacts[contactsIndex][1]["lastName"][0];
  getContactsHtml();
  if (contactsIndex < contacts.length) {
    letterBlock += `<h3 class="sort">${newChar}</h3>${contactsString}`;
    contactsString = "";
  }
  if (contactsIndex === contacts.length) {
    showContacts.innerHTML = structuredClone(letterBlock);
    checkForEmptyLetterBoxes();
    return;
  }
  renderIntoLetterBox();
}

/**
 * 
 * @function checkForEmptyColumns checks whether a contact is the user and if it 
 */
function checkForEmptyLetterBoxes() {
  document.querySelectorAll('h3.sort').forEach((elem)=>{
    if(document.querySelectorAll(`#showContact .contact[contact-firstletter="${elem.innerHTML}"].d-none`).length === document.querySelectorAll(`#showContact .contact[contact-firstletter="${elem.innerHTML}"]`).length) {
      elem.classList.add('d-none');
    }
  })
}

function getContactsHtml() {
  for (contactsIndex = q; q < contacts.length; q++) {
    if (contactsIndex == contacts.length) {
      return;
    }
    contactsIndex = q;
    if (newChar != contacts[q][1].lastName[0]) {
      return;
    }

    contactsString += contactHTML(contactsIndex, q);
  }
}

function contactHTML(contactsIndex, q) {
  getRandomColor();
  return `<div class="flex contact c-${contactsIndex} ${contacts[contactsIndex][1].contactId == localStorage.UserId ? 'd-none' : ''}" onclick="clickContact(event)" data-contactIndex="${contactsIndex}" contact-firstletter="${newChar}">
      <div class="flex-center profileImage" style="background-color: ${
        contacts[contactsIndex][1].color
      };" >
       ${profileName(q)}
      </div>
      <div class="gap"> 
        <li>${contacts[q][1].sureName} ${contacts[q][1].lastName}</li>
        <span>${contacts[q][1].email}</span>
      </div>
    </div>`;
}

function profileName(q) {
  if (contacts[q][1].sureName == "") {
    return `${contacts[q][1].lastName[0]}`;
  } else {
    return `${contacts[q][1].sureName[0]}${contacts[q][1].lastName[0]}`;
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  color = "#0";
  for (let i = 0; i < 5; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function clickContact(event) {
  toggleInfoContact = true;
  if (window.innerWidth < 1100) {
    showHideContactNames();
  }
  event.stopPropagation();
  presentlyIndexContacts = +event.target
    .closest(".contact")
    .getAttribute("data-contactIndex");

  focusContact();
  information.innerHTML = clickContactHTML(presentlyIndexContacts);
}

function focusContact() {
  let contact = document.querySelector(`.c-${presentlyIndexContacts}`);

  for (let i = 0; contacts.length > i; i++) {
    let contact = document.querySelector(`.c-${i}`);
    contact.classList.remove("contactFocus");
  }
  contact.classList.add("contactFocus");
}

function showHideContactNames() {
  if (window.innerWidth <= 950 && toggleInfoContact) {
    contactList.classList.add("d-none");
    information.classList.remove("d-none");
  } else if (window.innerWidth > 950 && toggleInfoContact) {
    contactList.classList.remove("d-none");
  }else{
    contactList.classList.remove("d-none");
  }
}

// Funktion beim Ändern der Fenstergröße aufrufen
window.onresize = function () {
  showHideContactNames();
};

function hideContact() {
  if (window.innerWidth < 950) {
    contactList.classList.remove("d-none");
    information.classList.add("d-none");
  }
}

function clickContactHTML(index) {
  return ` 
  <div class="flex showContactName">
    
      <div class="flex-center bigSize profileImage"  style="background-color: ${contacts[index][1]["color"]};">
        ${profileName(index)}
      </div>
      <div>
        <span>
          ${contacts[index][1]["sureName"]}
          ${contacts[index][1]["lastName"]}
        </span>
        <div>
          <img src="./assets/img/editContacts.png" alt="" onclick="startingValueEditContact(${index})"/>
          <img src="./assets/img/DeleteContact.png" alt="" onclick="deleteContact(${presentlyIndexContacts})"
          />
        </div>
      </div>
      <img class="backArrow" onclick="hideContact()" src="./assets/img/backArrow.png" alt="">
    </div>
     
    <div class="contactInformations">
      <p>Contact Information</p>
      <div>
        <h5>Email</h5>
        <span> ${contacts[index][1]["email"]}</span>
        <h5>Phone</h5>
        <a  href="tel:${contacts[index][1]["number"]}"> ${
    contacts[index][1]["number"]
  }</a>
      </div>
      </div>
       <img class="meunContactOptions" src="./assets/img/menuContactOptions.png" alt="">
      `;
}

function startingValueEditContact(index) {
  let name = document.querySelector(".inputEditName");
  let email = document.querySelector(".inputEditEmail");
  let number = document.querySelector(".inputEditNumber");
  let letters = document.querySelector(".editContactImg");
  document.querySelector('.flex-center.bigSize.editContactImg.profileImage.merge').style.background = `${contacts[presentlyIndexContacts][1].color}`;
  name.value =
    contacts[index][1]["sureName"] + " " + contacts[index][1]["lastName"];
  email.value = contacts[index][1]["email"];
  number.value = contacts[index][1]["number"];
  letters.innerHTML = profileName(index);

  editContactToggle();
}

function editContact() {
  let name = document.querySelector(".inputEditName");
  let email = document.querySelector(".inputEditEmail");
  let number = document.querySelector(".inputEditNumber");
  sureLastName = document.querySelector(".inputEditName").value.trimStart().split(" ");
  editContactToggle();
  deleteContact(presentlyIndexContacts);
  createContact(email, number, name, sureLastName);
}

function deleteContact(index) {
  deleteContactFromAllTasks(contacts[index][1].contactId);
  deleteData("/contacts/" + contacts[index][0]);
  contacts.splice(index, 1);
  letterBlock = "";
  contactsIndex = 0;
  q = 0;
  // if()
  information.innerHTML = "";
  // showContacts.innerHTML = "";
  toggleInfoContact = false;
  // getContacts()
  renderIntoLetterBox();
  showHideContactNames()
}

function deleteContactFromAllTasks(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].participants) {
      for (let j = 0; j < tasks[i].participants.length; j++) {
        if (tasks[i].participants[j].contactId === id) {
          tasks[i].participants.splice(j, 1);
        }
      }
    }
  }
  repostTasks();
}

async function repostTasks() {
  let response = await fetch(BASE_URL + "/tasks.json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
  });
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

function createContactValue(event) {
  event.preventDefault();
  let email = document.querySelector(".inputEmail");
  let number = document.querySelector(".inputNumber");
  let name = document.querySelector(".inputName");
  sureLastName = document.querySelector(".inputName").value.split(" ");
  createContact(email, number, name, sureLastName);
  let contactId = Math.random();
  // contactSuccessfullyCreated();
  addContactToggle();
}

async function createContact(email, number, name, sureLastName) {
  if (sureLastName.length == 1) {
    sureLastName.unshift("");
  }
  convertNames();
  newContact = {
    sureName: sureLastName.length === 2 ? sureLastName[0] : '',
    lastName: sureLastName.length === 2 ? sureLastName[1] : sureLastName[0],
    email: email.value,
    number: number.value,
    color: `#${Math.round(255*Math.random()).toString(16).length === 2 ? Math.round(255*Math.random()).toString(16) : '0'+Math.round(255*Math.random()).toString(16)}${Math.round(255*Math.random()).toString(16).length === 2 ? Math.round(255*Math.random()).toString(16) : '0'+Math.round(255*Math.random()).toString(16)}${Math.round(255*Math.random()).toString(16).length === 2 ? Math.round(255*Math.random()).toString(16) : '0'+Math.round(255*Math.random()).toString(16)}`,
    contactId: Math.random(),
  };
  contacts.push([contacts.length + 1, newContact]);
  resetValue(email, number, name);
  //  postData("/contacts", newContact).then(() => {

  //   getContacts();
  //  })

  await postData("/contacts", newContact);
  await getContacts();
}

function contactSuccessfullyCreated() {
  let mainContainer = document.querySelector(".mainContainer");
  mainContainer.innerHTML += `
<div class="contactSuccessfullyCreated">
  <img src="./assets/img/contactSuccessfullyCreated.png" alt="contactSuccessfullyCreated">
</div>
`;
}

function resetValue(email, number, name) {
  email.value = "";
  number.value = "";
  name.value = "";
  showContacts.innerHTML = "";
  contactsIndex = 0;
  q = 0;
  letterBlock = "";
  newChar = "A";
}

function convertNames() {
  let rest;

  for (let i = 0; i < sureLastName.length; i++) {
    if (sureLastName[i] === "von" || sureLastName[i] === "zu") {
      nameSuffix = true;
      continue;
    }
    if (sureLastName[i].length > 0) {
      rest = sureLastName[i].slice(1, sureLastName[i].length);
      sureLastName[i] = sureLastName[i][0].toUpperCase() + rest;
    }
  }
  hasNameSuffix();
}

function hasNameSuffix() {
  if (!nameSuffix) {
    return;
  }

  sureLastName = [sureLastName[0], sureLastName[1] + " " + sureLastName[2]];
}

function editContactToggle() {
  let editContact = document.querySelector(".overlayEdit-parent");
  document.querySelector('.flex-center.bigSize.editContactImg.profileImage.merge').innerHTML = `<div class="flex flex-center" style="width: 100%; height: 100%;">
    <p class="editContactInitials">${contacts[presentlyIndexContacts][1].sureName ? contacts[presentlyIndexContacts][1].sureName[0] : ""}${contacts[presentlyIndexContacts][1].lastName ? contacts[presentlyIndexContacts][1].lastName[0] : ""}</p>
  </div>`;
  if (!toggleEditContact) {
    editContact.classList.add("d-none");
    toggleEditContact = true;
  } else {
    editContact.classList.remove("d-none");
    toggleEditContact = false;
  }
}

function addContactToggle() {
  let addContact = document.querySelector(".overlay-parent");
  if (!toggleAddContact) {
    addContact.classList.add("d-none");
    toggleAddContact = true;
  } else {
    addContact.classList.remove("d-none");
    toggleAddContact = false;
  }
}

function backgroundClickedAdd(event) {
  // Check if the clicked target is the overlay and not a child element
  if (event.target === event.currentTarget) {
    // Call your function here
    addContactToggle();
  }
}

function backgroundClickedEdit(event) {
  if (event.target === event.currentTarget) {
    editContactToggle();
  }
}