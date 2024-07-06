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
let toggle = true;

function init() {
  includeHTML();
  getContacts();
}

async function getContacts() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  contacts = responseToJson.contacts;
  sorter();
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
    contactsString += ` <div class="flex contact" onclick="clickContact(event)" data-contactIndex="${contactsIndex}"><div id="profileImage" class="flex-center">${contacts[i].sureName[0]}${contacts[i].lastName[0]}</div><div class="gap"><li>${contacts[i].sureName} ${contacts[i].lastName}</li><span>${contacts[i].email}</span></div></div>`;
  }
}

function clickContact(event) {
  let information = document.querySelector(".informationPopUp")
  event.stopPropagation();
  console.log(contacts[+event.target.getAttribute('data-contactIndex')]);

information.innerHTML =`
          <div class="flex showContactName">
<div id="profileImage" class="flex-center bigSize">${contacts[+event.target.getAttribute('data-contactIndex')]["sureName"][0]}${contacts[+event.target.getAttribute('data-contactIndex')]["lastName"][0]}</div>
<div>
<span> Anton Meyer </span>
   <div><img src="./assets/img/editContacts.png" alt="" onclick="editContact()">
       <img src="./assets/img/DeleteContact.png" alt="">
      </div>
  </div>
  </div>
  <div class="contactInformations">
  <p>Contact Information</p>
  <div>
      <h5>Email</h5>
      <span> ${contacts[+event.target.getAttribute('data-contactIndex')]["email"]}</span>
      <h5>Phone</h5>
      <span> ${contacts[+event.target.getAttribute('data-contactIndex')]["number"]}</span>
  </div>
</div>`


} 

function editContact(){
  let editContact = document.querySelector(".editContactMainContainer")
  if(toggle){
    editContact.classList.remove("d-none");
    toggle = false;
  }else{
  editContact.classList.add("d-none");
  toggle = true;
}
}

// function render() {
//   let showContacts = document.getElementById("showContact");
//   let letter = document.getElementById("sort");

//   for (let i = 0; i < contacts.length; i++) {
//     if (contacts[i]["entries"].length > 0) {
//       letter.innerHTML += `${contacts[i]["start"]}`;
//     }

//     for (let j = 0; j < contacts[i]["entries"].length; j++) {
//       showContacts.innerHTML += `
// <div class="flex">
//    <div id="profileImage" class="flex-center">AM</div>
//     <div class="gap">
//      <li>${contacts[i]["entries"][j]["name"]}</li>
//      <span>${contacts[i]["entries"][j]["email"]}</span>
//     </div>
// </div>`;
//     }
//   }
// }
