let task = [];
let participantsArray = [];
let allTaskKeys = [];
let name, sureName, lastName;
let selectedPrio = "low";
let allContactsObjects;
let contactKeys = [];
let allTaskObjects = [];
let allSubtasksArray = [];
let newTask;
let selectContacts = document.querySelector('.contact-list');
let subtaskInput = document.querySelector('#choose-subtasks');
let categoryType = "medium";
let taskAddedElem = document.querySelector('.task-added');
const BASE_URL = "https://join-249-default-rtdb.europe-west1.firebasedatabase.app";
const tasksURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks'
/**
 * 
 * gets the tasks from the FTP-server
 */
async function getTasks() {
    includeHTML();
    let fetchedTasks = await fetch(tasksURL+'.json');
    fetchedTasks = await fetchedTasks.json();
    if(!fetchedTasks) {
        getContacts();
        return;
    }
    setTasksArray(fetchedTasks);
    getContacts();
}

/**
 * 
 * @param {JSON} tasksJson the tasks-JSON from the server.
 * @function setTasksArray stores all these Tasks in an Array.
 */
function setTasksArray(tasksJson) {
    for(let [key, value] of Object.entries(tasksJson)) {
        allTaskKeys.push(key);
        allTaskObjects.push(value);
    }
}

/**
 * 
 * @function getContacts gets the Contacts from the FTP-server.
 */
async function getContacts() {
    allContactsObjects = await fetch(BASE_URL+'/contacts.json');
    allContactsObjects = await allContactsObjects.json();
    let contactsArray = [];
    for(const [key, value] of Object.entries(allContactsObjects)) {
        contactKeys.push(key);
        contactsArray.push(value);
    }
    allContactsObjects = contactsArray;
    sortContacts();
}

/**
 * 
 * @param {event} event is the event fired to call the function.
 * @function showHideContactList shows or hides the contact-list, wether it is hidden or not.
 */
function showHideContactList(event) {
    if(document.querySelector('.contact-list').classList.contains('disNone')) {
        document.querySelector('.contact-list').classList.remove('disNone');
        document.querySelector('.contacts .contacts-inner .triangle').classList.add('rotated');
    }else {
        document.querySelector('.contact-list').classList.add('disNone');
        document.querySelector('.contacts .contacts-inner .triangle').classList.remove('rotated');
    }
}

/**
 * 
 * @param {event} event is the event fired to call the function.
 * @function showHideCategoriesList shows or hides the list of task-categories.
 */
function showHideCategoriesList(event) {
    if(document.querySelector('.categories-list').classList.contains('disNone')) {
        document.querySelector('.categories-list').classList.remove('disNone');
        document.querySelector('.categories .categories-inner .triangle').classList.add('rotated');
    }else {
        document.querySelector('.categories-list').classList.add('disNone');
        document.querySelector('.categories .categories-inner .triangle').classList.remove('rotated');
    }
}

/**
 * 
 * @function sortContacts sorts the contacts alphabetically.
 * At first it looks for the lastnames, and then, when both contacts share the same lastname, fore the firstname.
 */
function sortContacts() {
    for (let i = 0; i < allContactsObjects.length - 1; i++) {
        for (let j = i + 1; j < allContactsObjects.length; j++) {
            if (allContactsObjects[i]["lastName"].toLowerCase() > allContactsObjects[j]["lastName"].toLowerCase()) {
                puffer = allContactsObjects[i];
                allContactsObjects[i] = allContactsObjects[j];
                allContactsObjects[j] = puffer;
            } else if (allContactsObjects[i]["lastName"].toLowerCase() === allContactsObjects[i]["lastName"].toLowerCase()) {
                if (allContactsObjects[i]["sureName"].toLowerCase() > allContactsObjects[j]["sureName"].toLowerCase()) {
                    puffer = allContactsObjects[i];
                    allContactsObjects[i] = allContactsObjects[j];
                    allContactsObjects[j] = puffer;
                }
            }
        }   
    }
    renderContactList();
}

/**
 * @function renderContactList renders the contact list which at first is inivisible.
 */
