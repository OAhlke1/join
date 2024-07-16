const BASE_URL =
  "https://join-249-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];
let puffer;

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

// function sorter() {
//   for (let i = 0; i < contacts.length - 1; i++) {
//     for (let j = i + 1; j < contacts.length; j++) {
//       if (contacts[i]["lastName"] > contacts[j]["lastName"]) {
//         puffer = contacts[i];
//         contacts[i] = contacts[j];
//         contacts[j] = puffer;
//       }
//     }
//   }
//   console.log(contacts);
//   renderIntoLetterBox();
// }

// let newChar;
// let char;
// let contactIndex = 0;
// // function render() {
// // //  renderIntoLetterBox();
// //   let letter = document.getElementById("sort");

// //   letter.innerHTML += `
// //       ${firstChar}
// //     <div class="flex">
// //       ${renderIntoLetterBox()}
// //       <div>
// // `;
// // }

// function renderIntoLetterBox() {
//   let showContacts = document.getElementById("showContact");
//   let letter = document.getElementById("sort");

//   for (let i = 0; i < contacts.length; i++) {
//     if (contacts[i].lastName[0] != newChar) {
//       newChar = contacts[i].lastName[0];
//       showContacts.innerHTML += `
//       <h3 id="sort"> ${newChar}</h3>
     
//       ${renderContactHTML()}
//      `;
//     } else {
//       showContacts.innerHTML += `
    
//     <h3 id="sort"> ${newChar}</h3>
//      <div class="flex ">
// <div id="profileImage" class="flex-center">AM</div>
// <div class="gap">
//   <li>${contacts[i].sureName} ${contacts[i].lastName}</li>
//   <span>${contacts[i].email}</span>
// </div>
// </div>
//    `;
//     }
//   }
  
// }


// function renderContactHTML(){
//   let contactsHTML = "";

//  for (let i = 0; i < contacts.length; i++) {
//   if(contacts[i].lastName[0] != newChar) {
//      newChar = contacts[i].lastName[0];
//      contactIndex++;
//      console.log(contactsHTML);
//      return contactsHTML;
//   }
//   contactsHTML +=`
//   <div class="flex ">
//   <div id="profileImage" class="flex-center">AM</div>
//   <div class="gap">
//     <li>${contacts[i].sureName} ${contacts[i].lastName}</li>
//     <span>${contacts[i].email}</span>
//   </div>
//       </div>`
  
//  }
//  }








// function checkChar(i) {
//   if (char == contacts[i].lastName[0]) {
//     return `     <div class="flex ">
//     <div id="profileImage" class="flex-center">AM</div>
//     <div class="gap">
//       <li>${contacts[i].sureName} ${contacts[i].lastName}</li>
//       <span>${contacts[i].email}</span>
//     </div>
//     </div>`;
//   } else {
//     return `
//     <h3 id="sort"> ${newChar}</h3>
//      <div class="flex ">
// <div id="profileImage" class="flex-center">AM</div>
// <div class="gap">
//   <li>${contacts[i].sureName} ${contacts[i].lastName}</li>
//   <span>${contacts[i].email}</span>
// </div>
// </div>`;
//   }
// }

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




let contactKeysPuffer;

function sorter() {
  for (let i = 0; i < contactKeys.length - 1; i++) {
    for (let j = i + 1; j < contactKeys.length; j++) {
      if (contacts[contactKeys[i]]["lastName"] > contacts[contactKeys[j]]["lastName"]) {
        puffer = contacts[contactKeys[i]];
        contacts[contactKeys[i]] = contacts[contactKeys[j]];
        contacts[contactKeys[j]] = puffer;

        puffer = contacts[contactKeys[i]];
        contacts[contactKeys[i]] = contacts[contactKeys[j]];
        contacts[contactKeys[j]] = puffer;

        // contactKeysPuffer = contactKeys[i];
        // contactKeys[i] = contactKeys[j];
        // contactKeys[j] = contactKeysPuffer;

      } else if (contacts[contactKeys[i]]["lastName"] === contacts[contactKeys[j]]["lastName"]) {
        if (contacts[contactKeys[i]]["sureName"] > contacts[contactKeys[j]]["sureName"]) {
          puffer = contacts[contactKeys[i]];
          contacts[contactKeys[i]] = contacts[contactKeys[j]];
          contacts[contactKeys[j]] = puffer;

        }
      }
    }
  }
  newChar = contacts[contactKeys[0]].lastName[0];
  renderIntoLetterBox();
}



function renderIntoLetterBox() {
  newChar = contacts[contactKeys[contactsIndex]].lastName[0];
  getContactsHtml();
  letterBlock += `<h3 class="sort"> ${newChar}</h3>${contactsString}`;
  contactsString = "";
  if (contactsIndex +1 === contactKeys.length) {
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
          contactsIndex = i ;
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
<div id="profileImage" class="flex-center bigSize">${contacts[contactKeys[index]]["sureName"][0]}${contacts[contactKeys[index]]["lastName"][0]}</div>
<div>
<span> 
${contacts[contactKeys[index]]["sureName"]}
${contacts[contactKeys[index]]["lastName"]}</span>
   <div><img src="./assets/img/editContacts.png" alt="" onclick="editContact()">
       <img src="./assets/img/DeleteContact.png" alt="" onclick= "deleteContact(${index})">
      </div>
  </div>
  </div>
  <div class="contactInformations">
  <p>Contact Information</p>
  <div>
      <h5>Email</h5>
      <span> ${contacts[contactKeys[index]]["email"]}</span>
      <h5>Phone</h5>
      <span> ${contacts[contactKeys[index]]["number"]}</span>
  </div>
</div>`;
}

function deleteContact(index){

  contactKeys.splice(index,1)
delete contacts[contactKeys[index]];
deleteData("/contacts/" + contactKeys[index] );


}

async function deleteData(path=""){
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return responseToJson = await response.json();
  ;

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

addContactToggle();
convertNames();
postData("/contacts",{"sureName":sureLastName[0],"lastName":sureLastName[1],"email":email,"number":number});
init();

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
  // contactKeys = [];
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
