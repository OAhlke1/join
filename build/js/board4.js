/**
 * 
 * @param {number} index is the index of the task.
 * The input- and button-values of the editing-overlay are stored into @var newTaskObject
 * The task is then replaced by that object.
 */
/* function actualizeTask(index) {
    allTaskObjects[index].participants = structuredClone(newParticipantsOverlay);
    let newTaskObject = {
        taskId: allTaskObjects[index].taskId,
        category: allTaskObjects[index].category,
        date: document.querySelector('#date-input-overlay').value,
        deleted: 0,
        subTasks: newSubtaskList.length === 0 ? allTaskObjects[index].subTasks : newSubtaskList,
        participants: allTaskObjects[index].participants,
        taskDescrip: document.querySelector('#task-descrip-overlay').value,
        taskTitle: document.querySelector('#title-input-overlay').value,
        taskType: allTaskObjects[index].taskType,
        urgency: document.querySelector('.overlay-card .chosen-urgency').getAttribute('data-resetUrgency'),
        amountOfEditing: allTaskObjects[index].amountOfEditing ? allTaskObjects[index].amountOfEditing+1 : 0
    };
    allTaskObjects[index] = structuredClone(newTaskObject);
    collectNotDeletedTasks();
    reRenderTasks();
    closeOverlay(index);
} */

/**
 * 
 * @param {number} index is the index of the deleted task.
 * Actually the function does not splice the @var allTaskObjects at the given index, but instead
 * it just sets the tasks deleted-state to 1 (for true) and then the task with given index as data-taskindex gets
 * the class "completely-hidden" for being always hidden (so that it does not show up when the tasks are being searched).
 */
/* function deleteTask(index) {
    allTaskObjects[index].deleted = 1;
    if(!document.querySelector(`.task[data-taskindex="${index}"]`).classList.contains('completely-hidden')) {
        document.querySelector(`.task[data-taskindex="${index}"]`).classList.add('completely-hidden');
    }
    closeOverlay(index);
    showHideGreyTaskCards();
    collectNotDeletedTasks();
} */

/**
 * 
 * This function opens the add-task-overlay.
 */
/* function openAddTaskOverlay() {
    newSubtasksArrayAdd = [];
    setFocusOutFunctionsInputAdd();
    document.querySelector('.add-task-overlay').classList.remove('disNone');
} */

/**
 * 
 * This function closes the add-task-overlay.
 */
/* function closeOverlayAdd() {
    document.querySelector('.add-task-overlay').classList.add('disNone');
    clearOverlayAdd();
} */

/**
 * 
 * This function takes the value of the search-input-field and checks each contact in the add-task-overlays contact-list if it includes the input-value.
 * If not, the contact gets hidden by adding the class disNone (for display-none) to it.
 */
/* function searchForContactsAdd(event) {
    let input = document.querySelector('.add-task-overlay-box .search-contacts');
    document.querySelector('.add-task-overlay-box .contact-list').classList.remove('disNone');
    document.querySelectorAll('.add-task-overlay-box .contact-name').forEach((elem)=>{
        if(elem.innerHTML.toLowerCase().includes(input.value.toLowerCase())) {
            elem.closest('.contact').classList.remove('disNone');
        }else {
            elem.closest('.contact').classList.add('disNone');
        }
    })
} */

/**
 * 
 * @param {event} event is a click-event.
 * This function adds the class chosen to the contact in the add-task-overlay that is being clicked.
 * The stopProgation-function is called, to only click on the contact, not the entire overlay.
 */
/* function selectContactAdd(event) {
    event.stopPropagation();
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').classList.add('chosen');
    }
    getParticipantsAdd();
} */

/**
 * 
 * This function puts the added participants of a newly created task in an array @param {array} participantsArrayAdd
 */
/* function getParticipantsAdd() {
    participantsArrayAdd = [];
    document.querySelectorAll('.add-task-overlay-box .contact.chosen').forEach((elem)=>{
        participantsArrayAdd.push(allContactsObjects[+elem.getAttribute('data-selectindex')]);
    })
    renderChosenListAdd();
} */

/**
 * 
 * This function renders the list of chosen participants into the add-task-overlay
 */
/* function renderChosenListAdd() {
    document.querySelector('.add-task-overlay-box .chosen-list').innerHTML = '';
    participantsArrayAdd.forEach((elem, i)=>{
        document.querySelector('.chosen-list').innerHTML += `<li><div class="flex flex-center circle" onclick="removeParticipantAdd(${i})" onmouseover="showNameAdd(${i})" onmouseleave="hideNameAdd(${i})" style="background-color: ${elem.color}"><p>${elem.sureName ? elem.sureName[0] : ""}${elem.lastName ? elem.lastName[0] : ""}</p><div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem.sureName ? elem.sureName : ""} ${elem.lastName ? elem.lastName : ""}<br>Click icon to remove</p></div></div></li>`;
    })
    document.querySelector('.add-task-overlay-box .chosen-list').classList.remove('disNone');
} */