function renderContactList() {
    selectContacts.innerHTML = /* HTML */ ``;
    allContactsObjects.forEach((elem, i)=>{
        selectContacts.innerHTML += /* HTML */ `<div class="flex flex-center contact" data-selectindex="${i}" onclick="selectContact(event)">
        <div class="flex flex-center contact-left">${checkIfFirstOrLastNameIsMissingInContactList(elem)}</div>
        <svg class="not-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
        </svg>
        <svg class="is-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="white"/>
            <path d="M5 9L9 13L17 1.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/>
        </svg>
    </div>`;
    })
}
/**
 * 
 * @param {string} elem is the name of a participant
 * @returns an HTML-string with either just the first- or lastname of the participant when the other name is missing or with both of his/her names.
 */
function checkIfFirstOrLastNameIsMissingInContactList(elem) {
    if(!elem.sureName) {
        return `<div class="flex flex-center circle" style="background-color: ${elem.color}"><p>${elem.lastName[0]}</p></div><p class="contact-name">${elem.lastName}</p>`;
    }else if(!elem.lastName) {
        return `<div class="flex flex-center circle" style="background-color: ${elem.color}"><p>${elem.sureName[0]}</p></div><p class="contact-name">${elem.sureName}</p>`;
    }else {
        return `<div class="flex flex-center circle" style="background-color: ${elem.color}"><p>${elem.sureName[0]}${elem.lastName[0]}</p></div><p class="contact-name">${elem.sureName} ${elem.lastName}</p>`;
    }
}

/**
 * 
 * @function renderChosenList renderes the list of chosen contacts.
 */
function renderChosenList() {
    document.querySelector('.chosen-list').innerHTML = '';
    participantsArray.forEach((elem, i)=>{
        console.log(elem);
        document.querySelector('.chosen-list').innerHTML += /* HTML */ `<li><div class="flex flex-center circle" style="background-color: ${elem.color};" onclick="removeParticipant(${i})" onmouseover="showName(${i})" onmouseleave="hideName(${i})" style="background-color: ${allContactsObjects[i].color};">
            <p>${elem.sureName[0]}${elem.lastName[0]}</p>
            <div class="name-block${i} name-block disNone"><p>${elem.sureName} ${elem.lastName}<br>Click icon to remove</p></div>
        </div>
    </li>`;
    })
    document.querySelector('.chosen-list').classList.remove('disNone');
}

/**
 * 
 * @param {number} i is the index of the contact.
 * When the mouseover-event is fired a toggle-box with the name of the contact is shown.
 */
function showName(i) {
    document.querySelector(`.name-block${i}`).classList.remove('disNone');
}

/**
 * 
 * @param {number} i is the index of the contact.
 * when the mouseleave-event is fired, the toggle-box with the contact name in it is hidden.
 */
function hideName(i) {
    document.querySelector(`.name-block${i}`).classList.add('disNone');
}

/**
 * 
 * @param {number} i is the index of the contact.
 * @function removeParticipant removes the clicked participant out of the list of chosen contacts.
 */
function removeParticipant(i) {
    participantsArray.splice(i, 1);
    document.querySelectorAll('.contact.chosen')[i].classList.remove('chosen');
    renderChosenList();
}

/**
 * 
 * @param {even} event is the click-event fired on a contact.
 * @function selectContact adds the class "chosen" to the clicked contact to mark it as chosen.
 */
function selectContact(event) {
    event.stopPropagation();
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').classList.add('chosen');
    }
    getParticipants();
}

/**
 * 
 * @function getParticipants pushes all chosen contacts to the array @var participantsArray
 * To know the exact index of the contact in the @var allContactsObjects each contact has an
 * attribute "data-selectindex".
 */
function getParticipants() {
    participantsArray = [];
    document.querySelectorAll('.contact.chosen').forEach((elem)=>{
        participantsArray.push(allContactsObjects[+elem.getAttribute('data-selectindex')])
    })
    renderChosenList();
}

/**
 * 
 * @param {event} event is the click event fired to the button to add a task.
 * @function addTask has an object @var newTask containing all the keys of a task.
 * Then @var newTask is pushed to the array of all tasks @var allTaskObjects
 */
