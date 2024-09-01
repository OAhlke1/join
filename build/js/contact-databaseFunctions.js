/**
 * 
 * @function repostTasks sets all tasks back to the FTP-Client after the
 * deleted contact is in no tasks anymore.
 */
async function repostTasks() {
    let response = await fetch(BASE_URL + "/tasks.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tasks),
    });
  }
  
  /**
   * 
   * @param {string} path is the part of the URL needed for only removing
   * that destinct object from the FTP-client.
   * @returns the response from the FTP-server.
   */
  async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
    });
    return (responseToJson = await response.json());
  }
  
  /**
   * 
   * @param {string} path is the URL-part needed to post the
   * @param {object} data to the correct place on the FTP-client. 
   * @returns the response of the FTP-client.
   */
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
  
  /**
   * 
   * @param {event} event is the event fired to the button to call
   * @function createContactValue which sets the values of the adding-
   * overlay into the variables.
   */
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
  
  /**
   * 
   * @param {string} email is the email of the new contact.
   * @param {number} number is the number of the new cotact.
   * @param {string} name is the name of the new cotact.
   * @param {*} sureLastName is the splitted version of the value
   * of the name input for having the first and last name separated.
   */
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
      contactId: presentlyIndexContacts ? contacts[presentlyIndexContacts][1].contactId : Math.random()
    };
    contacts.push([contacts.length + 1, newContact]);
    resetValue(email, number, name);
    //  postData("/contacts", newContact).then(() => {
  
    //   getContacts();
    //  })
  
    await postData("/contacts", newContact);
    await getContacts();
  }
  
  /**
   * 
   * @function contactSuccessfullyCreated shows the sign that the creation of the
   * new contact was successful.
   */
  function contactSuccessfullyCreated() {
    let mainContainer = document.querySelector(".mainContainer");
    mainContainer.innerHTML += `
  <div class="contactSuccessfullyCreated">
    <img src="./assets/img/contactSuccessfullyCreated.png" alt="contactSuccessfullyCreated">
  </div>
  `;
  }
  
  /**
   * 
   * @param {string} email is the last email passed to the @var email
   * @param {number} number is the last phone number passed to the @var number
   * @param {string} name is the actually passed name to the @var name
   */
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
  
  /**
   * 
   * Checks whether the name has a suffix like "von" or "zu".
   */
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
  
  /**
   * 
   * If the name has some name addition like "von" or "zu", that part of the name
   * is set to the last name of the contact by @function hasNameSuffix
   */
  function hasNameSuffix() {
    if (!nameSuffix) {
      return;
    }
  
    sureLastName = [sureLastName[0], sureLastName[1] + " " + sureLastName[2]];
  }
  
  /**
   * 
   * @function editContactToggle opens and closes the overlay for editing a contact
   * and renders its contact circle.
   */
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
  
  /**
   * 
   * @function addContactToggle opens and closes the overlay for adding a new contact.
   */
  function addContactToggle() {
    let addContact = document.querySelector(".overlay-parent");
    presentlyIndexContacts = null;
    if (!toggleAddContact) {
      addContact.classList.add("d-none");
      toggleAddContact = true;
    } else {
      addContact.classList.remove("d-none");
      toggleAddContact = false;
    }
  }
  
  /**
   * 
   * @param {event} event is the clicking event fired to the closing elemnt.
   * @function backgroundClickedAdd closes the overlay for adding a contact
   * when clicking on the background the overlay lays in.
   */
  function backgroundClickedAdd(event) {
    // Check if the clicked target is the overlay and not a child element
    if (event.target === event.currentTarget) {
      // Call your function here
      addContactToggle();
    }
  }
  
  /**
   * 
   * @param {event} event closes the overlay for editing a contact when clicking
   * on its background.
   */
  function backgroundClickedEdit(event) {
    if (event.target === event.currentTarget) {
      editContactToggle();
    }
  }