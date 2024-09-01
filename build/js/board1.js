const tasksURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks';
const contactsURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/contacts';
const columns = document.querySelectorAll(".column-card-cont");
let allTaskObjects = [];
let allContactsObjects = [];
let newParticipantsOverlay = [];
let newSubtaskList = [];
let newSubtasksArrayAdd = [];
let participantsArrayAdd = [];
let notDeletedTasks = [];
let actualTasksOnRemote = [];
let searchBar = document.querySelector('#findTaskInput');
let urgencyLow = /* HTML */ `<div class="urgency-icon"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.99974 7.24524C8.80031 7.24557 8.60603 7.18367 8.44549 7.06863L0.876998 1.63467C0.778524 1.56391 0.695351 1.47498 0.632227 1.37296C0.569103 1.27094 0.527264 1.15784 0.5091 1.0401C0.472414 0.802317 0.534386 0.560105 0.681381 0.366747C0.828377 0.17339 1.04835 0.0447247 1.29292 0.00905743C1.53749 -0.0266099 1.78661 0.0336422 1.98549 0.176559L8.99974 5.2075L16.014 0.17656C16.1125 0.105795 16.2243 0.0545799 16.3431 0.02584C16.462 -0.00289994 16.5855 -0.00860237 16.7066 0.00905829C16.8277 0.0267189 16.944 0.0673968 17.0489 0.128769C17.1538 0.190142 17.2453 0.271007 17.3181 0.366748C17.3909 0.462489 17.4436 0.571231 17.4731 0.686765C17.5027 0.802299 17.5085 0.922362 17.4904 1.0401C17.4722 1.15784 17.4304 1.27094 17.3672 1.37296C17.3041 1.47498 17.221 1.56391 17.1225 1.63467L9.55398 7.06863C9.39344 7.18367 9.19917 7.24557 8.99974 7.24524Z" fill="#7AE229"/><path d="M8.99998 12.0001C8.80055 12.0005 8.60628 11.9386 8.44574 11.8235L0.877242 6.38955C0.678366 6.24664 0.546029 6.03276 0.509344 5.79498C0.472658 5.5572 0.53463 5.31499 0.681625 5.12163C0.828621 4.92827 1.0486 4.79961 1.29317 4.76394C1.53773 4.72827 1.78686 4.78853 1.98574 4.93144L8.99998 9.96239L16.0142 4.93144C16.2131 4.78853 16.4622 4.72827 16.7068 4.76394C16.9514 4.79961 17.1713 4.92827 17.3183 5.12163C17.4653 5.31499 17.5273 5.5572 17.4906 5.79498C17.4539 6.03276 17.3216 6.24664 17.1227 6.38956L9.55423 11.8235C9.39369 11.9386 9.19941 12.0005 8.99998 12.0001Z" fill="#7AE229"/></svg></div>`;
let urgencyMedium = /* HTML */ `<div class="urgency-icon"><svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5685 7.16658L1.43151 7.16658C1.18446 7.16658 0.947523 7.06773 0.772832 6.89177C0.598141 6.71581 0.5 6.47716 0.5 6.22831C0.5 5.97947 0.598141 5.74081 0.772832 5.56485C0.947523 5.38889 1.18446 5.29004 1.43151 5.29004L16.5685 5.29004C16.8155 5.29004 17.0525 5.38889 17.2272 5.56485C17.4019 5.74081 17.5 5.97947 17.5 6.22831C17.5 6.47716 17.4019 6.71581 17.2272 6.89177C17.0525 7.06773 16.8155 7.16658 16.5685 7.16658Z" fill="#FFA800"/><path d="M16.5685 2.7098L1.43151 2.7098C1.18446 2.7098 0.947523 2.61094 0.772832 2.43498C0.598141 2.25902 0.5 2.02037 0.5 1.77152C0.5 1.52268 0.598141 1.28403 0.772832 1.10807C0.947523 0.932105 1.18446 0.833252 1.43151 0.833252L16.5685 0.833252C16.8155 0.833252 17.0525 0.932105 17.2272 1.10807C17.4019 1.28403 17.5 1.52268 17.5 1.77152C17.5 2.02037 17.4019 2.25902 17.2272 2.43498C17.0525 2.61094 16.8155 2.7098 16.5685 2.7098Z" fill="#FFA800"/></svg></div>`;
let urgencyHigh = /* HTML */ `<div class="urgency-icon"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.00002 4.75476C9.19945 4.75443 9.39372 4.81633 9.55427 4.93137L17.1228 10.3653C17.2212 10.4361 17.3044 10.525 17.3675 10.627C17.4307 10.7291 17.4725 10.8422 17.4907 10.9599C17.5273 11.1977 17.4654 11.4399 17.3184 11.6333C17.1714 11.8266 16.9514 11.9553 16.7068 11.9909C16.4623 12.0266 16.2131 11.9664 16.0143 11.8234L9.00002 6.7925L1.98577 11.8234C1.8873 11.8942 1.77545 11.9454 1.65662 11.9742C1.53779 12.0029 1.4143 12.0086 1.2932 11.9909C1.1721 11.9733 1.05577 11.9326 0.950844 11.8712C0.845915 11.8099 0.754446 11.729 0.681662 11.6333C0.608878 11.5375 0.556201 11.4288 0.52664 11.3132C0.49708 11.1977 0.491215 11.0776 0.509379 10.9599C0.527545 10.8422 0.569382 10.7291 0.632508 10.627C0.695632 10.525 0.778805 10.4361 0.87728 10.3653L8.44577 4.93137C8.60631 4.81633 8.80059 4.75443 9.00002 4.75476Z" fill="#FF3D00"/><path d="M9.00002 -0.000121266C9.19945 -0.000455511 9.39372 0.0614475 9.55427 0.176482L17.1228 5.61045C17.3216 5.75336 17.454 5.96724 17.4907 6.20502C17.5273 6.4428 17.4654 6.68501 17.3184 6.87837C17.1714 7.07173 16.9514 7.20039 16.7068 7.23606C16.4623 7.27173 16.2131 7.21147 16.0143 7.06856L9.00002 2.03761L1.98577 7.06856C1.78689 7.21147 1.53777 7.27173 1.2932 7.23606C1.04863 7.20039 0.828657 7.07173 0.681662 6.87837C0.534667 6.68501 0.472695 6.4428 0.509379 6.20502C0.546065 5.96723 0.678402 5.75336 0.87728 5.61044L8.44577 0.176482C8.60631 0.0614474 8.80059 -0.000455546 9.00002 -0.000121266Z" fill="#FF3D00"/></svg></div>`;
let doneCount = 0;
let selectedPrio = "medium";
let taskAddedElem = document.querySelector('.task-added');
let oldTaskVersion;