function addTask(event) {
    event.preventDefault();
    newTask = {
        taskTitle: document.getElementById("title-input-add").value,
        taskDescrip: document.getElementById("task-descrip-add").value,
        participants: participantsArray,
        date: document.getElementById("date-input").value,
        urgency: selectedPrio,
        category: categoryType,
        taskType: 'toDo',
        deleted: 0
    }
    if(allSubtasksArray.length > 0) {
        newTask.subTasks =  allSubtasksArray;
    }
    allTaskObjects.push(newTask);
    postNewTask();
}

/**
 * 
 * @param {event} event is the click-event fired to one of the three priority-buttons in the priority-list.
 * @param {string} prio contains the value of the urgency given to the function at function call.
 * @returns the priority given to the function.
 * @function choosePrio unmarks every priority-button by removing "prio-low-button-bg-color", "prio-medium-button-bg-color",
 * and "prio-high-button-bg-color" and then give that destinct class back to the clicked button.
 */
function choosePrio(event, prio) {
    event.preventDefault();
    if(event.target.closest('.choose-prio-button').classList.contains(`prio-${prio}-button-bg-color`)) {
        event.target.closest('.choose-prio-button').classList.remove(`prio-${prio}-button-bg-color`);
        selectedPrio = "low";
        return;
    }
    document.getElementById("prio-high-button").classList.remove("prio-high-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");
    event.target.closest('.choose-prio-button').classList.add(`prio-${prio}-button-bg-color`);
    selectedPrio = prio;
}

/**
 *
 * @function postNewTask puts @var allTaskObjects (that now contains the new task) to the FTP-server.
 */
async function postNewTask(event) {
    let response = await fetch(BASE_URL+"/tasks.json", {
        method: 'PUT',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify(allTaskObjects)
    });
    document.querySelector('#board-link').click();
}

/**
 * 
 * @function showCrossTic shows the cross- and tic-button of the task inputfield.
 */
function showCrossTic() {
    document.querySelector('.subtask-input .add').classList.add('disNone');
    document.querySelector('.cross-tic').classList.remove('disNone');
}

/**
 * 
 * @function hideCrossTic hides the cross- and tic-button oft the task inputfield.
 */
function hideCrossTic() {
    document.querySelector('.subtask-input .add').classList.remove('disNone');
    document.querySelector('.cross-tic').classList.add('disNone');
}

/**
 * 
 * Here a click-event is added to the inner function that 
 */
function clearSubtaskInput() {
    subtaskInput.focus();
    subtaskInput.value = '';
}

/**
 * 
 * @returns nothing
 * @function addSubtask pushes a new subtask to @var allSubtasksArray
 */
function addSubtask() {
    if(subtaskInput.value === "") {
        hideCrossTic();
        return;
    }else {
        if(checkIfSubtaskExists()) {
            subtaskInput.value = '';
            alert('Subtask already exists');
        }else {
            allSubtasksArray.push({subTaskDone: 0, subTaskTitle: subtaskInput.value})
            renderSubtaskList();
            subtaskInput.value = '';
        }
        hideCrossTic();
    }
}

/**
 * 
 * @returns {boolean}
 * @function checkIfSubtaskExists controlls if the value of the subtask inputfield is the same as the title of an
 * already existing task. If so, @bool true is returned. Else @bool false is given back.
 */
function checkIfSubtaskExists() {
    for(let i=0; i<allSubtasksArray.length; i++) {
        if(allSubtasksArray[i].subTaskTitle.toLowerCase() === subtaskInput.value.toLowerCase()) {
            return true;
        }else if(allSubtasksArray[i].subTaskTitle.toLowerCase() != subtaskInput.value.toLowerCase()) {
            if(i+1 === allSubtasksArray.length) {
                return false;
            }
        }
    }
}

function renderSubtaskList() {
    document.querySelector('.subtask-list').innerHTML = '';
    allSubtasksArray.forEach((elem, i)=>{
        document.querySelector('.subtask-list').innerHTML += /* HTML */ `<li id="subtask-li-${i}" class="flex flex-center" style="column-gap: 12px;" onmouseover="fadeInPenBin(${i})" onmouseleave="fadeOutPenBin(${i})">
            <p class="subtask-title-p-${i}">${elem.subTaskTitle}</p>
            <div class="pen-bin-subtask flex flex-center" id="pen-bin-subtask-${i}">
                <img src="../../assets/img/pen.svg" alt="" onclick="editSubtask(${i})">
                <img src="../../assets/img/bin.svg" alt="" onclick="removeSubtask(${i})">
            </div>
            <div class="edit-subtask flex flex-center disNone" id="edit-subtask-${i}" style="justify-content: space-between;">
                <input type="text" id="edit-subtask-input-${i}" value="${elem.subTaskTitle}">
                <div class="bin-check flex flex-center">
                    <img src="./assets/img/bin.svg" alt="" onclick="removeSubtask(${i})">
                    <img src="./assets/img/check-icon-black.svg" alt="" onclick="changeSubtask(${i})">
                </div>
            </div>
        </li>`
    })
    document.querySelector('.subtask-list').classList.remove('disNone');
}

