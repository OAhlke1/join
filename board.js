const tasksURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks';
const contactsURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/contacts';
const columns = document.querySelectorAll(".column-card-cont");
let dragged = null;
let searchBar = document.querySelector('#findTaskInput');
let userTasks;
let allTaskKeys = [];
let allSubtasksArray = [];
let newSubtasksArray = [];
let allTaskObjects = [];
let allContactsObjects = [];
let foundTasks = [];
let urgencyLow = /* HTML */ `<div class="urgency-icon"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.99974 7.24524C8.80031 7.24557 8.60603 7.18367 8.44549 7.06863L0.876998 1.63467C0.778524 1.56391 0.695351 1.47498 0.632227 1.37296C0.569103 1.27094 0.527264 1.15784 0.5091 1.0401C0.472414 0.802317 0.534386 0.560105 0.681381 0.366747C0.828377 0.17339 1.04835 0.0447247 1.29292 0.00905743C1.53749 -0.0266099 1.78661 0.0336422 1.98549 0.176559L8.99974 5.2075L16.014 0.17656C16.1125 0.105795 16.2243 0.0545799 16.3431 0.02584C16.462 -0.00289994 16.5855 -0.00860237 16.7066 0.00905829C16.8277 0.0267189 16.944 0.0673968 17.0489 0.128769C17.1538 0.190142 17.2453 0.271007 17.3181 0.366748C17.3909 0.462489 17.4436 0.571231 17.4731 0.686765C17.5027 0.802299 17.5085 0.922362 17.4904 1.0401C17.4722 1.15784 17.4304 1.27094 17.3672 1.37296C17.3041 1.47498 17.221 1.56391 17.1225 1.63467L9.55398 7.06863C9.39344 7.18367 9.19917 7.24557 8.99974 7.24524Z" fill="#7AE229"/><path d="M8.99998 12.0001C8.80055 12.0005 8.60628 11.9386 8.44574 11.8235L0.877242 6.38955C0.678366 6.24664 0.546029 6.03276 0.509344 5.79498C0.472658 5.5572 0.53463 5.31499 0.681625 5.12163C0.828621 4.92827 1.0486 4.79961 1.29317 4.76394C1.53773 4.72827 1.78686 4.78853 1.98574 4.93144L8.99998 9.96239L16.0142 4.93144C16.2131 4.78853 16.4622 4.72827 16.7068 4.76394C16.9514 4.79961 17.1713 4.92827 17.3183 5.12163C17.4653 5.31499 17.5273 5.5572 17.4906 5.79498C17.4539 6.03276 17.3216 6.24664 17.1227 6.38956L9.55423 11.8235C9.39369 11.9386 9.19941 12.0005 8.99998 12.0001Z" fill="#7AE229"/></svg></div>`;
let urgencyMedium = /* HTML */ `<div class="urgency-icon"><svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5685 7.16658L1.43151 7.16658C1.18446 7.16658 0.947523 7.06773 0.772832 6.89177C0.598141 6.71581 0.5 6.47716 0.5 6.22831C0.5 5.97947 0.598141 5.74081 0.772832 5.56485C0.947523 5.38889 1.18446 5.29004 1.43151 5.29004L16.5685 5.29004C16.8155 5.29004 17.0525 5.38889 17.2272 5.56485C17.4019 5.74081 17.5 5.97947 17.5 6.22831C17.5 6.47716 17.4019 6.71581 17.2272 6.89177C17.0525 7.06773 16.8155 7.16658 16.5685 7.16658Z" fill="#FFA800"/><path d="M16.5685 2.7098L1.43151 2.7098C1.18446 2.7098 0.947523 2.61094 0.772832 2.43498C0.598141 2.25902 0.5 2.02037 0.5 1.77152C0.5 1.52268 0.598141 1.28403 0.772832 1.10807C0.947523 0.932105 1.18446 0.833252 1.43151 0.833252L16.5685 0.833252C16.8155 0.833252 17.0525 0.932105 17.2272 1.10807C17.4019 1.28403 17.5 1.52268 17.5 1.77152C17.5 2.02037 17.4019 2.25902 17.2272 2.43498C17.0525 2.61094 16.8155 2.7098 16.5685 2.7098Z" fill="#FFA800"/></svg></div>`;
let urgencyHigh = /* HTML */ `<div class="urgency-icon"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.00002 4.75476C9.19945 4.75443 9.39372 4.81633 9.55427 4.93137L17.1228 10.3653C17.2212 10.4361 17.3044 10.525 17.3675 10.627C17.4307 10.7291 17.4725 10.8422 17.4907 10.9599C17.5273 11.1977 17.4654 11.4399 17.3184 11.6333C17.1714 11.8266 16.9514 11.9553 16.7068 11.9909C16.4623 12.0266 16.2131 11.9664 16.0143 11.8234L9.00002 6.7925L1.98577 11.8234C1.8873 11.8942 1.77545 11.9454 1.65662 11.9742C1.53779 12.0029 1.4143 12.0086 1.2932 11.9909C1.1721 11.9733 1.05577 11.9326 0.950844 11.8712C0.845915 11.8099 0.754446 11.729 0.681662 11.6333C0.608878 11.5375 0.556201 11.4288 0.52664 11.3132C0.49708 11.1977 0.491215 11.0776 0.509379 10.9599C0.527545 10.8422 0.569382 10.7291 0.632508 10.627C0.695632 10.525 0.778805 10.4361 0.87728 10.3653L8.44577 4.93137C8.60631 4.81633 8.80059 4.75443 9.00002 4.75476Z" fill="#FF3D00"/><path d="M9.00002 -0.000121266C9.19945 -0.000455511 9.39372 0.0614475 9.55427 0.176482L17.1228 5.61045C17.3216 5.75336 17.454 5.96724 17.4907 6.20502C17.5273 6.4428 17.4654 6.68501 17.3184 6.87837C17.1714 7.07173 16.9514 7.20039 16.7068 7.23606C16.4623 7.27173 16.2131 7.21147 16.0143 7.06856L9.00002 2.03761L1.98577 7.06856C1.78689 7.21147 1.53777 7.27173 1.2932 7.23606C1.04863 7.20039 0.828657 7.07173 0.681662 6.87837C0.534667 6.68501 0.472695 6.4428 0.509379 6.20502C0.546065 5.96723 0.678402 5.75336 0.87728 5.61044L8.44577 0.176482C8.60631 0.0614474 8.80059 -0.000455546 9.00002 -0.000121266Z" fill="#FF3D00"/></svg></div>`;
let newTitle = "";
let newDescription = "";
let newDate = "";
let newUrgency = "low";
let selectedPrio = "medium";
let categoryType;