/**
 * This function fetches all task-objects from firebase
 * 
 * @param {JSON} fetchedTasks - the received JSON from firebase which will in the next line be converted into a JavaScript object
 * @param {array} allTaskKeys - an array with all the task keys defined by firebase
 * @param {array} allTaskObjects - an array with all the task values from firebase
 * 
 */
async function getTasks() {
    includeHTML();
    let response = await fetch(tasksURL+'.json');
    response = await response.json();
    if(response) {
        for(let i=0; i<response.length; i++) {
            allTaskObjects.push(response[i]);
        }
    }
    getContacts();
    checkIfSubtasksExist();
    checkIfParticipantsExist();
    renderTasks();
    showHideGreyTaskCards();
}

/**
 * This function fetches all task-objects from firebase
 * 
 * @param {JSON} fetchedContacts - the received JSON from firebase which will in the next line be converted into a JavaScript object
 * @param {array} allContactsObjects - an array with all the contacts keys defined by firebase
 * @param {array} allContactsObjects - an array with all the contacts values from firebase
 * 
 */
async function getContacts() {
    let response = await fetch(contactsURL+'.json');
    response = await response.json();
    if(response) {
        for(let [key, value] of Object.entries(response)) {
            if(!value.sureName) {
                value.sureName = '';
            }
            if(!value.lastName) {
                value.lastName = '';
            }
            allContactsObjects.push(value);
        }
        sortContacts();
    }
}

/**
 * This function sorts the contact objects by the last names
 */
function sortContacts() {
    let puffer;
    for (let i = 0; i < allContactsObjects.length - 1; i++) {
        for (let j = i + 1; j < allContactsObjects.length; j++) {
            if (allContactsObjects[i].lastName > allContactsObjects[j].lastName) {
                puffer = structuredClone(allContactsObjects[i]);
                allContactsObjects[i] = structuredClone(allContactsObjects[j]);
                allContactsObjects[j] = structuredClone(puffer);
            }else if (allContactsObjects[i].lastName === allContactsObjects[i].lastName) {
                if(allContactsObjects[i].sureName != "" && allContactsObjects[j].sureName != "") {
                    if (allContactsObjects[i].sureName > allContactsObjects[j].sureName) {
                        puffer = structuredClone(allContactsObjects[i]);
                        allContactsObjects[i] = structuredClone(allContactsObjects[j]);
                        allContactsObjects[j] = structuredClone(puffer);
                    }
                }
            }
        }   
    }

    renderContactListAdd();
}

