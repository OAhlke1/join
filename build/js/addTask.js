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
const BASE_URL = "https://join-249-default-rtdb.europe-west1.firebasedatabase.app";
const tasksURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks';


/* This functions are mainly from Oscar Ahlke */
async function getTasks() {
    includeHTML();
    let fetchedTasks = await fetch(tasksURL+'.json');
    fetchedTasks = await fetchedTasks.json();
    if(!fetchedTasks) {
        getContacts();
        return;
    }
    getContacts();
}

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

function showHideContactList(event) {
    if(document.querySelector('.contact-list').classList.contains('disNone')) {
        document.querySelector('.contact-list').classList.remove('disNone');
        document.querySelector('.contacts .contacts-inner .triangle').classList.add('rotated');
    }else {
        document.querySelector('.contact-list').classList.add('disNone');
        document.querySelector('.contacts .contacts-inner .triangle').classList.remove('rotated');
    }
}

function showHideCategoriesList(event) {
    if(document.querySelector('.categories-list').classList.contains('disNone')) {
        document.querySelector('.categories-list').classList.remove('disNone');
        document.querySelector('.categories .categories-inner .triangle').classList.add('rotated');
    }else {
        document.querySelector('.categories-list').classList.add('disNone');
        document.querySelector('.categories .categories-inner .triangle').classList.remove('rotated');
    }
}

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
    renderSelectContacts();
}

function renderSelectContacts() {
    selectContacts.innerHTML = /* HTML */ ``;
    allContactsObjects.forEach((elem, i)=>{
        selectContacts.innerHTML += /* HTML */ `<div class="flex flex-center contact" data-selectindex="${i}" onclick="selectContact(event)">
        <div class="flex flex-center contact-left">
            <div class="flex flex-center circle"><p>${elem.sureName[0]}${elem.lastName[0]}</p></div>
            <p>${elem.sureName} ${elem.lastName}</p>
        </div>
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

function renderChosenList() {
    document.querySelector('.chosen-list').innerHTML = '';
    participantsArray.forEach((elem, i)=>{
        document.querySelector('.chosen-list').innerHTML += /* HTML */ `<li><div class="flex flex-center circle" onclick="removeParticipant(${i})" onmouseover="showName(${i})" onmouseleave="hideName(${i})">
            <p>${elem.sureName[0]}${elem.lastName[0]}</p>
            <div class="name-block${i} name-block disNone"><p>${elem.sureName} ${elem.lastName}<br>Click icon to remove</p></div>
        </div>
    </li>`;
    })
    document.querySelector('.chosen-list').classList.remove('disNone');
}

function showName(i) {
    document.querySelector(`.name-block${i}`).classList.remove('disNone');
}

function hideName(i) {
    document.querySelector(`.name-block${i}`).classList.add('disNone');
}

function removeParticipant(i) {
    participantsArray.splice(i, 1);
    document.querySelectorAll('.contact.chosen')[i].classList.remove('chosen');
    renderChosenList();
}

function selectContact(event) {
    event.stopPropagation();
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').classList.add('chosen');
    }
    getParticipants();
}

function getParticipants() {
    participantsArray = [];
    document.querySelectorAll('.contact.chosen').forEach((elem)=>{
        participantsArray.push({
            sureName: allContactsObjects[+elem.getAttribute('data-selectindex')].sureName,
            lastName: allContactsObjects[+elem.getAttribute('data-selectindex')].lastName
        })
    })
    renderChosenList();
}

function addTask() {
    newTask = {
        taskTitle: document.getElementById("title-input").value,
        taskDescrip: document.getElementById("textarea-input").value,
        participants: participantsArray,
        date: document.getElementById("date-input").value,
        urgency: selectedPrio,
        category: categoryType,
        taskType: 'toDo'
    }
    if(allSubtasksArray.length > 0) {
        newTask.subTasks =  allSubtasksArray;
    }
    allTaskObjects.push(newTask);
}



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

async function postNewTask(event) {
    event.preventDefault();
    addTask();
    let response = await fetch(BASE_URL+"/tasks.json", {
        method: 'PUT',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify(allTaskObjects)
    });
}

function showCrossTic() {
    document.querySelector('.subtask-input .add').classList.add('disNone');
    document.querySelector('.cross-tic').classList.remove('disNone');
}

function hideCrossTic() {
    document.querySelector('.subtask-input .add').classList.remove('disNone');
    document.querySelector('.cross-tic').classList.add('disNone');
}

document.querySelector('.clear-subtask-input').addEventListener('click', (event)=>{
    subtaskInput.removeEventListener('focusout', hideCrossTic);
    subtaskInput.focus();
    subtaskInput.value = '';
});

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