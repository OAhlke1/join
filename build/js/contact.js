const BASE_URL =
  "https://join-249-default-rtdb.europe-west1.firebasedatabase.app";

let contacts = [];
let puffer;
let newChar;
let char;
let letterBlock = ``;
let contactsString = "";
let contactsIndex = 0;
let showContacts = document.querySelector("#showContact");
let toggleEditContact = true;
let toggleAddContact = true;
let contactKeys = [];
let sureLastName;
let nameSuffix = false;
let newContact;

function init() {
  includeHTML();
  getContacts();
  // postData();
}

async function getContacts() {
  contacts = await fetch(BASE_URL + "/contacts.json");
  contacts = await contacts.json();
  // contacts = responseToJson.contacts;
  setContactsAsArray();
  sorter();
}

// let contactKeysPuffer;
let objectKey = Object.keys(contacts);

function sorter() {
  console.log(contacts);
  for (let i = 0; i < contacts.length - 1; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      if (contacts[i][1]["lastName"] > contacts[j][1]["lastName"]) {
        //   let contactKeysPuffer =  Object.keys(contacts)[i];
        //   Object.keys(contacts)[i] =  Object.keys(contacts)[j];
        //   Object.keys(contacts)[j] = contactKeysPuffer;

        puffer = contacts[i];
        contacts[i] = contacts[j];
        contacts[j] = puffer;

        // contacts[i][1]

        // let contactKeysPuffer = contactKeys[i];
        // contactKeys[i] = contactKeys[j];
        // contactKeys[j] = contactKeysPuffer;

        // contactKeysPuffer = contactKeys[i];
        // contactKeys[i] = contactKeys[j];
        // contactKeys[j] = contactKeysPuffer;
      } else if (contacts[i][1]["lastName"] === contacts[j][1]["lastName"]) {
        if (contacts[i][1]["sureName"] > contacts[j][1]["sureName"]) {
          puffer = contacts[i];
          contacts[i] = contacts[j];
          contacts[j] = puffer;
        }
      }
    }
  }
  newChar = contacts[0][1]["lastName"][0];

  // addcontactKeys();
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
let q = 0;
function getContactsHtml() {
  for (contactsIndex = q; q < contacts.length; q++) {
    if (contactsIndex == contacts.length) {
      return;
    }
    contactsIndex = q;
    if (newChar != contacts[q][1].lastName[0]) {
      // continue;
      return;
    }

    contactsString += ` <div
      class="flex contact"
      onclick="clickContact(event)"
      data-contactIndex="${contactsIndex}">
      <div id="profileImage" class="flex-center">
        ${contacts[q][1].sureName[0]}${contacts[q][1].lastName[0]}
      </div>
      <div class="gap"> 
        <li>${contacts[q][1].sureName} ${contacts[q][1].lastName}</li>
        <span>${contacts[q][1].email}</span>
      </div>
    </div>`;
  }
}

function clickContact(event) {
  let information = document.querySelector(".informationPopUp");
  event.stopPropagation();
  let index = +event.target
    .closest(".contact")
    .getAttribute("data-contactIndex");
  console.log(index);

  information.innerHTML = `
          <div class="flex showContactName">
<div id="profileImage" class="flex-center bigSize">${contacts[index][1]["sureName"][0]}${contacts[index][1]["lastName"][0]}</div>
<div>
<span> 
${contacts[index][1]["sureName"]}
${contacts[index][1]["lastName"]}</span>
   <div><img src="./assets/img/editContacts.png" alt="" onclick="editContact()">
       <img src="./assets/img/DeleteContact.png" alt="" onclick= "deleteContact(${index})">
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

function deleteContact(index) {
  deleteData("/contacts/" + contacts[index][0]);
  contacts.splice(index, 1);
  // delete contacts[index];
  letterBlock = "";
  // contacts.innerHTML = "";
  contactsIndex = 0;
  q = 0;

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

function createContact() {
  sureLastName = document.querySelector(".inputName").value.split(" ");

  if (sureLastName.length == 1) {
    sureLastName.push("");
  }

  let email = document.querySelector(".inputEmail").value;
  let number = document.querySelector(".inputNumber").value;

  convertNames();
  newContact ={
    sureName: sureLastName[0],
    lastName: sureLastName[1],
    email: email,
    number: number,
  };
  addContactToggle();
  
  contacts.push([contacts.length + 1,newContact ]);
  showContacts.innerHTML="";
debugger;
  contactsIndex = 0;
  // newChar = contacts[contactsIndex][1]["lastName"][0].toUpperCase();
  // sorter();
  q =0;
  letterBlock = "";
  newChar= "A";
  postData("/contacts", newContact);
  getContacts();
  // renderIntoLetterBox()
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
  contactKeys = [];
  for (let [key, value] of Object.entries(contacts)) {
    contacsKeysArray.push([key, value]);
  }
  contacts = contacsKeysArray;
}

function editContact() {
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