document.querySelector('body').addEventListener('keyup', (event)=>{
    if(event.key === 'Escape'){
        closeOverlay();
        closeAddTaskOverlay();
    }
});

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
    let fetchedTasks = await fetch(tasksURL+'.json');
    fetchedTasks = await fetchedTasks.json();
    if(fetchedTasks) {
        for(const [key, value] of Object.entries(fetchedTasks)) {
            allTaskKeys.push(key);
            allTaskObjects.push(value);
        }
    }
    getContacts();
}

async function getContacts() {
    let fetchedContacts = await fetch(contactsURL+'.json');
    fetchedContacts = await fetchedContacts.json();
    for(let [key, value] of Object.entries(fetchedContacts)) {
        allContactsObjects.push(value)
    }
    sortContacts();
    renderSelectContacts();
    setSubtaskArray();
    setTasksHtml();
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
}

function setSubtaskArray() {
    let subTaskArray = [];
    allSubtasksArray = [];
    allTaskObjects.forEach((elem, index)=>{
        if(elem.hasOwnProperty('subTasks')) {
            for(let [key, value] of Object.entries(elem.subTasks)) {
                subTaskArray.push([key, value]);
            }
            allSubtasksArray.push(subTaskArray);
            subTaskArray = [];
        }else {
            allSubtasksArray.push([]);
        }
    })
}

/**
 * 
 * This function writes writes the HTML to all user-story cards and loads it to the variable card
 * @param {string} card - a string variable that holds the HTML containing the information of elem
 * the forEach-function iterates threw @param allTaskObjects and loads its actual array field to elem with each step
 * @param {object} elem - it contains the value of the actual field of @param allTaskObjects at the index @param index
 *      it contains the task title, task description, the participants of the task and the tasks urgency (low, medium, high)
 *      The tasks participants are held within another object that holds the surename and name of each task member
 * @param {number} index - the index of @param allTaskObjects
 * 
 * data-taskType is the attribute for the type of the task ('toDo', 'inProgres', 'awaitFeedback', 'done')
 * data-taskIndex is the attribute for the index of the task
 * 
 * After creating the HTML, @param card is given
 * 
 */

function setTasksHtml() {
    allTaskObjects.forEach((elem, index)=>{
        let card = /* HTML */ `<div class="task flex-column" draggable="true" data-taskType="${elem.taskType}" data-taskIndex="${index}" onclick="renderSubtaskOverlay(${index})">
            <div class="task-type flex-center"><p>User Story</p></div>
            <div class="headlineDescription flex-column">
                <h2>${elem.taskTitle}</h2>
                <div class="task-description"><p>${elem.taskDescrip}</p></div>
            </div>
            <div class="subtasks flex-center">
                <div class="subtasks-bar"><div class="inner"></div></div>
                <p class="subtasks-count"><span class="count"></span>/<span class="total"></span> Subtasks</p>
            </div>
            <div class="participants-and-urgency flex">
                <div class="participants flex">${getParticipantsHtml(elem.participants)}</div>
                <div class="menu flex">${getUrgencyHtml(elem.urgency)}</div>
            </div>
        </div>`;
        renderTask(card, elem.taskType);
    });
    userTasks = document.querySelectorAll('.task');
    checkIfSubtasksExist();
    checkForEmptyColumns();
    checkForFilledColumns();
    shiftParticipants();
    setDragDrop();
}

function checkIfSubtasksExist() {
    allTaskObjects.forEach((elem, index)=>{
        if(!allTaskObjects[index].hasOwnProperty('subTasks')) {
            document.querySelector(`.task[data-taskindex="${index}"] .subtasks`).classList.add('disNone');
        }else {
            document.querySelector(`.task[data-taskindex="${index}"] .subtasks .subtasks-count .total`).innerHTML = allTaskObjects[index].subTasks.length;
            checkDoneSubTasks(index);
        }
    })
}

function checkDoneSubTasks(index) {
    let doneCount = 0;
    for(let i=0; i<allTaskObjects[index].subTasks.length; i++) {
        if(allTaskObjects[index].subTasks[i].subTaskDone) {
            doneCount++;
        }
    }
    document.querySelector(`.task[data-taskindex="${index}"] .subtasks .subtasks-count .count`).innerHTML = doneCount;
    setLengthOfSubtaskBar(index, doneCount);
}

function setLengthOfSubtaskBar(index, doneCount) {
    document.querySelector(`.task[data-taskindex="${index}"] .subtasks-bar .inner`).style.width = `${100*doneCount/allTaskObjects[index].subTasks.length}%`;
}