/**
 * This function checks whether a task has subtasks.
 * If so, the index of the task-object in @var allTaskObjects is given to the function checkDoneSubTasks.
 */
function checkIfSubtasksExist() {
    for(let i=0; i<allTaskObjects.length; i++) {
        if(!allTaskObjects[i].subTasks) {
            allTaskObjects[i].subTasks = [];
        }
    }
}
/**
 * 
 * The @function checkIfParticipantsExist checks wether a task has participants.
 * If it is not the case, an empty array is handed to the participant key of that task.
 */
function checkIfParticipantsExist() {
    for(let i=0; i<allTaskObjects.length; i++) {
        if(!allTaskObjects[i].participants) {
            allTaskObjects[i].participants = [];
        }
    }
}

/**
 * 
 * @function renderTasks renders all the objects of the @var {array} allTaskObjects variable into these draggable tasks visible on the board.
 */
function renderTasks() {
    allTaskObjects.forEach((elem, index)=>{
        let card = /* HTML */ `<div class="task flex-column" draggable="true" data-taskType="${elem.taskType}" data-taskIndex="${index}" onclick="renderTaskIntoOverlay(${index})">
            <div class="task-category flex-center flex-column" style="background-color: ${allTaskObjects[index].category === 'User Story' ? '#00338f' : '#1fd7c1'};"><p>${elem.category}</p></div>
            <div class="headlineDescription flex-column">
                <h2>${elem.taskTitle}</h2>
                <div class="task-description"><p>${elem.taskDescrip}</p></div>
            </div>
            <div class="subtasks flex-center ${elem.subTasks.length === 0 ? 'disNone' : ''}" style="flex-direction: row-reverse;">
                <p class="subtasks-count ${elem.subTasks ? "" : "disNone"}"><span class="count">${elem.subTasks ? countDoneSubtasks(index) : 0}</span>/<span class="total">${elem.subTasks.length}</span> Subtasks</p>
                <div class="subtasks-bar"><div class="inner" style="width: ${100*doneCount/elem.subTasks.length}%;"></div></div>
            </div>
            <div class="participants-and-urgency flex">
            <div class="participants flex">${getParticipantsHtml(index)}</div>
                <div class="menu flex">${getUrgencyHtml(elem.urgency)}</div>
            </div>
        </div>`;
        document.querySelector(`#${elem.taskType}`).innerHTML += card;
        setDragDrop();
    });
}

/**
 * 
 * @param {number} index is the index of the task 
 * @returns a drop-down menue for rendering it into the task-card.
 */
function renderDropDownShiftTask(index) {
    return `<select class="select-state" id="selectState${index}" onchange="checkNewTaskType(event, ${index})">
        <option>Shift Task</option>
        <option class="${allTaskObjects[index].taskType === 'toDo' ? 'disNone' : ''}">To Do</option>
        <option class="${allTaskObjects[index].taskType === 'inProgress' ? 'disNone' : ''}">In Progress</option>
        <option class="${allTaskObjects[index].taskType === 'awaitFeedback' ? 'disNone' : ''}">Await Feedback</option>
        <option class="${allTaskObjects[index].taskType === 'done' ? 'disNone' : ''}">Done</option>
    </select>`;
}

function checkNewTaskType(event, index) {
    let state = document.querySelector(`#selectState${index}`).value;
    if(state === "To Do") {
        state = "toDo";
    }else if(state === "In Progress") {
        state = "inProgress";
    }else if(state === "Await Feedback") {
        state = "awaitFeedback";
    }else if(state === "Done") {
        state = "done";
    }
    resetTaskStatus(event, index, state);
}

/**
 * 
 * @param {evemt} event the click-event fired to the option of the tasks drop-down-menue
 * @param {number} index is the tasks index.
 * @param {string} statusName is the name of the status.
 * @var oldStatus is the name of the tasks old status.
 * @function resetTaskStatus sets a new status to the task.
 */
function resetTaskStatus(event, index, statusName) {
    event.stopPropagation();
    let oldStatus = allTaskObjects[index].taskType;
    document.querySelector(`.task[data-taskindex="${index}"]`).innerHTML = "";
    allTaskObjects[index].taskType = statusName;
    hideShiftedTask(index);
    reRenderTask(index);
    showHideGreyTaskCards();
    //showGreyCardOfOldStatus(oldStatus);
    collectNotDeletedTasks();
}

