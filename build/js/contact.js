let contacts = [
  {
    start: "A",
    entries: [
      {
        name: "Aice Müller",
        email: "alice.mueller@example.com",
        number: "+49176235468",
      },
      {
        name: "Anton Müller",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
      {
        name: "Abrne Müller",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
      {
        name: "Augst Müller",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
    ],
  },

  {
    start: "B",
    entries: [
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
    ],
  },

  {
    start: "C",
    entries: [
      {
        name: "Charlotte Fischer",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
    ],
  },

  {
    start: "D",
    entries: [
      {
        name: "David Weber",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
    ],
  },

  {
    start: "E",
    entries: [
      {
        name: "Eva Berger",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
    ],
  },

  {
    start: "F",
    entries: [
      {
        name: "Felix Koch",
        email: "bob.schneider@example.com",
        number: "+49176235468",
      },
    ],
  },

  {
    start: "G",
    entries: [],
  },
  {
    start: "H",
    entries: [],
  },
  {
    start: "I",
    entries: [],
  },
  {
    start: "J",
    entries: [],
  },
  {
    start: "K",
    entries: [],
  },
  {
    start: "L",
    entries: [],
  },
  {
    start: "M",
    entries: [],
  },
  {
    start: "N",
    entries: [],
  },
  {
    start: "O",
    entries: [],
  },
  {
    start: "P",
    entries: [],
  },
  {
    start: "Q",
    entries: [],
  },
  {
    start: "R",
    entries: [],
  },
  {
    start: "S",
    entries: [],
  },
  {
    start: "T",
    entries: [],
  },
  {
    start: "U",
    entries: [],
  },
  {
    start: "V",
    entries: [],
  },
  {
    start: "W",
    entries: [],
  },
  {
    start: "X",
    entries: [],
  },
  {
    start: "Y",
    entries: [],
  },
  {
    start: "Z",
    entries: [],
  },
];

function init() {
  render();
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

// function sort() {
//     let showContacts = document.getElementById("showContact");

//     for (let i = 0; i < contacts[i]["entries"].length -1; i++) {
//       for (let j = i+1; j < contacts[i]["entries"].length; j++) {
        
        
        
//       }
//     }
//   }