/**
 * 
 * getParticipantsHtml creates the HTML string for the tasks participant-list
 * @param {object} elem - it contains the JavaScript object with the participants
 * @param {string} pList - it is the string of the participant list.
 *      With every participant a new HTML-string is added to @param pList
 *      When the for-loop has iterated through all the participants, @param pList is being returned
 * 
 */

function getParticipantsHtml(elem) {
    let pList = "";
    if(elem) {
        for(let [key, value] of Object.entries(elem)) {
            if(!value.lastName) {
                pList += `<div class="participant flex-center"><p class="initials">${value.sureName[0]}</p></div>`;
            }else if(!value.sureName) {
                pList += `<div class="participant flex-center"><p class="initials">${value.lastName[0]}</p></div>`;
            }else {
                pList += `<div class="participant flex-center"><p class="initials">${value.sureName[0]}${value.lastName[0]}</p></div>`;
            }
        }
    }
    return pList;
}

/**
 * 
 * getUrgencyHtml looks at the tasks urgency and decides then, which urgency-svg should be written into the tasks HTML
 * @param {string} urgency 
 *
 */

function getUrgencyHtml(urgency) {
    if(urgency === "low") {
        return urgencyLow;
    }else if(urgency === "medium") {
        return urgencyMedium;
    }else if(urgency === "high") {
        return urgencyHigh;
    }
}

/**
 * 
 * renderTask renderes the task-card into the document
 * @param {string} elem - the task-card that has been created in the setTaskHtml function
 * @param {string} id - the id of the column into which the task has to be rendered.
 *      The four possible values are the four possible task-types mentioned above
 * 
 */

function renderTask(elem, id) {
    document.querySelector(`#${id}`).innerHTML += elem;
    userTasks = document.querySelectorAll(".task");
}

/**
 * 
 * The shiftParticipants shifts each participant circle over the last one for 7 pixels to the left
 * The outer forEach-loop iterates through all task-cards and has the parameter @param {node} elem
 *      which is given a new task-card with each iteration
 * Then a new querySelectorAll for the tasks participants is appended to @param elem - now only the participants
 *      of the actual task are considered. Because with a querySelector for all participants appended
 *      to the document, each participant of each task
 *      would have been taken.
 * You have to shift each participant to the right of 7px times the participants index @param i
 *      Otherwise every participant would have shifted leftwards by 7px and there would be no overlapping
 * 
 */

function shiftParticipants() {
    document.querySelectorAll('main .boardCont .board .board-column .column-card-cont .task').forEach((elem) => {
        elem.querySelectorAll(' .participants-and-urgency .participants .participant').forEach((el, i)=>{
            el.style.left = `${-7*i}px`;
        })
    })
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

function setDragDrop() {
    for(task of userTasks) {
        task.addEventListener("dragstart", (event) => {
            dragged = event.target;
        });
    }
   
    for(col of columns) {
        col.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
    
        col.addEventListener("drop", (event) => {
          event.stopPropagation();
          forEachTarget(event);
          setTaskType();
        });
    }
    shiftParticipants();
}

/**
 * 
 * 
 * @param {event} event - dragover-event 
 */

function highlightColumn(event) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelectorAll('.column-card-cont').forEach((elem)=>{
        if(elem.contains(event.target)) {
            elem.classList.add('highlighted');
            return;
        }
    })
}

function unhighlightColumn(event) {
    let unHighlighted = document.querySelector('.highlighted');
    unHighlighted.classList.remove('highlighted');
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
        if(userTasks.length > 0) {
            if(elem.contains(event.target)) {
                elem.classList.remove('highlighted');
                elem.appendChild(dragged);
                checkForEmptyColumns();
                checkForFilledColumns();
            }
        }
    })
}

/**
 * 
 * checkForEmptyColumns looks in which column no task is being set.
 * When the columns empty, the grey dummy-card of that particular column is displayed
 * 
 */

function checkForEmptyColumns() {
    if(document.querySelectorAll('#toDo .task').length === 0) {
        document.querySelector('.no-task-to-do').classList.remove('disNone');
    }
    if(document.querySelectorAll('#inProgress .task').length === 0) {
        document.querySelector('.no-task-in-progress').classList.remove('disNone');
    }
    if(document.querySelectorAll('#awaitFeedback .task').length === 0) {
        document.querySelector('.no-feedback-awaited').classList.remove('disNone');
    }
    if(document.querySelectorAll('#done .task').length === 0) {
        document.querySelector('.no-task-done').classList.remove('disNone');
    }
}

/**
 * 
 * checkForFilledColumns does the exact opposite of checkForEmptyColumns
 * 
 */

function checkForFilledColumns() {
    if(document.querySelectorAll('#toDo .task').length > 0) {
        document.querySelector('.no-task-to-do').classList.add('disNone');
    }
    if(document.querySelectorAll('#inProgress .task').length > 0) {
        document.querySelector('.no-task-in-progress').classList.add('disNone');
    }
    if(document.querySelectorAll('#awaitFeedback .task').length > 0) {
        document.querySelector('.no-feedback-awaited').classList.add('disNone');
    }
    if(document.querySelectorAll('#done .task').length > 0) {
        document.querySelector('.no-task-done').classList.add('disNone');
    }
}

/**
 * 
 * setTaskType resets the type of the dropped task-card
 * 
 */

function setTaskType() {
    dragged.setAttribute('data-taskType', dragged.parentNode.id);
    resetTaskTypeOnFtp();
}