/**
 * 
 * @param {number} i is the index of the Participant
 * This function shows the name-block of the participant in the add-task-overlay
 */
/* function showNameAdd(i) {
    document.querySelector(`.name-block${i}`).classList.remove('disNone');
} */

/**
 * 
 * @param {number} i is the index of the Participant
 * This function hides the name-block of the participant in the add-task-overlay
 */
/* function hideNameAdd(i) {
    document.querySelector(`.name-block${i}`).classList.add('disNone');
} */

/**
 * 
 * @param {number} i is the index of the chosen participant in the add-task-overlay
 * This function removes the chosen participant from the add-task-overlay.
 */
/* function removeParticipantAdd(i) {
    participantsArrayAdd.splice(i, 1);
    document.querySelectorAll('.add-task-overlay-box .contact.chosen')[i].classList.remove('chosen');
    renderChosenListAdd();
} */

/**
 * When the input-field for searching contacts of the add-task-overlay is focused, the overlays contact-list is shown.
 * When the input-field loses focus, the contact-list is hidden.
 */
/* function showHideContactListAdd(event) {
    if(document.querySelector('.add-task-overlay-box .contact-list').classList.contains('disNone')) {
        document.querySelector('.add-task-overlay-box .contact-list').classList.remove('disNone');
        document.querySelector('.add-task-overlay-box .contacts .contacts-inner .triangle').classList.add('rotated');
    }else {
        document.querySelector('.add-task-overlay-box .contact-list').classList.add('disNone');
        document.querySelector('.add-task-overlay-box .contacts .contacts-inner .triangle').classList.remove('rotated');
    }
} */

/**
 * This function renderes the contact-list for the add-task-overlay.
 */
/* function renderContactListAdd() {
    let list = "";
    if(!localStorage.UserId) {
        document.querySelector('.add-task-overlay-box .contact-list').innerHTML = "<span class='asterisk' style='font-size: 16px; text-align: center;'>Contact-list is not visible for guests.</span>";
        return;
    }
    allContactsObjects.forEach((elem, index)=>{
        list += `<div class="flex flex-center contact" onmousedown="selectContactAdd(event, ${index})" data-selectindex="${index}">
            <div class="flex flex-center contact-left"><div class="flex flex-center circle" style="background-color: ${elem.color}"><p>${elem.sureName ? elem.sureName[0] : ""}${elem.lastName ? elem.lastName[0] : ""}</p></div><p class="contact-name">${elem.sureName ? elem.sureName : ""} ${elem.lastName ? elem.lastName : ""} ${localStorage.UserId == elem.contactId ? ' (You)' : ''}</p></div>
            <svg class="not-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/></svg>
            <svg class="is-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="white"/>
                <path d="M5 9L9 13L17 1.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/>
            </svg>
        </div>`;
    })
    document.querySelector('.add-task-overlay-box .contact-list').innerHTML = list;
} */

/**
 * 
 * @param {event} event is the click-event fired to the top-bar of the catagory-list of the add-task-overlay to prevent default.
 * This function shows or hides the list of possible categories.
 */
/* function showHideCategoriesList(event) {
    if(document.querySelector('.categories-list').classList.contains('disNone')) {
        document.querySelector('.categories-list').classList.remove('disNone');
        document.querySelector('.categories .categories-inner .triangle').classList.add('rotated');
    }else {
        document.querySelector('.categories-list').classList.add('disNone');
        document.querySelector('.categories .categories-inner .triangle').classList.remove('rotated');
    }
} */

/* function setCategory(event) {
    event.preventDefault();
    document.querySelector('.category-name').value = event.target.closest('.category').getAttribute('data-tasktype');
    categoryType = event.target.closest('.category').getAttribute('data-tasktype');
} */

/**
 * 
 * @param {event} event is the click-event fired to the clicked element of the catagory-list.
 * This function chooses the category of the new task.
 */
/* function choosePrioAdd(event, prio) {
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
} */

/**
 * 
 * This function renders the subtask-list of the add-task-overlay.
 */
/* function renderSubtaskListAdd() {
    document.querySelector('.add-task-overlay-box .subtask-list').innerHTML = '';
    newSubtasksArrayAdd.forEach((elem, i)=>{
        document.querySelector('.add-task-overlay-box .subtask-list').innerHTML += `<li id="subtask-li-${i}" class="flex flex-center" style="column-gap: 12px;" onmouseover="fadeInPenBin(${i})" onmouseleave="fadeOutPenBin(${i})">
            <p class="subtask-title-p-add subtask-title-p-add-${i}">${elem.subTaskTitle}</p>
            <div class="pen-bin-subtask-add pen-bin-subtask flex flex-center" id="pen-bin-subtask-add-${i}">
                <img src="./assets/img/pen.svg" alt="" onclick="showEditingElementsSubtaskAdd(${i})">
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
} */

/**
 * 
 * Shows the cross (for removing) and tic (for adding) elements for adding a subtask to the task in the add-task-overlay.
 */
