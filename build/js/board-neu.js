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

async function getTasks() {
    includeHTML();
    let response = await fetch(tasksURL+'.json');
    response = await response.json();
    for(let i=0; i<response.length; i++) {
        allTaskObjects.push(response[i])
    }
    getContacts();
    checkIfSubtasksExist();
    checkIfParticipantsExist();
    renderTasks();
    showHideGreyTaskCards();
}

async function getContacts() {
    let response = await fetch(contactsURL+'.json');
    response = await response.json();
    for(let [key, value] of Object.entries(response)) {
        allContactsObjects.push(value);
    }
    renderContactListAdd();
}

function checkIfSubtasksExist() {
    for(let i=0; i<allTaskObjects.length; i++) {
        if(!allTaskObjects[i].subTasks) {
            allTaskObjects[i].subTasks = [];
        }
    }
}

function checkIfParticipantsExist() {
    for(let i=0; i<allTaskObjects.length; i++) {
        if(!allTaskObjects[i].participants) {
            allTaskObjects[i].participants = [];
        }
    }
}

function renderTasks() {
    allTaskObjects.forEach((elem, index)=>{
        let card = /* HTML */ `<div class="task flex-column" draggable="true" data-taskType="${elem.taskType}" data-taskIndex="${index}" onclick="renderTaskIntoOverlay(${index})">
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
            </div>
        </div>`;
        document.querySelector(`#${elem.taskType}`).innerHTML += card;
        setDragDrop();
    });
}

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

function getUrgencyHtml(urgency) {
    if(urgency === "low") {
        return urgencyLow;
    }else if(urgency === "medium") {
        return urgencyMedium;
    }else if(urgency === "high") {
        return urgencyHigh;
    }
}

function countDoneSubtasks(index) {
    doneCount = 0;
    for(let i=0; i<allTaskObjects[index].subTasks.length; i++) {
        if(allTaskObjects[index].subTasks[i].subTaskDone === 1) {
            doneCount++;
        }
    }
    return doneCount;
}

function showHideGreyTaskCards() {
    if(document.querySelectorAll('#toDo .task').length > 0) {
        document.querySelector('.no-task-to-do').classList.add('disNone');
    }else if(document.querySelectorAll('#toDo .task').length === document.querySelectorAll('#toDo .task.completely-hidden').length) {
        document.querySelector('.no-task-to-do').classList.remove('disNone');
    }
    if(document.querySelectorAll('#inProgress .task').length > 0) {
        document.querySelector('.no-task-in-progress').classList.add('disNone');
    }else if(document.querySelectorAll('#inProgress .task').length === document.querySelectorAll('#toDo .task.completely-hidden').length) {
        document.querySelector('.no-task-in-progress').classList.remove('disNone');
    }
    if(document.querySelectorAll('#awaitFeedback .task').length > 0) {
        document.querySelector('.no-feedback-awaited').classList.add('disNone');
    }else if(document.querySelectorAll('#awaitFeedback .task').length === document.querySelectorAll('#toDo .task.completely-hidden').length) {
        document.querySelector('.no-feedback-awaited').classList.remove('disNone');
    }
    if(document.querySelectorAll('#done .task').length > 0) {
        document.querySelector('.no-task-done').classList.add('disNone');
    }else if(document.querySelectorAll('#done .task').length === document.querySelectorAll('#toDo .task.completely-hidden').length) {
        document.querySelector('.no-task-done').classList.remove('disNone');
    }
}

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

function actualizeTaskTypes() {
    columns.forEach((elem)=>{
        elem.querySelectorAll('.task').forEach((task)=>{
            allTaskObjects[+task.getAttribute('data-taskindex')].taskType = elem.id;
        })
    })
    reRenderTasks();
    collectNotDeletedTasks();
}

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

function shiftParticipantCirclesInTask() {
    document.querySelectorAll('main .boardCont .board .board-column .column-card-cont .task').forEach((elem) => {
        elem.querySelectorAll(' .participants-and-urgency .participants .participant').forEach((el, i)=>{
            el.style.left = `${-7*i}px`;
        })
    })
}

function renderTaskIntoOverlay(index) {
    document.querySelector('.overlay-card').setAttribute('data-taskindex', index); //if no task-index is given to a function, the data-taskindex can be checked for the tasks index.
    document.querySelector('.tasks-overlay .overlay-card .inner').innerHTML = /* HTML */ `
        <div class="top-bar flex"><div class="task-category flex-center" style="background-color: ${allTaskObjects[index].category === 'User Story' ? '#00338f' : '#1fd7c1'};"><p>${allTaskObjects[index].category}</p></div><div class="close-overlay" onclick="closeOverlay(${index})"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.99999 8.40005L2.09999 13.3C1.91665 13.4834 1.68332 13.575 1.39999 13.575C1.11665 13.575 0.883321 13.4834 0.699988 13.3C0.516654 13.1167 0.424988 12.8834 0.424988 12.6C0.424988 12.3167 0.516654 12.0834 0.699988 11.9L5.59999 7.00005L0.699988 2.10005C0.516654 1.91672 0.424988 1.68338 0.424988 1.40005C0.424988 1.11672 0.516654 0.883382 0.699988 0.700049C0.883321 0.516715 1.11665 0.425049 1.39999 0.425049C1.68332 0.425049 1.91665 0.516715 2.09999 0.700049L6.99999 5.60005L11.9 0.700049C12.0833 0.516715 12.3167 0.425049 12.6 0.425049C12.8833 0.425049 13.1167 0.516715 13.3 0.700049C13.4833 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4833 1.91672 13.3 2.10005L8.39999 7.00005L13.3 11.9C13.4833 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4833 13.1167 13.3 13.3C13.1167 13.4834 12.8833 13.575 12.6 13.575C12.3167 13.575 12.0833 13.4834 11.9 13.3L6.99999 8.40005Z" fill="#2A3647"/></svg></div></div>
        ${renderTaskTitleIntoOverlay(index)}
        ${renderTopTextsIntoOverlay(index)}
        ${renderParticipantsBlockIntoOverlay(index)}
        <div class="subtasks-block flex flex-column">
            ${getSubtasksOverlay(index)}
        </div>`;
        document.querySelector('.overlay-card').innerHTML += `<div class="flex flex-center edit-delete">${renderEditDelete(index)}</div>`;
    document.querySelector('.tasks-overlay').classList.remove('disNone');
}