/**
 * 
 * resetTaskTypeOnFtp resets the type of the dropped task on the FTP-server
 *      so that on reloading the page the card gets pushed to the correct
 *      column instead of the old one
 * 
 */

async function resetTaskTypeOnFtp() {
    let res = await fetch(`https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks/${allTaskKeys[+dragged.getAttribute('data-taskIndex')]}/taskType.json`, {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dragged.getAttribute('data-taskType'))
    })
}

/**
 * 
 * searchTasks takes the value of the search-input-field and goes threw every task
 *      checking if the value in the
 *          task title
 *          task description
 *          name or surename of the participant
 * It first checks for the value being in the task title - if not it checks the value
 *      being in the task descrption.
 *      If that is also not the case it checks weather the names/surenames of the participants
 *      contain the input value.
 *      And if none of the names containing the value, the card gets blanked out
 * The function actually checks the objects containing the task infos and then, when nothing is found,
 *      blanks out the task-card with the data-taskIndex of the index @param i
 */

function searchTasks () {
    for(let i=0; i<userTasks.length; i++) {
        if(!allTaskObjects[i].taskTitle.includes(searchBar.value)) { //check if task title includes input value
            if(!allTaskObjects[i].taskDescrip.includes(searchBar.value)) { //check if task description includes input value
                if(!searchInParticipants(i)) { //check if task participants include input valueallTaskObjects[i].taskDescrip.includes(searchBar.value)
                    document.querySelector(`.task[data-taskIndex="${i}"]`).classList.add('disNone');
                }else {document.querySelector(`.task[data-taskIndex="${i}"]`).classList.remove('disNone');}
            }else {document.querySelector(`.task[data-taskIndex="${i}"]`).classList.remove('disNone');}
        }else {document.querySelector(`.task[data-taskIndex="${i}"]`).classList.remove('disNone');}
    }
}

/**
 * 
 * searchInParticipants checks all the participant-names weather they contain one of the given keywords
 *      via two for-loops.
 *      The first loop iterates threw the keywords @param keyword and the second goes threw all the names and surenames
 *      of the the index of i (@param {number} i) of the @param allTaskObjects array.
 *      When at some point somethin is found, the function returns true.
 *      If not (and when it has gone through all participants of the task) it returns false.
 */

function searchInParticipants(i) {
    let keyWords = searchBar.value.split(' ');
    for(let h=0; h<keyWords.length; h++) {
        for(let j=0; j<allTaskObjects[i].participants.length; j++) {
            for(let [key, value] of Object.entries(allTaskObjects[i].participants[j])) {
                if(value.includes(keyWords[h])) { return true; }
            }
        }
    }
    return false;
}

function renderSubtaskOverlay(index) {
    document.querySelector('.overlay-card').setAttribute('data-subtaskIndex', index);
    document.querySelector('.tasks-overlay .overlay-card').innerHTML = /* HTML */ `
        <div class="top-bar flex">${getUserStoryType(index)}</div>
        ${renderTaskTitleIntoOverlay(index)}
        ${renderTopTexts(index)}
        ${renderParticipantsBlock(index)}
        <div class="subtasks-block flex flex-column">
            ${getOverlaySubtasks(index)}
        </div>
        ${renderEditDelete(index)}`;
    document.querySelector('.tasks-overlay').classList.remove('disNone');
}

function getUserStoryType(index) {
    return `<div class="task-type flex-center"><p>User Story</p></div><div class="close-overlay" onclick="closeOverlay()"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.99999 8.40005L2.09999 13.3C1.91665 13.4834 1.68332 13.575 1.39999 13.575C1.11665 13.575 0.883321 13.4834 0.699988 13.3C0.516654 13.1167 0.424988 12.8834 0.424988 12.6C0.424988 12.3167 0.516654 12.0834 0.699988 11.9L5.59999 7.00005L0.699988 2.10005C0.516654 1.91672 0.424988 1.68338 0.424988 1.40005C0.424988 1.11672 0.516654 0.883382 0.699988 0.700049C0.883321 0.516715 1.11665 0.425049 1.39999 0.425049C1.68332 0.425049 1.91665 0.516715 2.09999 0.700049L6.99999 5.60005L11.9 0.700049C12.0833 0.516715 12.3167 0.425049 12.6 0.425049C12.8833 0.425049 13.1167 0.516715 13.3 0.700049C13.4833 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4833 1.91672 13.3 2.10005L8.39999 7.00005L13.3 11.9C13.4833 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4833 13.1167 13.3 13.3C13.1167 13.4834 12.8833 13.575 12.6 13.575C12.3167 13.575 12.0833 13.4834 11.9 13.3L6.99999 8.40005Z" fill="#2A3647"/></svg></div>`;
}

function renderTaskTitleIntoOverlay(index) {
    return /* HTML */ `<div class="flex flex-column" style="width: 100%;">
        <h2 class="hide-for-editing">${allTaskObjects[index].taskTitle}</h2>
        <div class="flex flex-column show-for-editing disNone" style="justify-content: space-between; width: 100%;">
        <div class="flex flex-center cg12"><p class="add">Title</p></div>
            <input type="text" id="new-title-input" value="${allTaskObjects[index].taskTitle}">
        </div>
    </div>`
}

function renderTaskDescriptionIntoOverlay(index) {
    return /* HTML */ `<div class="flex flex-column" style="width: 100%;">
        <h3 class="hide-for-editing">${allTaskObjects[index].taskDescrip}</h3>
        <div class="flex flex-column show-for-editing disNone" style="justify-content: space-between; width: 100%;">
            <div class="flex flex-center cg12"><p class="add">Description</p></div>
            <input type="text" id="new-taskdescrip-input" value="${allTaskObjects[index].taskDescrip}">
        </div>
    </div>`
}

