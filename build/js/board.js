const taskURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks.json';
const columns = document.querySelectorAll(".column-card-cont");
let searchBar = document.querySelector('#findTaskInput');
let userTasks;
let allTaskKeys = [];
let allSubtasksArray = [];
let allTaskObjects = [];
let foundTasks = [];
let urgencyLow = /* HTML */ `<div class="urgency-icon"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.99974 7.24524C8.80031 7.24557 8.60603 7.18367 8.44549 7.06863L0.876998 1.63467C0.778524 1.56391 0.695351 1.47498 0.632227 1.37296C0.569103 1.27094 0.527264 1.15784 0.5091 1.0401C0.472414 0.802317 0.534386 0.560105 0.681381 0.366747C0.828377 0.17339 1.04835 0.0447247 1.29292 0.00905743C1.53749 -0.0266099 1.78661 0.0336422 1.98549 0.176559L8.99974 5.2075L16.014 0.17656C16.1125 0.105795 16.2243 0.0545799 16.3431 0.02584C16.462 -0.00289994 16.5855 -0.00860237 16.7066 0.00905829C16.8277 0.0267189 16.944 0.0673968 17.0489 0.128769C17.1538 0.190142 17.2453 0.271007 17.3181 0.366748C17.3909 0.462489 17.4436 0.571231 17.4731 0.686765C17.5027 0.802299 17.5085 0.922362 17.4904 1.0401C17.4722 1.15784 17.4304 1.27094 17.3672 1.37296C17.3041 1.47498 17.221 1.56391 17.1225 1.63467L9.55398 7.06863C9.39344 7.18367 9.19917 7.24557 8.99974 7.24524Z" fill="#7AE229"/><path d="M8.99998 12.0001C8.80055 12.0005 8.60628 11.9386 8.44574 11.8235L0.877242 6.38955C0.678366 6.24664 0.546029 6.03276 0.509344 5.79498C0.472658 5.5572 0.53463 5.31499 0.681625 5.12163C0.828621 4.92827 1.0486 4.79961 1.29317 4.76394C1.53773 4.72827 1.78686 4.78853 1.98574 4.93144L8.99998 9.96239L16.0142 4.93144C16.2131 4.78853 16.4622 4.72827 16.7068 4.76394C16.9514 4.79961 17.1713 4.92827 17.3183 5.12163C17.4653 5.31499 17.5273 5.5572 17.4906 5.79498C17.4539 6.03276 17.3216 6.24664 17.1227 6.38956L9.55423 11.8235C9.39369 11.9386 9.19941 12.0005 8.99998 12.0001Z" fill="#7AE229"/></svg></div>`;
let urgencyMedium = /* HTML */ `<div class="urgency-icon"><svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5685 7.16658L1.43151 7.16658C1.18446 7.16658 0.947523 7.06773 0.772832 6.89177C0.598141 6.71581 0.5 6.47716 0.5 6.22831C0.5 5.97947 0.598141 5.74081 0.772832 5.56485C0.947523 5.38889 1.18446 5.29004 1.43151 5.29004L16.5685 5.29004C16.8155 5.29004 17.0525 5.38889 17.2272 5.56485C17.4019 5.74081 17.5 5.97947 17.5 6.22831C17.5 6.47716 17.4019 6.71581 17.2272 6.89177C17.0525 7.06773 16.8155 7.16658 16.5685 7.16658Z" fill="#FFA800"/><path d="M16.5685 2.7098L1.43151 2.7098C1.18446 2.7098 0.947523 2.61094 0.772832 2.43498C0.598141 2.25902 0.5 2.02037 0.5 1.77152C0.5 1.52268 0.598141 1.28403 0.772832 1.10807C0.947523 0.932105 1.18446 0.833252 1.43151 0.833252L16.5685 0.833252C16.8155 0.833252 17.0525 0.932105 17.2272 1.10807C17.4019 1.28403 17.5 1.52268 17.5 1.77152C17.5 2.02037 17.4019 2.25902 17.2272 2.43498C17.0525 2.61094 16.8155 2.7098 16.5685 2.7098Z" fill="#FFA800"/></svg></div>`;
let urgencyHigh = /* HTML */ `<div class="urgency-icon"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.00002 4.75476C9.19945 4.75443 9.39372 4.81633 9.55427 4.93137L17.1228 10.3653C17.2212 10.4361 17.3044 10.525 17.3675 10.627C17.4307 10.7291 17.4725 10.8422 17.4907 10.9599C17.5273 11.1977 17.4654 11.4399 17.3184 11.6333C17.1714 11.8266 16.9514 11.9553 16.7068 11.9909C16.4623 12.0266 16.2131 11.9664 16.0143 11.8234L9.00002 6.7925L1.98577 11.8234C1.8873 11.8942 1.77545 11.9454 1.65662 11.9742C1.53779 12.0029 1.4143 12.0086 1.2932 11.9909C1.1721 11.9733 1.05577 11.9326 0.950844 11.8712C0.845915 11.8099 0.754446 11.729 0.681662 11.6333C0.608878 11.5375 0.556201 11.4288 0.52664 11.3132C0.49708 11.1977 0.491215 11.0776 0.509379 10.9599C0.527545 10.8422 0.569382 10.7291 0.632508 10.627C0.695632 10.525 0.778805 10.4361 0.87728 10.3653L8.44577 4.93137C8.60631 4.81633 8.80059 4.75443 9.00002 4.75476Z" fill="#FF3D00"/><path d="M9.00002 -0.000121266C9.19945 -0.000455511 9.39372 0.0614475 9.55427 0.176482L17.1228 5.61045C17.3216 5.75336 17.454 5.96724 17.4907 6.20502C17.5273 6.4428 17.4654 6.68501 17.3184 6.87837C17.1714 7.07173 16.9514 7.20039 16.7068 7.23606C16.4623 7.27173 16.2131 7.21147 16.0143 7.06856L9.00002 2.03761L1.98577 7.06856C1.78689 7.21147 1.53777 7.27173 1.2932 7.23606C1.04863 7.20039 0.828657 7.07173 0.681662 6.87837C0.534667 6.68501 0.472695 6.4428 0.509379 6.20502C0.546065 5.96723 0.678402 5.75336 0.87728 5.61044L8.44577 0.176482C8.60631 0.0614474 8.80059 -0.000455546 9.00002 -0.000121266Z" fill="#FF3D00"/></svg></div>`;
let dragged = null;
//let draggableObjs;


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
    let fetchedTasks = await fetch(taskURL);
    fetchedTasks = await fetchedTasks.json();
    for(const [key, value] of Object.entries(fetchedTasks)) {
        allTaskKeys.push(key);
        allTaskObjects.push(value);
    }
    setSubtaskArray();
    setTasksHtml();
}