function renderTaskTitleIntoOverlay(index) {
    return /* HTML */ `<div class="flex flex-column" style="width: 100%;">
        <h2 class="hide-for-editing">${allTaskObjects[index].taskTitle}</h2>
        <div class="flex flex-column show-for-editing disNone" style="justify-content: space-between; width: 100%;">
        <div class="flex flex-center cg12"><p class="add">Title</p></div>
            <input type="text" id="title-input-overlay" value="${allTaskObjects[index].taskTitle}">
        </div>
    </div>`;
}

function renderTopTextsIntoOverlay(index) {
    return /* HTML */ `<div class="top-texts flex-column">
        ${renderTaskDescriptionIntoOverlay(index)}
        <div class="due-date flex hide-for-editing"><p>Due date:</p><p>${document.querySelector('#date-input-overlay') ? restyleDateString(allTaskObjects[index].date) : restyleDateString(allTaskObjects[index].date)}</p></div>
        <div class="due-date flex flex-column show-for-editing disNone" style="row-gap: 16px;">
            <p>Due date</p>
            <input type="date" id="date-input-overlay" required="" value="${allTaskObjects[index].date}">
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

function renderTaskDescriptionIntoOverlay(index) {
    return /* HTML */ `<div class="flex flex-column" style="width: 100%;">
        <h3 class="hide-for-editing">${allTaskObjects[index].taskDescrip}</h3>
        <div class="flex flex-column show-for-editing disNone" style="justify-content: space-between; width: 100%;">
            <div class="flex flex-center cg12"><p class="add">Description</p></div>
            <input type="text" id="task-descrip-overlay" value="${allTaskObjects[index].taskDescrip}">
        </div>
    </div>`;
}

function getUrgencyHtml(urgency) {
    if(urgency === "low") {
        return urgencyLow;
    }else if(urgency === "medium") {
        return urgencyMedium;
    }else if(urgency === "high") {
        return urgencyHigh;
    }
}

function renderUrgencyButtons(index) {
    return /* HTML */ `<div class="reset-urgency flex show-for-editing disNone">
        <div class="choose-prio-container">
            <div class="choose-prio-button flex flex-center prio-high-button ${allTaskObjects[index].urgency === "high" ? "prio-high-button-bg-color chosen-urgency" : ""}" onclick="chooseUrgencyOverlay(event)" data-resetUrgency="high">
                <span id="prio-high" class="flex flex-center" onclick="chooseUrgencyOverlay(event)">Urgent</span>
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"></path>
                    <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"></path>
                </svg>  
            </div>
            <div class="choose-prio-button flex flex-center prio-medium-button ${allTaskObjects[index].urgency === "medium" ? "prio-medium-button-bg-color chosen-urgency" : ""}" onclick="chooseUrgencyOverlay(event)" data-resetUrgency="medium">
                <span id="prio-medium" class="flex flex-center" onclick="chooseUrgencyOverlay(event)">Medium</span>
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
            <div class="choose-prio-button flex flex-center prio-low-button ${allTaskObjects[index].urgency === "low" ? "prio-low-button-bg-color chosen-urgency" : ""}" onclick="chooseUrgencyOverlay(event)" data-resetUrgency="low">
                <span id="prio-low" class="flex flex-center" onclick="chooseUrgencyOverlay(event)">Low</span>
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"></path>
                    <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"></path>
                </svg> 
            </div>
        </div>
    </div>`;
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
        return document.querySelector(('#date-input-add')).value;
    }
}

function renderParticipantsBlockIntoOverlay(index) {
    return /* HTML */ `
    <div class="flex flex-column hide-for-editing">
        <p style="font-size: 20px;">Assigned to</p>
        <ul class="chosen-list front flex-column">${renderChosenListFrontOverlay(index)}</ul>
    </div>
    <div class="assigned-container flex flex-column show-for-editing disNone" onmousedown="hideContactListOverlay(event)">
        <p style="font-size: 20px;">Assigned to</p>
        <div name="Select contacts to assign" class="select-container contacts" style="position: relative;">
            <div class="flex flex-center contacts-inner">
            <input class="search-contacts" placeholder="Select contacts to assign" onkeyup="searchForContactsOverlay(event)" onmouseup="showContactListOverlay(event)">
                <svg class="triangle" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
                </svg>
            </div>
            <div class="contact-list disNone">${renderContactList(index)}</div>
        </div>
        <ul class="chosen-list back flex flex-center">${renderChosenListBackOverlay(index)}</ul>
    </div>`;
}

function renderChosenListFrontOverlay(index) {
    let list = "";
    if(allTaskObjects[index].participants) {
        let elem = allTaskObjects[index].participants;
        for(let i=0; i<allTaskObjects[index].participants.length; i++) {
            list += /* HTML */ `<li class="flex flex-center"><div class="flex flex-center circle" style="background-color: ${elem[i].color}">
                <p>${elem[i].sureName[0]}${elem[i].lastName[0]}</p>
                <div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem[i].sureName} ${elem[i].lastName}<br>Click icon to remove</p></div>
            </div>
            <p>${elem[i].sureName} ${elem[i].lastName}</p>
        </li>`;
        }
    }
    return list;
}

function getSubtasksOverlay(index) {
    let input = "";
    let inputLabel = "";
    if(allTaskObjects[index].subTasks) {
        allTaskObjects[index].subTasks.forEach((elem, j)=>{
            input = `<input id="checkbox${index}${j}" type="checkbox" ${elem.subTaskDone === 1 ? 'checked' : ''} onmouseup="actualizeSubtaskStatus(event, ${index}, ${j})">`;
            inputLabel += /* HTML */ `<div class="flex-center" style="width: 100%; justify-content: flex-start;"><div class="subtask-check flex">${input}<p for="checkbox${index}${j}">${allTaskObjects[index].subTasks[j].subTaskTitle}</p></div><img class="show-for-editing disNone" src="./assets/img/delete.svg" alt="" style="width: 18px; height: 18px;" onclick="deleteSubtask(${index}, ${j})"></div>`;
        })
        inputLabel = `<div class="hide-for-editing"><p>Subtasks</p><div class="subtasks"><div class="flex flex-center show-for-editing disNone" style="column-gap: 20px;"></div>${inputLabel}</div></div>`;
    }
    return /* HTML */ `<div class="flex flex-column" stlye="justify-content: space-between;">
        <div class="flex flex-center show-for-editing disNone" style="column-gap: 20px; width: 100%;">
            <div id="substasks-container" class="flex-column">
                <span class="subtitle">Subtasks</span>
                <div class="flex flex-center subtask-input">
                    <input type="text" id="choose-subtasks-overlay" placeholder="Add new subtask" onkeyup="if(event.key === 'Enter'){showCrossTicOverlay()}" onfocus="showCrossTicOverlay()">
                    <svg class="add" width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.24854 8H1.24854C0.965202 8 0.727702 7.90417 0.536035 7.7125C0.344368 7.52083 0.248535 7.28333 0.248535 7C0.248535 6.71667 0.344368 6.47917 0.536035 6.2875C0.727702 6.09583 0.965202 6 1.24854 6H6.24854V1C6.24854 0.716667 6.34437 0.479167 6.53604 0.2875C6.7277 0.0958333 6.9652 0 7.24854 0C7.53187 0 7.76937 0.0958333 7.96104 0.2875C8.1527 0.479167 8.24854 0.716667 8.24854 1V6H13.2485C13.5319 6 13.7694 6.09583 13.961 6.2875C14.1527 6.47917 14.2485 6.71667 14.2485 7C14.2485 7.28333 14.1527 7.52083 13.961 7.7125C13.7694 7.90417 13.5319 8 13.2485 8H8.24854V13C8.24854 13.2833 8.1527 13.5208 7.96104 13.7125C7.76937 13.9042 7.53187 14 7.24854 14C6.9652 14 6.7277 13.9042 6.53604 13.7125C6.34437 13.5208 6.24854 13.2833 6.24854 13V8Z" fill="#2A3647"></path>
                    </svg>
                    <div class="flex flex-center cross-tic disNone">
                        <div class="clear-subtask-input" onclick="clearSubtaskInputOverlay()">
                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926 6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </div>
                        <div onclick="addSubtaskOverlay(${index})">
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.79923 9.15L14.2742 0.675C14.4742 0.475 14.7117 0.375 14.9867 0.375C15.2617 0.375 15.4992 0.475 15.6992 0.675C15.8992 0.875 15.9992 1.1125 15.9992 1.3875C15.9992 1.6625 15.8992 1.9 15.6992 2.1L6.49923 11.3C6.29923 11.5 6.0659 11.6 5.79923 11.6C5.53256 11.6 5.29923 11.5 5.09923 11.3L0.79923 7C0.59923 6.8 0.503397 6.5625 0.51173 6.2875C0.520064 6.0125 0.62423 5.775 0.82423 5.575C1.02423 5.375 1.26173 5.275 1.53673 5.275C1.81173 5.275 2.04923 5.375 2.24923 5.575L5.79923 9.15Z" fill="black"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <ul class="subtask-list flex flex-column" id="subtask-list-overlay">${allTaskObjects[index].subTasks.length > 0 ? renderSubtaskListOverlay(index) : ""}</ul>
            </div>
        </div>
    </div>`+inputLabel;
}

function renderSubtaskListOverlay(index) {
    let list = "";
    allTaskObjects[index].subTasks.forEach((elem, i)=>{
        list += /* HTML */ `<li id="subtask-li-${i}" class="flex flex-center" style="column-gap: 12px;" onmouseover="fadeInPenBin(${i})" onmouseleave="fadeOutPenBin(${i})">
            <p class="subtask-title-p-overlay-${i}">${elem.subTaskTitle}</p>
            <div class="pen-bin-subtask-overlay pen-bin-subtask flex flex-center" id="pen-bin-subtask-overlay-${i}">
                <img src="./assets/img/pen.svg" alt="" onclick="editSubtaskOverlay(${index}, ${i})">
                <img src="./assets/img/bin.svg" alt="" onclick="removeSubtaskOverlay(${index}, ${i})">
            </div>
            <div class="edit-subtask flex flex-center disNone" id="edit-subtask-overlay-${index}${i}" style="justify-content: space-between;">
                <input type="text" id="edit-subtask-input-overlay-${index}${i}" value="${elem.subTaskTitle}">
                <div class="bin-check flex flex-center">
                    <img src="./assets/img/bin.svg" alt="" onclick="removeSubtaskOverlay(${index}, ${i})">
                    <img src="./assets/img/check-icon-black.svg" alt="" onclick="changeSubtaskOverlay(${index}, ${i})">
                </div>
            </div>
        </li>`
    })
    return list;
}

function renderContactList(index) {
    //document.querySelector('.overlay-card .contact-list').innerHTML = '';
    let list = "";
    allContactsObjects.forEach((elem, i)=>{
        list += `<div class="flex flex-center contact ${preselectParticipantsinContactListOverlay(index, elem.contactId) ? 'chosen' : ''}" data-contactindex="${i}" onmousedown="selectContactOverlay(event, ${index})">
            <div class="flex flex-center contact-left">
                <div class="flex flex-center circle" style="background-color: ${elem.color}"><p>${elem.sureName[0]}${elem.lastName[0]}</p></div>
                <p class="contact-name">${elem.sureName} ${elem.lastName}</p>
            </div>
            <svg class="not-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/></svg>
            <svg class="is-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="white"/>
                <path d="M5 9L9 13L17 1.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/>
            </svg>
        </div>`;
    })
    return list;
}

function preselectParticipantsinContactListOverlay(index, id) {
    for(let i=0; i<allContactsObjects.length; i++) {
        for(let j=0; j<allTaskObjects[index].participants.length; j++) {
            if(id === allTaskObjects[index].participants[j].contactId) {
                return true;
            }else {
                if(i+1 === allContactsObjects.length) {
                    return false;
                }
            }
        }
    }
}

function renderEditDelete(index) {
    return /* HTML */ `
    <div class="delete flex hide-for-editing" onclick="deleteTask(${index})">
        <img src="./assets/img/bin.svg" alt="">
        <p>Delete</p>
    </div>
    <div class="separator hide-for-editing"></div>
    <div class="edit flex hide-for-editing" onclick="showEditingElements()">
        <img src="./assets/img/pen.svg" alt="">
        <p>Edit</p>
    </div>
    <div class="recreate-task flex flex-center show-for-editing disNone" onclick="actualizeTask(${index})">
        <p>Ok</p>
        <img src="../../assets/img/check-icon.svg" alt="">
    </div> `;
}

function actualizeSubtaskStatus(event, i, j) {
    event.stopPropagation();
    if(allTaskObjects[i].subTasks[j].subTaskDone === 1) {
        allTaskObjects[i].subTasks[j].subTaskDone = 0;
    }else {
        allTaskObjects[i].subTasks[j].subTaskDone = 1;
    }
    reRenderTasks();
}

function closeOverlay(index) {
    hideEditingElements();
    document.querySelector('.tasks-overlay').classList.add('disNone');
    collectNotDeletedTasks();
}

async function actualizeTaskOnRemote() {
    let response = await fetch(tasksURL+'.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allTaskObjects)
    })
}

function showEditingElements() {
    document.querySelectorAll('.hide-for-editing').forEach((el)=>{el.classList.add('disNone')});
    document.querySelectorAll('.show-for-editing').forEach((el)=>{el.classList.remove('disNone')});
}

function hideEditingElements() {
    document.querySelectorAll('.hide-for-editing').forEach((el)=>{el.classList.remove('disNone')});
    document.querySelectorAll('.show-for-editing').forEach((el)=>{el.classList.add('disNone')});
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

function restyleDateString(dateString) {
    dateString = dateString.split('-');
    dateString = dateString[2]+'/'+dateString[1]+'/'+dateString[0];
    return dateString;
}

function chooseUrgencyOverlay(event) {
    let classes = ['prio-high-button-bg-color', 'prio-medium-button-bg-color', 'prio-low-button-bg-color'];
    for(let i=0; i<3; i++) {
        document.querySelectorAll('.overlay-card .choose-prio-button')[i].classList.remove(classes[i]);
        document.querySelectorAll('.overlay-card .choose-prio-button')[i].classList.remove('chosen-urgency');
    }
    event.target.closest('.choose-prio-button').classList.add(`prio-${event.target.getAttribute('data-resetUrgency')}-button-bg-color`);
    event.target.closest('.choose-prio-button').classList.add('chosen-urgency');
}

function showContactListOverlay(event) {
    document.querySelector('.overlay-card .contact-list').classList.remove('disNone');
}

function hideContactListOverlay(event) {
    event.stopPropagation();
    document.querySelector('.overlay-card .contact-list').classList.add('disNone');
}

function searchForContactsOverlay(event) {
    let input = document.querySelector('.overlay-card .search-contacts');
    document.querySelectorAll('.overlay-card .contact-name').forEach((elem)=>{
        if(elem.innerHTML.includes(input.value)) {
            elem.closest('.contact').classList.remove('disNone');
        }else {
            elem.closest('.contact').classList.add('disNone');
        }
    })
}

function renderChosenListBackOverlay(index) {
    let list = "";
    allTaskObjects[index].participants.forEach((elem, i)=>{
        list += /* HTML */ `<li><div class="flex flex-center circle" onclick="removeParticipantOverlay(${index}, ${i})" style="background-color: ${elem.color}">
            <p>${elem.sureName[0]}${elem.lastName[0]}</p>
            <div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem.sureName} ${elem.lastName}<br>Click icon to remove</p></div>
        </div>
    </li>`;
    })
    return list;
}

function selectContactOverlay(event, index) {
    let newParticipantsOverlay = [];
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').closest('.contact').classList.add('chosen');
    }
    document.querySelectorAll('.overlay-card .contact.chosen').forEach((elem)=>{
        newParticipantsOverlay.push(allContactsObjects[+elem.getAttribute('data-contactindex')]);
    });
    allTaskObjects[index].participants = newParticipantsOverlay;
    reRenderChosenListBackOverlay(index);
}

function reRenderChosenListBackOverlay(index) {
    let list = "";
    allTaskObjects[index].participants.forEach((elem, i)=>{
        list += /* HTML */ `<li><div class="flex flex-center circle" onclick="removeParticipantOverlay(${index}, ${i})" style="background-color: ${elem.color}">
            <p>${elem.sureName[0]}${elem.lastName[0]}</p>
                <div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem.sureName} ${elem.lastName}<br>Click icon to remove</p></div>
            </div>
        </li>`;
    })
    document.querySelector('.overlay-card .chosen-list.back').innerHTML = list;
}

function removeParticipantOverlay(index, j) {
    let newParticipantsOverlay = allTaskObjects[index].participants;
    newParticipantsOverlay.splice(j, 1);
    allTaskObjects[index].participants = newParticipantsOverlay;
    actualizeContactListOverlay(index);
    reRenderChosenListBackOverlay(index);
}

function actualizeContactListOverlay(index) {
    for(let h=0; h<allContactsObjects.length; h++) {
        document.querySelectorAll('.overlay-card .contact-list .contact')[h].classList.remove('chosen');
    }
    for(let i=0; i<allContactsObjects.length; i++) {
        for(let j=0; j<allTaskObjects[index].participants.length; j++) {
            if(allContactsObjects[i].contactId === allTaskObjects[index].participants[j].contactId) {
                document.querySelectorAll('.overlay-card .contact-list .contact')[i].classList.add('chosen');
            }
        }
    }
}

function showCrossTicOverlay() {
    document.querySelector('.overlay-card .subtask-input .add').classList.add('disNone');
    document.querySelector('.overlay-card .cross-tic').classList.remove('disNone');
    document.querySelector('.overlay-card .subtask-input').style.border = "1px solid blue";
}

function hideCrossTicOverlay() {
    document.querySelector('.overlay-card .subtask-input .add').classList.remove('disNone');
    document.querySelector('.overlay-card .cross-tic').classList.add('disNone');
    document.querySelector('.overlay-card .subtask-input').style.border = "1px solid black";
}

function clearSubtaskInputOverlay() {
    document.querySelector('#choose-subtasks-overlay').value = "";
    hideCrossTicOverlay();
}

function addSubtaskOverlay(index) {
    if(document.querySelector('#choose-subtasks-overlay').value != "") {
        newSubtaskList = allTaskObjects[index].subTasks;
        newSubtaskList.push({
            subTaskDone: 0,
            subTaskTitle: document.querySelector('#choose-subtasks-overlay').value
        });
        document.querySelector('#choose-subtasks-overlay').value = "";
        allTaskObjects[index].subTasks = newSubtaskList;
    }
    reRenderSubtaskListOverlay(index);
    hideCrossTicOverlay();
}

function reRenderSubtaskListOverlay(index) {
    let list = "";
    allTaskObjects[index].subTasks.forEach((elem, i)=>{
        list += /* HTML */ `<li id="subtask-li-${i}" class="flex flex-center" style="column-gap: 12px;" onmouseover="fadeInPenBin(${i})" onmouseleave="fadeOutPenBin(${i})">
            <p class="subtask-title-p-overlay-${i}">${elem.subTaskTitle}</p>
            <div class="pen-bin-subtask-overlay pen-bin-subtask flex flex-center" id="pen-bin-subtask-overlay-${i}">
                <img src="./assets/img/pen.svg" alt="" onclick="editSubtaskOverlay(${index}, ${i})">
                <img src="./assets/img/bin.svg" alt="" onclick="removeSubtaskOverlay(${index}, ${i})">
            </div>
            <div class="edit-subtask flex flex-center disNone" id="edit-subtask-overlay-${index}${i}" style="justify-content: space-between;">
                <input type="text" id="edit-subtask-input-overlay-${index}${i}" value="${elem.subTaskTitle}">
                <div class="bin-check flex flex-center">
                    <img src="./assets/img/bin.svg" alt="" onclick="removeSubtaskOverlay(${index}, ${i})">
                    <img src="./assets/img/check-icon-black.svg" alt="" onclick="changeSubtaskOverlay(${index}, ${i})">
                </div>
            </div>
        </li>`
    })
    document.querySelector('#subtask-list-overlay').innerHTML = "";
    document.querySelector('#subtask-list-overlay').innerHTML = list;
}

function editSubtaskOverlay(index, j) {
    newSubtaskList = allTaskObjects[index].subTasks;
    document.querySelector(`#edit-subtask-overlay-${index}${j}`).classList.remove('disNone');
    document.querySelector(`#edit-subtask-input-overlay-${index}${j}`).focus();
}

