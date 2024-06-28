const BASE_URL =
  "https://join-249-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];

function init() {
  sorter();
  render();
  get();
}

async function get() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();


  for (let i = 0; i < responseToJson.contacts.length; i++) {
    contacts.push(responseToJson.contacts[i]);
 
  }

  console.log(contacts);
}

function render() {
  let showContacts = document.getElementById("showContact");
  let letter = document.getElementById("sort");

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i]["entries"].length > 0) {
      letter.innerHTML += `${contacts[i]["start"]}`;
    }

    for (let j = 0; j < contacts[i]["entries"].length; j++) {
      showContacts.innerHTML += `
<div class="flex">
   <div id="profileImage" class="flex-center">AM</div>
    <div class="gap">
     <li>${contacts[i]["entries"][j]["name"]}</li>
     <span>${contacts[i]["entries"][j]["email"]}</span>
    </div>
</div>`;
    }
  }
}

let puffer;

function sorter() {
  for (let i = 0; i < contacts.length - 1; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      if (contacts[i]["entries"].name > contacts[j]["entries"].name) {
        puffer = contacts[j];
        contacts[i] = contacts[j];
        contacts[j] = puffer;
      }
    }
    console.log(contacts);
  }
}


