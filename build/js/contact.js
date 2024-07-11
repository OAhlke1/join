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




function init() {
  includeHTML();
  getContacts();
  postData();
}

async function getContacts() {
contacts  = await fetch(BASE_URL  + "/contacts.json");
  contacts = await contacts.json();
  // contacts = responseToJson.contacts;
  addcontactKeys();
  sorter();
  addcontactKeys();
}

function sorter() {
  for (let i = 0; i < contactKeys.length - 1; i++) {
    for (let j = i + 1; j < contactKeys.length; j++) {
      if (contacts[contactKeys[i]]["lastName"] > contacts[contactKeys[j]]["lastName"]) {
        puffer = contacts[contactKeys[i]];
        contacts[contactKeys[i]] = contacts[contactKeys[j]];
        contacts[contactKeys[j]] = puffer;
      } else if (contacts[contactKeys[i]]["lastName"] === contacts[contactKeys[i]]["lastName"]) {
        if (contacts[contactKeys[i]]["sureName"] > contacts[contactKeys[j]]["sureName"]) {
          puffer = contacts[contactKeys[i]];
          contacts[contactKeys[i]] = contacts[contactKeys[j]];
          contacts[contactKeys[j]] = puffer;
        }
      }
    }
  }
  newChar = contacts[0].lastName[0];
  renderIntoLetterBox();
}

function renderIntoLetterBox() {
  newChar = contacts[contactKeys[contactsIndex]].lastName[0];
  getContactsHtml();
  letterBlock += `<h3 class="sort"> ${newChar}</h3>${contactsString}`;
  contactsString = "";
  if (contactsIndex + 1 === contactKeys.length) {
    showContacts.innerHTML = letterBlock;
    return;
  }
  renderIntoLetterBox();
}

function getContactsHtml() {
  for (let i = contactsIndex; i < contactKeys.length; i++) {
    if (contactsIndex == contactKeys.length){
           return;
    }
          contactsIndex = i;
    if (newChar != contacts[contactKeys[i]].lastName[0]) {
      return;
    }
    contactsString += ` <div
      class="flex contact"
      onclick="clickContact(event)"
      data-contactIndex="${contactsIndex}">
      <div id="profileImage" class="flex-center">
        ${ contacts[contactKeys[i]].sureName[0]}${ contacts[contactKeys[i]].lastName[0]}
      </div>
      <div class="gap"> 
        <li>${ contacts[contactKeys[i]].sureName} ${ contacts[contactKeys[i]].lastName}</li>
        <span>${ contacts[contactKeys[i]].email}</span>
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
 sureLastName = document.querySelector('.inputName').value.split(' ');

if(sureLastName.length == 1){
  sureLastName.push("");
}

let email = document.querySelector(".inputEmail").value;
let number = document.querySelector(".inputNumber").value;


convertNames();
postData("/contacts",{"sureName":sureLastName[0],"lastName":sureLastName[1],"email":email,"number":number});
getContacts();
addContactToggle()
getContacts();
}



function convertNames(){
let rest;

for (let i = 0; i < sureLastName.length; i++) {
 if (sureLastName[i] === "von"|| sureLastName[i] ==="zu" ) {
  nameSuffix = true;
  continue;
 }
rest = sureLastName[i].slice(1, sureLastName[i].length)
sureLastName[i] = sureLastName[i][0].toUpperCase() + rest;

}

hasNameSuffix();
}


function hasNameSuffix(){
if (!nameSuffix){
  return;
}

sureLastName = [sureLastName[0], sureLastName[1] + " " + sureLastName[2]]
console.log(sureLastName);

}







function addcontactKeys() {
  for (let [key,value] of Object.entries(contacts)) {
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