/**
 * 
 * @param {number} index is the index of the task.
 * @function hideShiftedTask setsthe tasks old card to completely hidden and removes its data-taskindex value.
 */
function hideShiftedTask(index) {
    document.querySelector(`.task[data-taskindex='${index}']`).classList.add('completely-hidden');
    document.querySelector(`.task[data-taskindex='${index}']`).setAttribute('data-taskindex', '');
}

function showGreyCardOfOldStatus(oldStatus) {
    if(document.querySelectorAll(`#${oldStatus} .task`).length === document.querySelectorAll(`#${oldStatus} .task.completely-hidden`).length) {
        document.querySelector(`#${oldStatus} .card`).classList.remove('disNone');
    }
}

/**
 * 
 * @function reRenderTask rerenders the replaced task
 */
function reRenderTask(index) {
    let elem = allTaskObjects[index];
    let card = /* HTML */ `<div class="task flex-column" draggable="true" data-taskType="${elem.taskType}" data-taskIndex="${index}" onclick="renderTaskIntoOverlay(${index})">
        <div class="task-category flex-center flex-column" style="background-color: ${allTaskObjects[index].category === 'User Story' ? '#00338f' : '#1fd7c1'};"><p>${elem.category}</p></div>
        <div class="headlineDescription flex-column">
            <h2>${elem.taskTitle}</h2>
            <div class="task-description"><p>${elem.taskDescrip}</p></div>
        </div>
        <div class="subtasks flex-center ${elem.subTasks.length === 0 ? 'disNone' : ''}" style="flex-direction: row-reverse;">
            <p class="subtasks-count ${elem.subTasks ? "" : "disNone"}"><span class="count">${elem.subTasks ? countDoneSubtasks(index) : 0}</span>/<span class="total">${elem.subTasks.length}</span> Subtasks</p>
            <div class="subtasks-bar"><div class="inner" style="width: ${100*doneCount/elem.subTasks.length}%;"></div></div>
        </div>
        <div class="participants-and-urgency flex">
        <div class="participants flex">${getParticipantsHtml(index)}</div>
            <div class="menu flex">${getUrgencyHtml(elem.urgency)}</div>
        </div>
    </div>`;
    document.querySelector(`#${elem.taskType}`).innerHTML += card;
    setDragDrop();
}

/**
 * 
 * @param {number} index is the index of the task in @param {array} allTaskObjects
 * This function rerenders the newly created task on the board.
 */
function reRenderTasks() {
    allTaskObjects.forEach((elem, index)=>{
        if(!elem.deleted) {
            document.querySelector(`.task[data-taskindex="${index}"]`).innerHTML = /* HTML */ `
            <div class="task-category flex-center" style="background-color: ${allTaskObjects[index].category === 'User Story' ? '#00338f' : '#1fd7c1'};"><p>${elem.category}</p></div>
                <div class="headlineDescription flex-column">
                    <h2>${elem.taskTitle}</h2>
                    <div class="task-description"><p>${elem.taskDescrip}</p></div>
                </div>
                <div class="subtasks flex-center ${elem.subTasks.length === 0 ? 'disNone' : ''}" style="flex-direction: row-reverse;">
                    <p class="subtasks-count ${elem.subTasks ? "" : "disNone"}"><span class="count">${elem.subTasks ? countDoneSubtasks(index) : 0}</span>/<span class="total">${elem.subTasks.length}</span> Subtasks</p>
                    <div class="subtasks-bar"><div class="inner" style="width: ${100*doneCount/elem.subTasks.length}%;"></div></div>
                </div>
                <div class="participants-and-urgency flex">
                <div class="participants flex">${getParticipantsHtml(index)}</div>
                    <div class="menu flex">${getUrgencyHtml(elem.urgency)}</div>
            </div>`;
        }
    });
    shiftParticipantCirclesInTask();
    setDragDrop();
    //document.querySelector('.tasks-overlay').classList.add('disNone');
}

/**
 * 
 * @param {number} index 
 * @returns an HTML-string of the participants for the task with the index @param index
 */
function getParticipantsHtml(index) {
    let pList = "";
    for(let i=0; i<allTaskObjects[index].participants.length; i++) {
        if(!allTaskObjects[index].participants[i].lastName) {
            pList += `<div class="participant flex-center" style="background-color: ${allTaskObjects[index].participants[i].color}"><p class="initials">${allTaskObjects[index].participants[i].sureName[0]}</p></div>`;
        }else if(!allTaskObjects[index].participants[i].sureName) {
            pList += `<div class="participant flex-center" style="background-color: ${allTaskObjects[index].participants[i].color}"><p class="initials">${allTaskObjects[index].participants[i].lastName[0]}</p></div>`;
        }else {
            pList += `<div class="participant flex-center" style="background-color: ${allTaskObjects[index].participants[i].color}"><p class="initials">${allTaskObjects[index].participants[i].sureName[0]}${allTaskObjects[index].participants[i].lastName[0]}</p></div>`;
        }
    }
    return pList;
}

