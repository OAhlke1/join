let contacts = [
  {
    start: "A",
    entries: [
      {
        name: "Alice Müller",
        email: "alice.mueller@example.com",
        number: "+49176235468",
      },
      {
        name: "Anton Müller",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
      {
        name: "Arne Müller",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
      {
        name: "Adgst Müller",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
    ],
  },

  {
    name: "Bob Schneider",
    email: "bob.schneider@example.com",
    number: "+49176235468",
  },
  {
    name: "Boran Schneider",
    email: "bob.schneider@example.com",
    number: "+49176235468",
  },
  {
    name: "Charlotte Fischer",
    email: "bob.schneider@example.com",
    number: "+49176235468",
  },
  {
    name: "David Weber",
    email: "bob.schneider@example.com",
    number: "+49176235468",
  },
  {
    name: "Eva Berger",
    email: "bob.schneider@example.com",
    number: "+49176235468",
  },
  {
    name: "Felix Koch",
    email: "bob.schneider@example.com",
    number: "+49176235468",
  },
];

// function init() {
//   render();
  
// }

function render() {
  let showContacts = document.getElementById("showContact");

  for (let i = 0; i < contacts.length; i++) {
    for (let j = 0; j < contacts[i]["entries"].length; j++) {
      if (contacts[i]["start"] == "A") {
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
}


// function render() {
//     let showContacts = document.getElementById("showContact");
  
//     for (let i = 0; i < contacts.length -1; i++) {
//       for (let j = i+1; j < contactslength; j++) {
//         if (contacts[i]["start"] == "A") {
//           showContacts.innerHTML += `
//   <div class="flex">
//      <div id="profileImage" class="flex-center">AM</div>
//       <div class="gap">
//        <li>${contacts[i]["entries"][j]["name"]}</li>
//        <span>${contacts[i]["entries"][j]["email"]}</span>
//       </div>
//   </div>`;
//         }
//       }
//     }
//   }