function getDate(index = -1) {
    let yearMonthDay;
    if(index > -1) {
        if(allTaskObjects[index].date) {
            yearMonthDay = allTaskObjects[index].date.split('-');
            return '<p>'+yearMonthDay[2]+'/'+yearMonthDay[1]+'/'+yearMonthDay[0]+'</p>';
        }else {
            return `<p>0</p>`;
        }
    }else {
        yearMonthDay = document.querySelector(('#date-input')).value.split('-');
    }
}

function renderTopTexts(index) {
    return /* HTML */ `<div class="top-texts flex-column">
        ${renderTaskDescriptionIntoOverlay(index)}
        <div class="due-date flex hide-for-editing"><p>Due date:</p>${getDate(index)}</div>
        <div class="flex flex-column show-for-editing disNone" style="row-gap: 16px;">
            <p>Due date</p>
            <input type="date" id="date-input" required="">
        </div>
        <div class="flex flex-column">
            <div class="flex flex-column" style="row-gap: 16px;">
                <div class="urgency flex hide-for-editing">
                    <p>Priority:</p>
                    <div class="flex flex-center" style="column-gap: 10px">
                        <p>${allTaskObjects[index].urgency}</p>
                        ${getUrgencyHtml(allTaskObjects[index].urgency)}
                    </div>
                </div>
                <div class="flex flex-column show-for-editing disNone">
                    <p>Priority</p>
                    ${renderUrgencyButtons(index)}
                </div>
            </div>
        </div>
    </div>`;
}

function renderUrgencyButtons(index) {
    return /* HTML */ `<div class="reset-urgency flex show-for-editing disNone">
        <div class="choose-prio-container">
            <div class="choose-prio-button flex flex-center" id="prio-high-button" onclick="resetUrgency(${index}, 'high')" data-resetUrgency="high">
                <span id="prio-high" class="flex flex-center">Urgent</span>
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"></path>
                    <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"></path>
                </svg>  
            </div>
            <div class="choose-prio-button flex flex-center" id="prio-medium-button" onclick="resetUrgency(${index}, 'medium')" data-resetUrgency="medium">
                <span id="prio-medium" class="flex flex-center">Medium</span>
                <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_200223_4295)">
                        <path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" fill="#FFA800"></path>
                        <path d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z" fill="#FFA800"></path>
                    </g>
                    <defs>
                        <clipPath id="clip0_200223_4295">
                            <rect width="20" height="7.45098" fill="white" transform="translate(0.248535 0.274414)"></rect>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div class="choose-prio-button flex flex-center" id="prio-low-button" onclick="resetUrgency(${index}, 'low')" data-resetUrgency="low">
                <span id="prio-low" class="flex flex-center">Low</span>
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"></path>
                    <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"></path>
                </svg> 
            </div>
        </div>
    </div>`
}