function changeSubtaskOverlay(index, j) {
    newSubtaskList[j].subTaskTitle = document.querySelector(`#edit-subtask-input-overlay-${index}${j}`).value;
    allTaskObjects[index].subTasks = newSubtaskList;
    reRenderSubtaskListOverlay(index);
}

function removeSubtaskOverlay(index, j) {
    newSubtaskList = allTaskObjects[index].subTasks;
    newSubtaskList.splice(j, 1);
    allTaskObjects[index].subTasks = newSubtaskList;
    reRenderSubtaskListOverlay(index);
}

function actualizeTask(index) {
    let newTaskObject = {
        taskId: allTaskObjects[index].taskId,
        category: allTaskObjects[index].category,
        date: document.querySelector('#date-input-overlay').value,
        deleted: 0,
        subTasks: allTaskObjects[index].subTasks,
        participants: allTaskObjects[index].participants,
        taskDescrip: document.querySelector('#task-descrip-overlay').value,
        taskTitle: document.querySelector('#title-input-overlay').value,
        taskType: allTaskObjects[index].taskType,
        urgency: document.querySelector('.overlay-card .chosen-urgency').getAttribute('data-resetUrgency'),
        amountOfEditing: allTaskObjects[index].amountOfEditing ? allTaskObjects[index].amountOfEditing+1 : 0
    };
    allTaskObjects[index] = structuredClone(newTaskObject);
    reRenderTasks();
    closeOverlay(index);
}