/**
 * 
 * @param {number} index is the task index
 * @returns {number} - the amount of tasks that are marked as checked
 * So the function counts the subtasks that are marked as done.
 */
function countDoneSubtasks(index) {
    doneCount = 0;
    for(let i=0; i<allTaskObjects[index].subTasks.length; i++) {
        if(allTaskObjects[index].subTasks[i].subTaskDone === 1) {
            doneCount++;
        }
    }
    return doneCount;
}

/**
 * 
 * This function looks wether a task is in a column or not.
 *      The class "completely-hidden" is for a deleted task so that it will not be shown anymore, also when the class
 *      hiding-class "disNone" (for display: none) is removed.
 * When every task in a column has that "completely-hidden"-class, or no task at all, the grey card with "No-task-to-do" etc. is shown in that column.
 */
function showHideGreyTaskCards() {
    if(document.querySelectorAll('#toDo .task').length != document.querySelectorAll('#toDo .task.completely-hidden').length) {
        document.querySelector('.no-task-to-do').classList.add('disNone');
    }else if(document.querySelectorAll('#toDo .task').length === document.querySelectorAll('#toDo .task.completely-hidden').length) {
        document.querySelector('.no-task-to-do').classList.remove('disNone');
    }
    if(document.querySelectorAll('#inProgress .task').length != document.querySelectorAll('#inProgress .task.completely-hidden').length) {
        document.querySelector('.no-task-in-progress').classList.add('disNone');
    }else if(document.querySelectorAll('#inProgress .task').length === document.querySelectorAll('#inProgress .task.completely-hidden').length) {
        document.querySelector('.no-task-in-progress').classList.remove('disNone');
    }
    if(document.querySelectorAll('#awaitFeedback .task').length != document.querySelectorAll('#awaitFeedback .task.completely-hidden').length) {
        document.querySelector('.no-feedback-awaited').classList.add('disNone');
    }else if(document.querySelectorAll('#awaitFeedback .task').length === document.querySelectorAll('#awaitFeedback .task.completely-hidden').length) {
        document.querySelector('.no-feedback-awaited').classList.remove('disNone');
    }
    if(document.querySelectorAll('#done .task').length != document.querySelectorAll('#done .task.completely-hidden').length) {
        document.querySelector('.no-task-done').classList.add('disNone');
    }else if(document.querySelectorAll('#done .task').length === document.querySelectorAll('#done .task.completely-hidden').length) {
        document.querySelector('.no-task-done').classList.remove('disNone');
    }
}

/**
 * 
 * setDragDrop sets the drag and drop events to each task-card
 * The first for-loop sets a dragstart-event to every task
 *      So when the dragging has started,
 *      @param {node} dragged is given the actual dragstart-event-target
 * The second for-loop at first calls the preventDefault-function of the Event-class
 *      for every @param {node} col of @param {array} columns so that no
 *      other event added to the column is fired
 *      Secondly it adds the drop-event to each column.
 *      In its listener-function at first the event stops propagation
 *      so that the task-card only is put into the direct parent column
 * 
 */
function setDragDrop(index) {
    document.querySelectorAll('.task').forEach((elem)=> {
        elem.addEventListener("dragstart", (event) => {
            dragged = event.target;
        });
    });
   
    for(col of columns) {
        col.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
    
        col.addEventListener("drop", (event) => {
            event.stopPropagation();
            forEachTarget(event);
        });
    }
    shiftParticipantCirclesInTask();
}

/**
 * 
 * @param {event} event - the drop-event from the setDragDrop-function
 * The function checks every column if the dragged task-card is dropped into it
 *      - or one of its contained Elements
 *      Because when the dragged task-card is dropped onto another task-card
 *      the event-target would be that particular element of that card and the
 *      dragged task would be inside the other card.
 *      When the dragged card was found, it is appended into the correct container
 *      (the column)
 */
function forEachTarget(event) {
    columns.forEach((elem, index)=>{
        if(allTaskObjects.length > 0) {
            if(elem.contains(event.target)) {
                elem.classList.remove('highlighted');
                elem.appendChild(dragged);
                showHideGreyTaskCards();
            }
        }
    })
    actualizeTaskTypes();
}