function renderParticipantsBlock(index) {
    return /* HTML */ `
    <div class="flex flex-column hide-for-editing">
        <p>Assigned to</p>
        <ul class="chosen-list flex flex-column"></ul>
    </div>
    <div id="assigned-container" class="flex flex-column show-for-editing disNone">
        <p>Assigned to</p>
        <div name="Select contacts to assign" class="select-container contacts" style="position: relative;" onclick="showHideContactList(event)">
            <div class="flex flex-center contacts-inner">
                <p>Select contacts to assign</p>
                <svg class="triangle" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
                </svg>
            </div>
            <div class="flex flex-column contact-list"></div>
        </div>
        <ul class="chosen-list flex flex-center"></ul>
    </div>`;
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

function renderSelectContacts() {
    let selectContacts = document.querySelector('.add-task-overlay-box .contact-list');
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
    renderSelectContactsOverlay();
}

function renderSelectContacts() {
    document.querySelector('.add-task-overlay-box .contact-list').innerHTML = /* HTML */ ``;
    allContactsObjects.forEach((elem, i)=>{
        document.querySelector('.add-task-overlay-box .contact-list').innerHTML += /* HTML */ `<div class="flex flex-center contact" data-selectindex="${i}" onclick="selectOverlayContact(event)">
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

function renderSelectContactsOverlay() {
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

function selectOverlayContact(event) {
    event.stopPropagation();
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').classList.add('chosen');
    }
    getParticipants();
}

function showName(i) {
    document.querySelector(`.name-block${i}`).classList.remove('disNone');
}

function hideName(i) {
    document.querySelector(`.name-block${i}`).classList.add('disNone');
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
    renderHiddenChosenList();
}

function renderHiddenChosenList() {
    document.querySelector('.chosen-list').innerHTML = '';
    participantsArray.forEach((elem, i)=>{
        document.querySelector('.chosen-list').innerHTML += /* HTML */ `<li><div class="flex flex-center circle" onclick="removeParticipantOverlay(${i})" onmouseover="showName(${i})" onmouseleave="hideName(${i})">
            <p>${elem.sureName[0]}${elem.lastName[0]}</p>
            <div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem.sureName} ${elem.lastName}<br>Click icon to remove</p></div>
        </div>
    </li>`;
    })
    document.querySelector('.chosen-list').classList.remove('disNone');
}

function removeParticipant(i) {
    participantsArray.splice(i, 1);
    document.querySelectorAll('.contact.chosen')[i].classList.remove('chosen');
    renderChosenList();
}

function removeParticipantOverlay(i) {
    participantsArray.splice(i, 1);
    document.querySelectorAll('.contact.chosen')[i].classList.remove('chosen');
    renderChosenList();
}

function renderChosenList() {
    document.querySelector('.chosen-list').innerHTML = '';
    participantsArray.forEach((elem, i)=>{
        document.querySelector('.chosen-list').innerHTML += /* HTML */ `<li><div class="flex flex-center circle" title="Click to remove ${elem.sureName} ${elem.lastName}" onclick="removeParticipant(${i})" onmouseover="showName(${i})" onmouseleave="hideName(${i})">
            <p>${elem.sureName[0]}${elem.lastName[0]}</p>
            <div class="name-block${i} name-block disNone"><p>${elem.sureName} ${elem.lastName}</p></div>
        </div>
    </li>`;
    })
    document.querySelector('.chosen-list').classList.remove('disNone');
}

function choosePrio(event, prio) {
    event.preventDefault();
    if(event.target.closest('.choose-prio-button').classList.contains(`prio-${prio}-button-bg-color`)) {
        event.target.closest('.choose-prio-button').classList.remove(`prio-${prio}-button-bg-color`);
        selectedPrio = "medium";
        return;
    }
    document.getElementById("prio-high-button").classList.remove("prio-high-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");
    event.target.closest('.choose-prio-button').classList.add(`prio-${prio}-button-bg-color`);
    selectedPrio = prio;
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

function setCategory(event) {
    event.preventDefault();
    document.querySelector('.category-name').innerHTML = event.target.innerHTML;
    categoryType = event.target.closest('.category').querySelector('p').innerHTML;
}

function showCrossTic() {
    document.querySelector('.subtask-input .add').classList.add('disNone');
    document.querySelector('.cross-tic').classList.remove('disNone');
    document.querySelector('.subtask-input').style.border = "1px solid blue";
}

function hideCrossTic() {
    document.querySelector('.subtask-input').style.border = "1px solid #d1d1d1";
    document.querySelector('.subtask-input .add').classList.remove('disNone');
    document.querySelector('.cross-tic').classList.add('disNone');
}

function renderAllContactsToSelect() {
    let options = "";
    allContactsObjects.forEach((el, i)=>{
        options += /* HTML */ `<option data-participantIndex="${i}">${el.sureName} ${el.lastName}</option>`;
    })
    return options;
}

function getParticipantsHtmlOverlay(elem) {
    let participantBlock = "";
    if(elem) {
        elem.forEach((el, index)=>{
            if(!el.hasOwnProperty('sureName')) {
                participantBlock += /* HTML */ `<div class="flex-column participant-block" data-participantOverlayIndex="${index}" style="row-gap: 12px;"><div class="flex-center" style="column-gap: 11px;"><div class="overlay-participant flex"><div class="circle flex-center"><p>${el.lastName[0]}</p></div><div class="full-name"><p>${el.lastName}</p></div></div><img class="show-for-editing disNone" src="./assets/img/delete.svg" alt="" onclick="removeParticipant(event, ${index})"></div></div>`;
            }else if(!el.hasOwnProperty('lastName')) {
                participantBlock += /* HTML */ `<div class="flex-column participant-block" data-participantOverlayIndex="${index}" style="row-gap: 12px;"><div class="flex-center" style="column-gap: 11px;"><div class="overlay-participant flex"><div class="circle flex-center"><p>${el.sureName[0]}</p></div><div class="full-name"><p>${el.sureName}</p></div></div><img class="show-for-editing disNone" src="./assets/img/delete.svg" alt="" onclick="removeParticipant(event, ${index})"></div></div>`;
            }else {
                participantBlock += /* HTML */ `<div class="flex-column participant-block" data-participantOverlayIndex="${index}" style="row-gap: 12px;"><div class="flex-center" style="column-gap: 11px;"><div class="overlay-participant flex"><div class="circle flex-center"><p>${el.sureName[0]}${el.lastName[0]}</p></div><div class="full-name"><p>${el.sureName} ${el.lastName}</p></div></div><img class="show-for-editing disNone" src="./assets/img/delete.svg" alt="" onclick="removeParticipant(event, ${index})"></div></div>`;
            }
        })
    }
    return participantBlock;
}

function addParticipant(index) {
    if(isParticipantYet(index)) {
        return;
    }else {
        let pIndex = +document.querySelector('#participantsSelectOverlay').options[document.querySelector('#participantsSelectOverlay').selectedIndex].getAttribute('data-participantIndex');
        if(!allTaskObjects[index].participants) {
            allTaskObjects[index].participants = [];
        }
        allTaskObjects[index].participants.push({sureName: allContactsObjects[pIndex].sureName, lastName: allContactsObjects[pIndex].lastName});
        actualizeTaskOnRemote(index);
        renderSubtaskOverlay(index);
        reRenderTask(index);
    }
}

function isParticipantYet(index) {
    pName = "";
    if(allTaskObjects[index].participants) {
        for(let i=0; i<allTaskObjects[index].participants.length; i++) {
            pName = allTaskObjects[index].participants[i].sureName + " " + allTaskObjects[index].participants[i].lastName;
            if(pName === document.querySelector('#participantsSelectOverlay').options[document.querySelector('#participantsSelectOverlay').selectedIndex].value) {
                return true;
            }else if(pName != document.querySelector('#participantsSelectOverlay').options[document.querySelector('#participantsSelectOverlay').selectedIndex].value){
                if(i+1 === allTaskObjects[index].participants.length) {
                    return false;
                }
            }
        }
    }else {return false;}
}

function removeOverlayParticipant(event) {
    let index = +document.querySelector('.overlay-card').getAttribute('data-subtaskindex');
    allTaskObjects[index].participants.splice(+event.target.closest('.participant-block').getAttribute('data-participantOverlayIndex'), 1);
    //allTaskKeys[index].participants.splice(+event.target.closest('.participant-block').getAttribute('data-participantOverlayIndex'), 1);
    actualizeTaskOnRemote(index);
    renderSubtaskOverlay(index);
    reRenderTask(index);
}

async function actualizeTaskOnRemote(index) {
    response = await fetch(tasksURL+`/${allTaskKeys[index]}.json`, {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allTaskObjects[index])
    })
}

function getOverlaySubtasks(index) {
    let input = "";
    let inputLabel = "";
    if(allTaskObjects[index].hasOwnProperty('subTasks')) {
        allTaskObjects[index].subTasks.forEach((elem, j)=>{
            if(elem.subTaskDone == 1) {
                input = `<input id="checkbox${index}${j}" type="checkbox" checked>`;
            }else {input = `<input id="checkbox${index}${j}" type="checkbox">`;}
            inputLabel += /* HTML */ `<div class="flex-center" style="column-gap: 10px;"><div class="subtask-check flex" onclick="actualizeSubtaskStatus(${index}, ${j})">${input}<label for="checkbox${index}${j}">${allTaskObjects[index].subTasks[j].subTaskTitle}</label></div><img class="show-for-editing disNone" src="./assets/img/delete.svg" alt="" style="width: 18px; height: 18px;" onclick="deleteSubtask(${index}, ${j})"></div>`;
        })
        inputLabel = `<div class="subtasks"><div class="flex flex-center show-for-editing disNone" style="column-gap: 20px;"></div>${inputLabel}</div>`;
    }
    return /* HTML */ `<div class="flex flex-center" stlye="justify-content: space-between;"><p>Subtasks:</p><div class="flex flex-center show-for-editing disNone" style="column-gap: 20px; width: 100%;"><input type="text" id="new-subtask-input"><div class="flex flex-center cg12" onclick="addSubtask(${index})"><p class="add">Add subtask</p></div></div></div>`+inputLabel;
}

function addSubtask(index) {
    if(!allTaskObjects[index].subTasks) {
        allTaskObjects[index].subTasks = [];
    }
    allTaskObjects[index].subTasks.push({subTaskDone: 0, subTaskTitle: document.querySelector('#new-subtask-input').value});
    setSubtaskArray();
    renderSubtaskOverlay(index);
    actualizeSubtaskStatus(index, allTaskObjects[index].subTasks.length-1);
    actualizeTaskOnRemote(index);
    checkIfSubtasksExist();
}

function deleteSubtask(index, j) {
    allTaskObjects[index].subTasks.splice(j, 1);
    renderSubtaskOverlay(index);
    actualizeTaskOnRemote(index);
    checkIfSubtasksExist();
}

function renderEditDelete(index) {
    return /* HTML */`<div class="editDelete flex">
        <div class="delete flex" onclick="deleteTask(${index})">
            <img src="./assets/img/bin.svg" alt="">
            <p>Delete</p>
        </div>
        <div class="separator hide-for-editing"></div>
        <div class="edit hide-for-editing flex" onclick="showEditingElements(${index})">
            <img src="./assets/img/pen.svg" alt="">
            <p>Edit</p>
        </div>
        <div class="separator show-for-editing disNone"></div>
        <div class="stop-editing flex show-for-editing disNone" onclick="hideEditingElements()">
            <p>Stop Editing</p>
        </div>
    </div>`;
}

// function editTitle(index) {
//     allTaskObjects[index].taskTitle = document.querySelector('#new-title-input').value;
//     renderSubtaskOverlay(index);
//     reRenderTask(index);
//     actualizeTaskOnRemote(index);
// }

// function editTaskDescription(index) {
//     allTaskObjects[index].taskDescrip = document.querySelector('#new-taskdescrip-input').value;
//     renderSubtaskOverlay(index);
//     reRenderTask(index);
//     actualizeTaskOnRemote(index);
// }

function resetUrgency(index, prio) {
    newUrgency = prio;
    restyleUrgencyButtons(event.target.closest('.choose-prio-button'), prio);
    allTaskObjects[index].urgency = prio;
}

function restyleUrgencyButtons(elem, prio) {
    if(document.querySelector('.prio-low-button-bg-color')){
        document.querySelector('.prio-low-button-bg-color').classList.remove('prio-low-button-bg-color');
    }else if(document.querySelector('.prio-medium-button-bg-color')) {
        document.querySelector('.prio-medium-button-bg-color').classList.remove('prio-medium-button-bg-color');
    }else if(document.querySelector('.prio-high-button-bg-color')) {
        document.querySelector('.prio-high-button-bg-color').classList.remove('prio-high-button-bg-color');
    }
    elem.classList.add(`prio-${prio}-button-bg-color`);
}

function deleteTask(index) {
    allTaskObjects.splice(index, 1);
    allTaskKeys.splice(index, 1);
    document.querySelector(`.task[data-taskindex="${index}"]`).classList.add('disNone');
    deleteTaskOnRemote(index);
    closeOverlay();
}

function showEditingElements(index) {
    document.querySelectorAll('.hide-for-editing').forEach((el)=>{el.classList.add('disNone')});
    document.querySelectorAll('.show-for-editing').forEach((el)=>{el.classList.remove('disNone')});
}

function hideEditingElements() {
    document.querySelectorAll('.show-for-editing').forEach((el)=>{
        el.classList.add('disNone');
    });
    document.querySelectorAll('.hide-for-editing').forEach((el)=>{
        el.classList.remove('disNone');
    })
}

async function deleteTaskOnRemote(index) {
    let response = await fetch(tasksURL+'.json', {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allTaskObjects)
    })
}

function actualizeSubtaskStatus(index, j) {
    if(document.querySelector(`#checkbox${index}${j}`).checked) {
        allTaskObjects[index].subTasks[j].subTaskDone = 1;
    }else {
        allTaskObjects[index].subTasks[j].subTaskDone = 0;
    }
    postActualizedSubtaskStatus(index, j);
}

async function postActualizedSubtaskStatus(index, j) {
    let link = `https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks/${index}/subTasks/${allSubtasksArray[index][j][0]}/subTaskDone.json`;
    let response = await fetch(link, {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allSubtasksArray[index][j][1].subTaskDone)
    })
    checkDoneSubTasks(index);
}

