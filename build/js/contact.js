const BASE_URL =
  "https://join-249-default-rtdb.europe-west1.firebasedatabase.app/";

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

function init() {
  includeHTML();
  getContacts();
  postData();
}

async function getContacts() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  contacts = responseToJson.contacts;
  sorter();
  addcontactKeys();
}

function sorter() {
  for (let i = 0; i < contacts.length - 1; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      if (contacts[i]["lastName"] > contacts[j]["lastName"]) {
        puffer = contacts[i];
        contacts[i] = contacts[j];
        contacts[j] = puffer;
      } else if (contacts[i]["lastName"] === contacts[i]["lastName"]) {
        if (contacts[i]["sureName"] > contacts[j]["sureName"]) {
          puffer = contacts[i];
          contacts[i] = contacts[j];
          contacts[j] = puffer;
        }
      }
    }
  }
  newChar = contacts[0].lastName[0];
  renderIntoLetterBox();
}

function renderIntoLetterBox() {
  newChar = contacts[contactsIndex].lastName[0];
  getContactsHtml();
  letterBlock += `<h3 class="sort"> ${newChar}</h3>${contactsString}`;
  contactsString = "";
  if (contactsIndex + 1 === contacts.length) {
    showContacts.innerHTML = letterBlock;
    return;
  }
  renderIntoLetterBox();
}

function getContactsHtml() {
  for (let i = contactsIndex; i < contacts.length; i++) {
    contactsIndex = i;
    if (newChar != contacts[i].lastName[0]) {
      return;
    }
    contactsString += ` <div
      class="flex contact"
      onclick="clickContact(event)"
      data-contactIndex="${contactsIndex}">
      <div id="profileImage" class="flex-center">
        ${contacts[i].sureName[0]}${contacts[i].lastName[0]}
      </div>
      <div class="gap"> 
        <li>${contacts[i].sureName} ${contacts[i].lastName}</li>
        <span>${contacts[i].email}</span>
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
<div id="profileImage" class="flex-center bigSize">${contacts[index]["sureName"][0]}${contacts[index]["lastName"][0]}</div>
<div>
<span> 
${contacts[index]["sureName"]}
${contacts[index]["lastName"]}</span>
   <div><img src="./assets/img/editContacts.png" alt="" onclick="editContact()">
       <img src="./assets/img/DeleteContact.png" alt="">
      </div>
  </div>
  </div>
  <div class="contactInformations">
  <p>Contact Information</p>
  <div>
      <h5>Email</h5>
      <span> ${contacts[index]["email"]}</span>
      <h5>Phone</h5>
      <span> ${contacts[index]["number"]}</span>
  </div>
</div>`;
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return responseToJson = await response.json();
  ;
}

function createContact(){
let name = document.querySelector(".inputName").value;
let email = document.querySelector(".inputEmail").value;
let number = document.querySelector(".inputNumber").value;
console.log(name);

postData("/contacts",{"name":name,"email":email,"number":number});
getContacts();
addContactToggle()
}







function addcontactKeys() {
  for (let [key] of Object.entries(contacts)) {
    contactKeys.push(key);
    console.log(contactKeys);
  }
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
