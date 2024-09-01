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
    if(response) {for(let i=0; i<response.length; i++) {allTaskObjects.push(response[i]);}}
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
                puffer = allContactsObjects[i];
                allContactsObjects[i] = allContactsObjects[j];
                allContactsObjects[j] = puffer;
            }else if (allContactsObjects[i].lastName === allContactsObjects[j].lastName) {
                if(allContactsObjects[i].sureName != "" || allContactsObjects[j].sureName != "") {
                    if (allContactsObjects[i].sureName > allContactsObjects[j].sureName) {
                        puffer = structuredClone(allContactsObjects[i]);
                        allContactsObjects[i] = allContactsObjects[j];
                        allContactsObjects[j] = puffer;
                    }
                }else if(allContactsObjects[i].sureName != "" || allContactsObjects[j].sureName != "") {
                    if(allContactsObjects[i].email > allContactsObjects[j].email) {
                        puffer = allContactsObjects[i];
                        allContactsObjects[i] = allContactsObjects[j];
                        allContactsObjects[j] = puffer;
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
    if(!localStorage.UserId) {
        return "";
    }
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

/**
 * 
 * The @function actualizeTaskTypes goes threw each task and checks the id of its column.
 * Because the tasks key "taskType" gets the same value as the id of its column the task can be assigned
 * correctly when the page is reloaded.
 */
function actualizeTaskTypes() {
    columns.forEach((elem)=>{
        elem.querySelectorAll('.task').forEach((task)=>{
            allTaskObjects[+task.getAttribute('data-taskindex')].taskType = elem.id;
        })
    })
    reRenderTasks();
    collectNotDeletedTasks();
}

/**
 * 
 * @param {event} event for getting the target.
 * The target is the column, the card is dragged over (but not dropped in).
 * That column gets a grey background.
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