function checkForSubtasks(index) {
    if(allTaskObjects[index].subTasks.length > 0) {
        return;
    }else {
        document.querySelector(`.task[data-taskindex="${index}"] .subtasks`).classList.add('disNone');
    }
}

function reRenderTask(index) {
    let elem = allTaskObjects[index];
    let cardInner = /* HTML */ `<div class="task-type flex-center"><p>User Story</p></div>
    <div class="headlineDescription flex-column">
        <h2>${elem.taskTitle}</h2>
        <div class="task-description"><p>${elem.taskDescrip}</p></div>
    </div>
    <div class="subtasks flex-center">
        <div class="subtasks-bar"><div class="inner"></div></div>
        <p class="subtasks-count"><span class="count"></span>/<span class="total"></span> Subtasks</p>
    </div>
    <div class="participants-and-urgency flex">
        <div class="participants flex">${getParticipantsHtml(elem.participants)}</div>
        <div class="menu flex">${getUrgencyHtml(elem.urgency)}</div>
    </div>`;
    document.querySelectorAll('.task')[index].innerHTML = cardInner;
    checkIfSubtasksExist();
}

function closeOverlay() {
    document.querySelector('.tasks-overlay').classList.add('disNone');
}

function openAddTaskOverlay() {
    document.querySelector('.add-task-overlay').classList.remove('disNone');
}