function fadeInPenBin(i) {
    let liTag = document.querySelector(`#subtask-li-${i}`);
    liTag.classList.remove('fade-out-pen-bin');
    liTag.classList.add('fade-in-pen-bin');
}

function fadeOutPenBin(i) {
    let liTag = document.querySelector(`#subtask-li-${i}`);
    liTag.classList.add('fade-out-pen-bin');
    liTag.classList.remove('fade-in-pen-bin');
}

function editSubtask(i) {
    let editElem = document.querySelector(`#edit-subtask-${i}`);
    document.querySelector(`.subtask-title-p-${i}`).classList.add('disNone');
    document.querySelector(`#pen-bin-subtask-${i}`).classList.add('disNone');
    editElem.classList.remove('disNone');
    editElem.querySelector('input').focus();
}

function changeSubtask(i) {
    allSubtasksArray[i].subTaskTitle = document.querySelector(`#edit-subtask-input-${i}`).value;
    renderSubtaskList();
    document.querySelector(`#edit-subtask-${i}`).classList.add('disNone');
}

function removeSubtask(i) {
    allSubtasksArray.splice(i, 1);
    renderSubtaskList();
}

function setCategory(event) {
    event.preventDefault();
    document.querySelector('.category-name').innerHTML = event.target.innerHTML;
    categoryType = event.target.closest('.category').querySelector('p').innerHTML;
}

/**
 * 
 * This function clears and resets all input-fields and variables belonging to the editing elements of the add-task-overlay.
 */
function clearForm(event) {
    event.preventDefault();
    document.querySelector('#title-input').value = "";
    document.querySelector('#textarea-input').value = "";
    document.querySelector('.contacts-inner p').value = "";
    document.querySelector('.chosen-list').innerHTML = "";
    document.querySelector('#date-input').value = "";
    resetUrgency();
    document.querySelector('.category-name').innerHTML = "Select task category";
    document.querySelector('#choose-subtasks').value = "";
    document.querySelector('.subtask-list').innerHTML = "";
    document.querySelectorAll('.contact-list .contact.chosen').forEach((elem)=>{elem.classList.remove('chosen');});
    document.querySelector('.cross-tic').classList.add('disNone');
    allSubtasksArray = [];
}

/**
 * 
 * This function resets the urgency of the new task.
 */
function resetUrgency() {
    document.querySelectorAll('.choose-prio-button')[0].classList.remove('prio-high-button-bg-color');
    document.querySelectorAll('.choose-prio-button')[1].classList.remove('prio-medium-button-bg-color');
    document.querySelectorAll('.choose-prio-button')[2].classList.remove('prio-low-button-bg-color');
    document.querySelectorAll('.choose-prio-button')[1].classList.add('prio-medium-button-bg-color');
    newUrgency = "medium";
}

/**
 * 
 *  @function fadeInTaskAdded adds the class 'added' to @var taskAddedElem to fade it in via CSS.
 */
function fadeInTaskAdded() {
    console.log('Hi!');
    taskAddedElem.classList.remove('disNone');
    taskAddedElem.classList.remove('not-added');
    taskAddedElem.classList.add('added');
    setTimeout(fadeOutTaskAdded, 1000);
}

/**
 * 
 *  @function fadeOutTaskAdded removes the class 'added' and adds the class 'not-added' to @var taskAddedElem to fade it out via CSS.
 */
function fadeOutTaskAdded() {
    taskAddedElem.classList.remove('added');
    taskAddedElem.classList.add('not-added');
    setTimeout(()=>{
        taskAddedElem.classList.add('disNone');
    }, 700);
}