function deleteTask(index) {
    allTaskObjects[index].deleted = 1;
    document.querySelector(`.task[data-taskindex="${index}"]`).classList.add('completely-hidden');
    closeOverlay();
}

function openAddTaskOverlay() {
    newSubtasksArrayAdd = [];
    document.querySelector('.add-task-overlay').classList.remove('disNone');
}

function closeOverlayAdd() {
    document.querySelector('.add-task-overlay').classList.add('disNone');
    clearOverlayAdd();
}

function clearOverlayAdd() {
    document.querySelector('#title-input-add').value = "";
    document.querySelector('#task-descrip-add').value = "";
    document.querySelector('.add-task-overlay-box .search-contacts').value = "";
    document.querySelector('.add-task-overlay-box .chosen-list').innerHTML = "";
    document.querySelector('#date-input-add').value = "";
    //resetUrgencyAdd();
    document.querySelector('.add-task-overlay-box .category-name').innerHTML = "Select task category";
    document.querySelector('#choose-subtasks-add').value = "";
    document.querySelector('.add-task-overlay-box .subtask-list').innerHTML = "";
    document.querySelectorAll('.add-task-overlay-box .contact-list .contact.chosen').forEach((elem)=>{elem.classList.remove('chosen');});
}

function selectContactAdd(event) {
    event.stopPropagation();
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').classList.add('chosen');
    }
    getParticipantsAdd();
}