/* function showCrossTicAdd() {
    document.querySelector('.add-task-overlay-box .subtask-input .add').classList.add('disNone');
    document.querySelector('.add-task-overlay-box .cross-tic').classList.remove('disNone');
    document.querySelector('.add-task-overlay-box .subtask-input').style.border = "1px solid blue";
} */

/**
 * 
 * Shows the cross (for removing) and tic (for adding) elements for adding a subtask to the task in the task-overlay.
 */
/* function hideCrossTicAdd() {
    document.querySelector('.add-task-overlay-box .subtask-input').style.border = "1px solid #d1d1d1";
    document.querySelector('.add-task-overlay-box .subtask-input .add').classList.remove('disNone');
    document.querySelector('.add-task-overlay-box .cross-tic').classList.add('disNone');
} */

/**
 * 
 * This function pushes the defined subtasks into a globally defined array @var newSubtasksArrayAdd
 */
/* function addSubtaskAdd() {
    let subtaskInput = document.querySelector('#choose-subtasks-add').value;
    if(subtaskInput === "") {
        hideCrossTicAdd();
    }else {
        if(!checkIfSubtaskExistsAdd(subtaskInput, -1)) {
            newSubtasksArrayAdd.push({subTaskDone: 0, subTaskTitle: subtaskInput})
            renderSubtaskListAdd();
            hideCrossTicAdd();
            clearSubtaskInputAdd();
        }else {
            hideCrossTicAdd();
            clearSubtaskInputAdd();
        }
    }
} */

/**
 * 
 * @returns a boolean value
 * This function checks whether a subtask already exists in the new task.
 */
/* function checkIfSubtaskExistsAdd(subtaskInput, i) {
    if(document.querySelectorAll('.subtask-title-p-add').length > 0) {
        for(let k=0; k<document.querySelectorAll('.subtask-title-p-add').length; k++) {
            if(k === i) {
                continue;
            }else {
                if(document.querySelectorAll('.subtask-title-p-add')[k].innerHTML === subtaskInput) {
                    alert('Subtask already exists');
                    document.querySelector(`#edit-subtask-input-add-${i}`).focus();
                    return true;
                }else if(document.querySelectorAll('.subtask-title-p-add')[k].innerHTML != subtaskInput) {
                    if(k+1 === document.querySelectorAll('.subtask-title-p-add').length) { return false; }
                }
            }
        }
    }else {
        return false;
    }
} */

/**
 * 
 * @param {number} i is the index of the newly created subtask
 * This function shows the input-field of that particular subtask and hides its <p>-tag that contains its title
 */
/* function showEditingElementsSubtaskAdd(i) {
    let editElem = document.querySelector(`#edit-subtask-add-${i}`);
    document.querySelector(`.subtask-title-p-add-${i}`).classList.add('disNone');
    document.querySelector(`#pen-bin-subtask-add-${i}`).classList.add('disNone');
    editElem.classList.remove('disNone');
    document.querySelector(`#edit-subtask-input-add-${i}`).focus();
} */

/**
 * 
 * @param {number} i is the index of the newly defined subtask
 * This function changes the title of the newly defined subtask.
 */
/* function changeSubtaskAdd(i) {
    if(!checkIfSubtaskExistsAdd(document.querySelector(`#edit-subtask-input-add-${i}`).value, i)) {
        newSubtasksArrayAdd[i].subTaskTitle = document.querySelector(`#edit-subtask-input-add-${i}`).value;
        renderSubtaskListAdd();
        document.querySelector(`#edit-subtask-add-${i}`).classList.add('disNone');
    }else {
        document.querySelector(`#edit-subtask-input-add-${i}`).value = "";
        document.querySelector(`#edit-subtask-input-add-${i}`).focus();
    }
} */

/**
 * 
 * This function deletes the input of the subtask input-field of the add-task-overlay
 */
/* function clearSubtaskInputAdd() {
    document.querySelector('.add-task-overlay-box .subtask-input input').value = "";
    hideCrossTicAdd();
} */

/**
 * 
 * @param {number} i is the index of the newly defined subtask.
 * This function removes the new subtask.
 */
/* function removeSubtaskAdd(i) {
    newSubtasksArrayAdd.splice(i, 1);
    renderSubtaskListAdd();
} */

/**
 * 
 * @function clearOverlayAdd clears every input field adding task overlay and resets its urgency-button for "medium" as marked.
 */
/* function clearOverlayAdd() {
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
    newSubtaskList = [];
} */

/**
 * 
 * This function resets the urgency of the new task.
 */
/* function resetUrgencyAdd() {
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[0].classList.remove('prio-high-button-bg-color');
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[1].classList.remove('prio-medium-button-bg-color');
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[2].classList.remove('prio-low-button-bg-color');
    document.querySelectorAll('.add-task-overlay-box .choose-prio-button')[1].classList.add('prio-medium-button-bg-color');
    newUrgency = "medium";
} */