const BASE_URL =
  "https://join-249-default-rtdb.europe-west1.firebasedatabase.app";

let contacts = [];
let puffer;
let newChar;
let letterBlock = ``;
let contactsString = "";
let contactsIndex = 0;
let showContacts = document.querySelector("#showContact");
let toggleEditContact = true;
let toggleAddContact = true;
let toggleInfoContact = true;
let contactKeys = [];
let sureLastName;
let nameSuffix = false;
let newContact;
let q = 0;
let presentlyIndexContacts;
let information = document.querySelector(".informationPopUp");

function init() {
  includeHTML();
  getContacts();
}

async function getContacts() {
  contacts = await fetch(BASE_URL + "/contacts.json");
  contacts = await contacts.json();
  setContactsAsArray();
  sorter();
}

function sorter() {
  contacts.sort((a, b) => {
    if (a[1].lastName > b[1].lastName) {
      return 1;
    } else if (a[1].lastName < b[1].lastName) {
      return -1;
    } else {
      return a[1].sureName > b[1].sureName ? 1 : (a[1].sureName < b[1].sureName ? -1 : 0);
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
    letterBlock += `<h3 class="sort"> ${newChar}</h3>${contactsString}`;
    contactsString = "";
  }
  if (contactsIndex === contacts.length) {
    showContacts.innerHTML = letterBlock;
    return;
  }
  renderIntoLetterBox();
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
  return ` <div
      class="flex contact"
      onclick="clickContact(event)"
      data-contactIndex="${contactsIndex}">
      <div id="profileImage" class="flex-center" style="background-color: ${color};" >
        ${contacts[q][1].sureName[0]}${contacts[q][1].lastName[0]}
      </div>
      <div class="gap"> 
        <li>${contacts[q][1].sureName} ${contacts[q][1].lastName}</li>
        <span>${contacts[q][1].email}</span>
      </div>
    </div>`;
}

let color;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
   color = '#0';
  for (let i = 0; i < 5; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function clickContact(event) {

  event.stopPropagation();
   presentlyIndexContacts = +event.target
    .closest(".contact")
    .getAttribute("data-contactIndex");

  information.innerHTML = clickContactHTML(presentlyIndexContacts);
}

function clickContactHTML(index) {
  getRandomColor();
  return ` <div class="flex showContactName">
      <div id="profileImage" class="flex-center bigSize"  style="background-color: ${color};">
        ${contacts[index][1]["sureName"][0]}${contacts[index][1]["lastName"][0]}
      </div>
      <div>
        <span>
          ${contacts[index][1]["sureName"]}
          ${contacts[index][1]["lastName"]}</span
        >
        <div>
          <img
            src="./assets/img/editContacts.png"
            alt=""
            onclick="startingValueEditContact(${index})"
          />
          <img
            src="./assets/img/DeleteContact.png"
            alt=""
            onclick="deleteContact(${presentlyIndexContacts})"
          />
        </div>
      </div>
    </div>
    <div class="contactInformations">
      <p>Contact Information</p>
      <div>
        <h5>Email</h5>
        <span> ${contacts[index][1]["email"]}</span>
        <h5>Phone</h5>
        <span> ${contacts[index][1]["number"]}</span>
      </div>
    </div>`;
   
}

function startingValueEditContact(index){
let name = document.querySelector(".inputEditName");
let email= document.querySelector(".inputEditEmail");
let number = document.querySelector(".inputEditNumber");
let letters = document.querySelector(".editContactImg")

name.value= contacts[index][1]["sureName"] +" "+ contacts[index][1]["lastName"];
email.value= contacts[index][1]["email"];
number.value= contacts[index][1]["number"];
letters.innerHTML = contacts[index][1]["sureName"][0] + contacts[index][1]["lastName"][0];


editContactToggle()
}

function editContact(){
let name = document.querySelector(".inputEditName");
let email= document.querySelector(".inputEditEmail");
let number = document.querySelector(".inputEditNumber");
sureLastName = document.querySelector(".inputEditName").value.split(" ");

editContactToggle();
deleteContact(presentlyIndexContacts);
setTimeout(function() {
  createContact(email, number, name, sureLastName);
}, 100);


}

function deleteContact(index) {
  deleteData("/contacts/" + contacts[index][0]);
  contacts.splice(index, 1);
  letterBlock = "";
  contactsIndex = 0;
  q = 0;
  information.innerHTML="";
  renderIntoLetterBox();
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

function createContactValue(){
  let email = document.querySelector(".inputEmail");
  let number = document.querySelector(".inputNumber");
  let name =  document.querySelector(".inputName");
  sureLastName = document.querySelector(".inputName").value.split(" ");
  createContact(email,number,name,sureLastName);
  addContactToggle();
}

function createContact(email,number,name,sureLastName) {
  if (sureLastName.length == 1) {
    sureLastName.push("");
  }
  convertNames();
  newContact = {sureName: sureLastName[0],lastName: sureLastName[1],email: email.value,number: number.value, color: `#${Math.round(255*Math.random()).toString(16)}${Math.round(255*Math.random()).toString(16)}${Math.round(255*Math.random()).toString(16)}`, contactId: Math.random()};
  contacts.push([contacts.length + 1, newContact]);
  resetValue(email,number,name)
  postData("/contacts", newContact);
  getContacts();
}

function resetValue(email,number,name){
  email.value="";
  number.value="";
  name.value="";
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
    rest = sureLastName[i].slice(1, sureLastName[i].length);
    sureLastName[i] = sureLastName[i][0].toUpperCase() + rest;
  }

  hasNameSuffix();
}

function hasNameSuffix() {
  if (!nameSuffix) {
    return;
  }

  sureLastName = [sureLastName[0], sureLastName[1] + " " + sureLastName[2]];
}

function setContactsAsArray() {
  let contacsKeysArray = [];
  for (let [key, value] of Object.entries(contacts)) {
    contacsKeysArray.push([key, value]);
  }
  contacts = contacsKeysArray;
}

function editContactToggle() {
  let editContact = document.querySelector(".editContactMainContainer");
  if (toggleEditContact) {
    editContact.classList.remove("d-none");
    toggleEditContact = false;
  } else {
    editContact.classList.add("d-none");
    toggleEditContact = true;
  }
}

function addContactToggle() {
  let addContact = document.querySelector(".addContactMainContainer");
  if (toggleAddContact) {
    addContact.classList.remove("d-none");
    toggleAddContact = false;
  } else {
    addContact.classList.add("d-none");
    toggleAddContact = true;
  }
}