function searchForContactsAdd(event) {
    let input = document.querySelector('.add-task-overlay-box .search-contacts');
    document.querySelectorAll('.add-task-overlay-box .contact-name').forEach((elem)=>{
        if(elem.innerHTML.includes(input.value)) {
            elem.closest('.contact').classList.remove('disNone');
        }else {
            elem.closest('.contact').classList.add('disNone');
        }
    })
}

function selectContactAdd(event) {
    event.stopPropagation();
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').classList.add('chosen');
    }
    getParticipantsAdd();
}

function getParticipantsAdd() {
    participantsArrayAdd = [];
    document.querySelectorAll('.add-task-overlay-box .contact.chosen').forEach((elem)=>{
        participantsArrayAdd.push(allContactsObjects[+elem.getAttribute('data-selectindex')]);
    })
    renderChosenListAdd();
}

function renderChosenListAdd() {
    document.querySelector('.add-task-overlay-box .chosen-list').innerHTML = '';
    participantsArrayAdd.forEach((elem, i)=>{
        document.querySelector('.chosen-list').innerHTML += /* HTML */ `<li><div class="flex flex-center circle" onclick="removeParticipantAdd(${i})" onmouseover="showNameAdd(${i})" onmouseleave="hideNameAdd(${i})" style="background-color: ${elem.color}">
            <p>${elem.sureName[0]}${elem.lastName[0]}</p>
            <div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem.sureName} ${elem.lastName}<br>Click icon to remove</p></div>
        </div>
    </li>`;
    })
    document.querySelector('.add-task-overlay-box .chosen-list').classList.remove('disNone');
}