function setSubtaskArray() {
    let subTaskArray = [];
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
    countSubTasks();
    checkForEmptyColumns();
    checkForFilledColumns();
    shiftParticipants();
    setDragDrop();
}

function countSubTasks() {
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
    for(let [key, value] of Object.entries(elem)) {
        if(!value.lastName) {
            pList += `<div class="participant flex-center"><p class="initials">${value.sureName[0]}</p></div>`;
        }else if(!value.sureName) {
            pList += `<div class="participant flex-center"><p class="initials">${value.lastName[0]}</p></div>`;
        }else {
            pList += `<div class="participant flex-center"><p class="initials">${value.sureName[0]}${value.lastName[0]}</p></div>`;
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
    console.log('');
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
    document.querySelector('.tasks-overlay .overlay-card').innerHTML = `
        <div class="top-bar flex">${getUserStoryType(index)}</div>
        <h2>${allTaskObjects[index].taskTitle}</h2>
        <div class="top-texts flex-column">
            <h3>${allTaskObjects[index].taskDescrip}</h3>
            <div class="due-date flex"><p>Due date:</p>${getDate()}</div>
            <div class="urgency flex">
                <p>Priority:</p>
                <div class="urgency-right flex-center">
                    <p>${allTaskObjects[index].urgency}</p>
                    ${getUrgencyHtml(allTaskObjects[index].urgency)}
                </div>
            </div>
        </div>
        <div class="participants-block flex-column">
            <p>Assigned to:</p>
            <div class="participants flex-column">${getParticipantsHtmlOverlay(allTaskObjects[index].participants)}</div>
        </div>
        ${getOverlaySubtasks(index)}`;
    document.querySelector('.tasks-overlay').classList.remove('disNone');
}

function getUserStoryType(index) {
    return `<div class="task-type flex-center"><p>User Story</p></div><div class="close-overlay" onclick="closeOverlay()"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.99999 8.40005L2.09999 13.3C1.91665 13.4834 1.68332 13.575 1.39999 13.575C1.11665 13.575 0.883321 13.4834 0.699988 13.3C0.516654 13.1167 0.424988 12.8834 0.424988 12.6C0.424988 12.3167 0.516654 12.0834 0.699988 11.9L5.59999 7.00005L0.699988 2.10005C0.516654 1.91672 0.424988 1.68338 0.424988 1.40005C0.424988 1.11672 0.516654 0.883382 0.699988 0.700049C0.883321 0.516715 1.11665 0.425049 1.39999 0.425049C1.68332 0.425049 1.91665 0.516715 2.09999 0.700049L6.99999 5.60005L11.9 0.700049C12.0833 0.516715 12.3167 0.425049 12.6 0.425049C12.8833 0.425049 13.1167 0.516715 13.3 0.700049C13.4833 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4833 1.91672 13.3 2.10005L8.39999 7.00005L13.3 11.9C13.4833 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4833 13.1167 13.3 13.3C13.1167 13.4834 12.8833 13.575 12.6 13.575C12.3167 13.575 12.0833 13.4834 11.9 13.3L6.99999 8.40005Z" fill="#2A3647"/></svg></div>`;
}

function getDate(index) {
    return `<p>0</p>`;
}

function getParticipantsHtmlOverlay(elem) {
    let participantBlock = "";
    elem.forEach((el)=>{
        if(!el.hasOwnProperty('sureName')) {
            participantBlock += /* HTML */ `<div class="overlay-participant flex"><div class="circle flex-center"><p>${el.lastName[0]}</p></div><div class="full-name"><p>${el.lastName}</p></div></div>`;
        }else if(!el.hasOwnProperty('lastName')) {
            participantBlock += /* HTML */ `<div class="overlay-participant flex"><div class="circle flex-center"><p>${el.sureName[0]}</p></div><div class="full-name"><p>${el.sureName}</p></div></div>`;
        }else {
            participantBlock += /* HTML */ `<div class="overlay-participant flex"><div class="circle flex-center"><p>${el.sureName[0]}${el.lastName[0]}</p></div><div class="full-name"><p>${el.sureName} ${el.lastName}</p></div></div>`;
        }
    })
    return participantBlock;
}

function getOverlaySubtasks(index) {
    let input = "";
    let inputLabel = "";
    if(allTaskObjects[index].hasOwnProperty('subTasks')) {
        allTaskObjects[index].subTasks.forEach((elem, j)=>{
            if(elem.subTaskDone == 1) {
                input = `<input id="checkbox${index}${j}" type="checkbox" checked>`;
            }else {input = `<input id="checkbox${index}${j}" type="checkbox">`;}
            inputLabel += `<div class="subtask-check flex" onclick="actualizeSubtaskStatus(${index}, ${j})">${input}<label for="checkbox${index}${j}">${allTaskObjects[index].subTasks[j].subTaskTitle}</label></div>`;
        })
        inputLabel = `<div class="subtasks-block flex-column"><p>Subtasks:</p><div class="subtasks">${inputLabel}</div></div>`;
    }
    return inputLabel;
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

function closeOverlay() {
    document.querySelector('.tasks-overlay').classList.add('disNone');
}