function closeAddTaskOverlay() {
    document.querySelector('.add-task-overlay').classList.add('disNone');
}

function createTask(event) {
    event.preventDefault();
    let newTaskObject = {
        category: categoryType,
        date: getDate(),
        participants: getNewParticipants(),
        subTasks: newSubtasksArray,
        taskDescrip: document.querySelector('#textarea-input').value,
        taskTitle: document.querySelector('#title-input').value,
        taskType: "toDo",
        urgency: newUrgency
    }
    allTaskObjects.push(newTaskObject);
    postNewTask(event);
}

async function postNewTask(event) {
    event.preventDefault();
    let response = await fetch(tasksURL+'.json', {
        method: 'PUT',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify(allTaskObjects)
    });
}

function getNewParticipants() {
    let contactsArr = [];
    document.querySelectorAll('.add-task-overlay-box .contact.chosen').forEach((elem)=>{
        contactsArr.push(allContactsObjects[+elem.getAttribute('data-selectindex')]);
    })
    return contactsArr;
}

function clearSubtaskInput() {
    document.querySelector('.add-task-overlay-box .subtask-input input').value = "";
    hideCrossTic();
}

function getNewDate() {
    let yearMonthDay = document.querySelector('#new-date').value.split('-');
    return yearMonthDay[2]+'/'+yearMonthDay[1]+'/'+yearMonthDay[0];
}

function addSubtaskOverlay() {
    let subtaskInput = document.querySelector('.add-task-overlay-box .subtask-input input');
    if(subtaskInput.value === "") {
        hideCrossTic();
        return;
    }else {
        if(checkIfSubtaskExists()) {
            subtaskInput.value = '';
            alert('Subtask already exists');
        }else {
            newSubtasksArray.push({subTaskDone: 0, subTaskTitle: subtaskInput.value})
            renderSubtaskList();
            subtaskInput.value = '';
        }
        hideCrossTic();
    }
}

function checkIfSubtaskExists() {
    let subtaskInput = document.querySelector('.add-task-overlay-box .subtask-input input');
    for(let i=0; i<newSubtasksArray.length; i++) {
        if(newSubtasksArray[i].subTaskTitle === subtaskInput.value) {
            return true;
        }else if(newSubtasksArray[i].subTaskTitle != subtaskInput.value) {
            if(i+1 === newSubtasksArray.length) {
                return false;
            }
        }
    }
}

function renderSubtaskList() {
    document.querySelector('.subtask-list').innerHTML = '';
    newSubtasksArray.forEach((elem, i)=>{
        document.querySelector('.subtask-list').innerHTML += /* HTML */ `<li id="subtask-li-${i}" class="flex flex-center" style="column-gap: 12px;" onmouseover="fadeInPenBin(${i})" onmouseleave="fadeOutPenBin(${i})">
            <p class="subtask-title-p-${i}">${elem.subTaskTitle}</p>
            <div class="pen-bin-subtask flex flex-center" id="pen-bin-subtask-${i}">
                <img src="./assets/img/pen.svg" alt="" onclick="editSubtask(${i})">
                <img src="./assets/img/bin.svg" alt="" onclick="removeSubtask(${i})">
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
    newSubtasksArray[i].subTaskTitle = document.querySelector(`#edit-subtask-input-${i}`).value;
    renderSubtaskList();
    document.querySelector(`#edit-subtask-${i}`).classList.add('disNone');
}

function removeSubtask(i) {
    newSubtasksArray.splice(i, 1);
    renderSubtaskList();
}