function showNameAdd(i) {
    document.querySelector(`.name-block${i}`).classList.remove('disNone');
}

function hideNameAdd(i) {
    document.querySelector(`.name-block${i}`).classList.add('disNone');
}

function removeParticipantAdd(i) {
    participantsArrayAdd.splice(i, 1);
    document.querySelectorAll('.add-task-overlay-box .contact.chosen')[i].classList.remove('chosen');
    renderChosenListAdd();
}

function showHideContactListAdd(event) {
    if(document.querySelector('.add-task-overlay-box .contact-list').classList.contains('disNone')) {
        document.querySelector('.add-task-overlay-box .contact-list').classList.remove('disNone');
        document.querySelector('.add-task-overlay-box .contacts .contacts-inner .triangle').classList.add('rotated');
    }else {
        document.querySelector('.add-task-overlay-box .contact-list').classList.add('disNone');
        document.querySelector('.add-task-overlay-box .contacts .contacts-inner .triangle').classList.remove('rotated');
    }
}

function renderContactListAdd() {
    //document.querySelector('.overlay-card .contact-list').innerHTML = '';
    let list = "";
    allContactsObjects.forEach((elem, index)=>{
        list += `<div class="flex flex-center contact" onmousedown="selectContactAdd(event, ${index})" data-selectindex="${index}">
            <div class="flex flex-center contact-left">
                <div class="flex flex-center circle" style="background-color: ${elem.color}"><p>${elem.sureName[0]}${elem.lastName[0]}</p></div>
                <p class="contact-name">${elem.sureName} ${elem.lastName}</p>
            </div>
            <svg class="not-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/></svg>
            <svg class="is-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="white"/>
                <path d="M5 9L9 13L17 1.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/>
            </svg>
        </div>`;
    })
    document.querySelector('.add-task-overlay-box .contact-list').innerHTML = list;
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

function choosePrioAdd(event, prio) {
    event.preventDefault();
    if(event.target.closest('.choose-prio-button').classList.contains(`prio-${prio}-button-bg-color`)) {
        event.target.closest('.choose-prio-button').classList.remove(`prio-${prio}-button-bg-color`);
        event.target.closest('.choose-prio-button').classList.remove(`chosen-prio`);
        selectedPrio = "medium";
        return;
    }
    document.getElementById("prio-high-button").classList.remove("prio-high-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");
    event.target.closest('.choose-prio-button').classList.add(`prio-${prio}-button-bg-color`);
    event.target.closest('.choose-prio-button').classList.remove(`chosen-prio`);
    selectedPrio = prio;
}

function renderSubtaskListAdd() {
    document.querySelector('.add-task-overlay-box .subtask-list').innerHTML = '';
    newSubtasksArrayAdd.forEach((elem, i)=>{
        document.querySelector('.add-task-overlay-box .subtask-list').innerHTML += /* HTML */ `<li id="subtask-li-${i}" class="flex flex-center" style="column-gap: 12px;" onmouseover="fadeInPenBin(${i})" onmouseleave="fadeOutPenBin(${i})">
            <p class="subtask-title-p-add-${i}">${elem.subTaskTitle}</p>
            <div class="pen-bin-subtask-add pen-bin-subtask flex flex-center" id="pen-bin-subtask-add-${i}">
                <img src="./assets/img/pen.svg" alt="" onclick="editSubtaskAdd(${i})">
                <img src="./assets/img/bin.svg" alt="" onclick="removeSubtaskAdd(${i})">
            </div>
            <div class="edit-subtask flex flex-center disNone" id="edit-subtask-add-${i}" style="justify-content: space-between;">
                <input type="text" id="edit-subtask-input-add-${i}" value="${elem.subTaskTitle}">
                <div class="bin-check flex flex-center">
                    <img src="./assets/img/bin.svg" alt="" onclick="removeSubtaskAdd(${i})">
                    <img src="./assets/img/check-icon-black.svg" alt="" onclick="changeSubtaskAdd(${i})">
                </div>
            </div>
        </li>`
    })
    document.querySelector('.subtask-list').classList.remove('disNone');
}

function showCrossTicAdd() {
    document.querySelector('.add-task-overlay-box .subtask-input .add').classList.add('disNone');
    document.querySelector('.add-task-overlay-box .cross-tic').classList.remove('disNone');
    document.querySelector('.add-task-overlay-box .subtask-input').style.border = "1px solid blue";
}

function hideCrossTicAdd() {
    document.querySelector('.add-task-overlay-box .subtask-input').style.border = "1px solid #d1d1d1";
    document.querySelector('.add-task-overlay-box .subtask-input .add').classList.remove('disNone');
    document.querySelector('.add-task-overlay-box .cross-tic').classList.add('disNone');
}

function addSubtaskAdd() {
    let subtaskInput = document.querySelector('.add-task-overlay-box .subtask-input input');
    if(subtaskInput.value === "") {
        hideCrossTicAdd();
    }else {
        if(checkIfSubtaskExistsAdd()) {
            subtaskInput.value = '';
        }else {
            newSubtasksArrayAdd.push({subTaskDone: 0, subTaskTitle: subtaskInput.value})
            renderSubtaskListAdd();
            subtaskInput.value = '';
        }
        hideCrossTicAdd();
    }
}

function checkIfSubtaskExistsAdd() {
    let subtaskInput = document.querySelector('.add-task-overlay-box .subtask-input input');
    for(let i=0; i<newSubtasksArrayAdd.length; i++) {
        if(newSubtasksArrayAdd[i].subTaskTitle === subtaskInput.value) {
            return true;
        }else if(newSubtasksArrayAdd[i].subTaskTitle != subtaskInput.value) {
            if(i+1 === newSubtasksArrayAdd.length) {
                return false;
            }
        }
    }
}

function editSubtaskAdd(i) {
    let editElem = document.querySelector(`#edit-subtask-add-${i}`);
    document.querySelector(`.subtask-title-p-add-${i}`).classList.add('disNone');
    document.querySelector(`#pen-bin-subtask-add-${i}`).classList.add('disNone');
    editElem.classList.remove('disNone');
    document.querySelector(`#edit-subtask-input-add-${i}`).focus();
}

function changeSubtaskAdd(i) {
    newSubtasksArrayAdd[i].subTaskTitle = document.querySelector(`#edit-subtask-input-add-${i}`).value;
    renderSubtaskListAdd();
    document.querySelector(`#edit-subtask-add-${i}`).classList.add('disNone');
}

function clearSubtaskInputAdd() {
    document.querySelector('.add-task-overlay-box .subtask-input input').value = "";
    hideCrossTicAdd();
}

function removeSubtaskAdd(i) {
    newSubtasksArrayAdd.splice(i, 1);
    renderSubtaskListAdd();
}

function clearOverlayAdd() {
    document.querySelector('#title-input-add').value = "";
    document.querySelector('#task-descrip-add').value = "";
    document.querySelector('.add-task-overlay-box .search-contacts').value = "";
    document.querySelector('.add-task-overlay-box .chosen-list').innerHTML = "";
    document.querySelector('#date-input-add').value = "";
    resetUrgencyAdd();
    document.querySelector('.add-task-overlay-box .category-name').innerHTML = "Select task category";
    document.querySelector('#choose-subtasks-add').value = "";
    document.querySelector('.add-task-overlay-box .subtask-list').innerHTML = "";
    document.querySelectorAll('.add-task-overlay-box .contact-list .contact.chosen').forEach((elem)=>{elem.classList.remove('chosen');});
}

function resetUrgencyAdd() {
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[0].classList.remove('prio-high-button-bg-color');
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[1].classList.remove('prio-medium-button-bg-color');
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[2].classList.remove('prio-low-button-bg-color');
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[1].classList.add('prio-medium-button-bg-color');
    newUrgency = "medium";
}

function searchTasks () {
    for(let i=0; i<allTaskObjects.length; i++) {
        if(allTaskObjects[i].taskTitle.toUpperCase().indexOf(searchBar.value.toUpperCase()) === -1) { //check if task title includes input value
            if(allTaskObjects[i].taskDescrip.toUpperCase().indexOf(searchBar.value.toUpperCase()) === -1) { //check if task description includes input value
                document.querySelector(`.board .task[data-taskindex="${i}"]`).classList.add('disNone');
            }else {document.querySelector(`.board .task[data-taskindex="${i}"]`).classList.remove('disNone');}
        }else {document.querySelector(`.board .task[data-taskindex="${i}"]`).classList.remove('disNone');}
    }
}

function addNewTask(event) {
    event.preventDefault();
    let newTask = {
        taskId: Math.random(),
        category: document.querySelector('.add-task-overlay-box p.category-name').innerHTML === "Technical Task" ? "Technical Task" : "User Story",
        date: document.querySelector('#date-input-add').value,
        deleted: 0,
        subTasks: newSubtasksArrayAdd,
        participants: participantsArrayAdd,
        taskDescrip: document.querySelector('#task-descrip-add').value,
        taskTitle: document.querySelector('#title-input-add').value,
        taskType: 'toDo',
        urgency: selectedPrio,
        amountOfEditing: 0
    };
    allTaskObjects.push(newTask);
    renderNewTask(allTaskObjects.length-1);
    closeOverlayAdd();
}

function renderNewTask(index) {
    let elem = allTaskObjects[index];
    let card = /* HTML */ `<div class="task flex-column" draggable="true" data-taskType="${elem.taskType}" data-taskIndex="${index}" onclick="renderTaskIntoOverlay(${index})">
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
        </div>
    </div>`;
    document.querySelector(`#${elem.taskType}`).innerHTML += card;
    showHideGreyTaskCards();
    setDragDrop();
    collectNotDeletedTasks();
}

function collectNotDeletedTasks() {
    notDeletedTasks = [];
    for(let i=0; i<allTaskObjects.length; i++) {
        if(!allTaskObjects[i].deleted) {
            notDeletedTasks.push(allTaskObjects[i]);
        }
    }
    getActualTaskStateOfRemote();
}

async function getActualTaskStateOfRemote() {
    let response = await fetch(tasksURL+'.json');
    response = await response.json();
    actualTasksOnRemote = [];
    for(let [key, value] of Object.entries(response)) {
        actualTasksOnRemote.push(value);
    }
    actualizeNotDeletedTasks();
}

function actualizeNotDeletedTasks() {
    for(let i=0; i<actualTasksOnRemote.length; i++) {
        for(let j=0; j<notDeletedTasks.length; j++) {
            if(actualTasksOnRemote[i].taskId === notDeletedTasks[j].taskId) {
                if(actualTasksOnRemote[i].amountOfEditing > notDeletedTasks[j].amountOfEditing) {
                    notDeletedTasks[j] = actualTasksOnRemote[i];
                }
            }
        }
    }
    repostTasks();
}

async function repostTasks() {
    let response = await fetch(tasksURL+'.json', {
        method: 'PUT',
        headers: {
            'Category-Type': 'application/json'
        },
        body: JSON.stringify(notDeletedTasks)
    });
}