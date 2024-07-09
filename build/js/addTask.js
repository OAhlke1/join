let task = [];
let participants = [];
let allTaskKeys = [];
let name, sureName, lastName;
let selectedPrio = "low";
let allContactsObjects;
let allTaskObjects = [];
let newTask;
let selectContacts = document.querySelector('.select-container.contacts');
let selectCategory = document.querySelector('.select-container.category');
const BASE_URL = "https://join-249-default-rtdb.europe-west1.firebasedatabase.app";
const tasksURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks';


/* This functions are mainly from Oscar Ahlke */
async function getTasks() {
    includeHTML();
    let fetchedTasks = await fetch(tasksURL+'.json');
    fetchedTasks = await fetchedTasks.json();
    for(const [key, value] of Object.entries(fetchedTasks)) {
        allTaskObjects.push(value);
    }
    getContacts();
}
async function getContacts() {
    includeHTML();
    allContactsObjects = await fetch(BASE_URL+'/contacts.json');
    allContactsObjects = await allContactsObjects.json();
    sortContacts();
}

function sortContacts() {
    for (let i = 0; i < allContactsObjects.length - 1; i++) {
        for (let j = i + 1; j < allContactsObjects.length; j++) {
            if (allContactsObjects[i]["lastName"] > allContactsObjects[j]["lastName"]) {
                puffer = allContactsObjects[i];
                allContactsObjects[i] = allContactsObjects[j];
                allContactsObjects[j] = puffer;
            } else if (allContactsObjects[i]["lastName"] === allContactsObjects[i]["lastName"]) {
                if (allContactsObjects[i]["sureName"] > allContactsObjects[j]["sureName"]) {
                    puffer = allContactsObjects[i];
                    allContactsObjects[i] = allContactsObjects[j];
                    allContactsObjects[j] = puffer;
                }
            }
        }   
    }
    renderSelectContacts();
}

function renderSelectContacts(index) {
    selectContacts.innerHTML = '<option value="Select contacts to assign">Select contacts to assign</option>';
    allContactsObjects.forEach((elem, i)=>{
        selectContacts.innerHTML += /* HTML */ `<option value="${elem.sureName} ${elem.lastName}" data-selectindex="${i}">${elem.sureName} ${elem.lastName}</option>`;
    })
}

function addTask() {
    newTask = {
        taskTitle: document.getElementById("title-input").value,
        taskDescrip: document.getElementById("textarea-input").value,
        participants: [{
            sureName: allContactsObjects[+selectContacts.options[selectContacts.selectedIndex].getAttribute('data-selectindex')].sureName,
            lastName: allContactsObjects[+selectContacts.options[selectContacts.selectedIndex].getAttribute('data-selectindex')].lastName,
        }],
        date: document.getElementById("date-input").value,
        urgency: selectedPrio,
        category: selectCategory.options[selectCategory.selectedIndex].value,
        taskType: 'toDo'
    }
    if(document.getElementById("choose-subtasks").value != "") {
        newTask.subTasks =  [{subTaskDone: 0, subTaskTitle: document.getElementById("choose-subtasks").value}];
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
