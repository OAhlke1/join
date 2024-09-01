/**
 * 
 * @param {event} event is the event fired to one of the three urgency-buttons.
 * At first, the @function chooseUrgencyOverlay removes the marking class "choose-urgency".
 * Then the clicked button is marked as chosen.
 */
function chooseUrgencyOverlay(event) {
    let classes = ['prio-high-button-bg-color', 'prio-medium-button-bg-color', 'prio-low-button-bg-color'];
    for(let i=0; i<3; i++) {
        document.querySelectorAll('.overlay-card .choose-prio-button')[i].classList.remove(classes[i]);
        document.querySelectorAll('.overlay-card .choose-prio-button')[i].classList.remove('chosen-urgency');
    }
    event.target.closest('.choose-prio-button').classList.add(`prio-${event.target.closest('.choose-prio-button').getAttribute('data-resetUrgency')}-button-bg-color`);
    event.target.closest('.choose-prio-button').classList.add('chosen-urgency');
}

/**
 * 
 * The @function showContactListOverlay shows the contact list in the editing overlay.
 */
function showContactListOverlay(event) {
    document.querySelector('.overlay-card .contact-list').classList.remove('disNone');
}

/**
 * 
 * The @function showContactListOverlay hides the contact list in the editing overlay.
 */
function hideContactListOverlay(event) {
    event.stopPropagation();
    document.querySelector('.overlay-card .search-contacts').value = "";
    document.querySelectorAll('.overlay-card .contact').forEach((elem)=>{
        elem.classList.remove('disNone');
    })
    document.querySelector('.overlay-card .contact-list').classList.add('disNone');
}

/**
 * 
 * This function goes into every contact name and checks wether it contains the value of the input.
 */
function searchForContactsOverlay(event) {
    let input = document.querySelector('.overlay-card .search-contacts');
    document.querySelectorAll('.overlay-card .contact-name').forEach((elem)=>{
        let lowercased = elem.innerHTML.toLowerCase()
        if(lowercased.includes(input.value.toLowerCase())) {
            elem.closest('.contact').classList.remove('disNone');
        }else {
            elem.closest('.contact').classList.add('disNone');
        }
    })
}

/**
 * 
 * @param {number} index of the task
 * @returns an HTML-string with the clicked contacts which is then rendered into the chosen-list
 * of the editing-chosen-list.
 */
function renderChosenListBackOverlay(index) {
    let list = "";
    if(!localStorage.UserId) {
        return `<span class='asterisk' style='font-size: 16px; text-align: center;'>Contact-List is not visible for guests.</span>`;
    }
    allTaskObjects[index].participants.forEach((elem, i)=>{
        list += /* HTML */ `<li><div class="flex flex-center circle" onclick="removeParticipantOverlay(${index}, ${i})" style="background-color: ${elem.color}"><p>${elem.sureName ? elem.sureName[0] : ""}${elem.lastName ? elem.lastName[0] : ""}</p><div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem.sureName ? elem.sureName : ""} ${elem.lastName ? elem.lastName : ""}<br>Click icon to remove</p></div></div></li>`;
    })
    return list;
}

/**
 * 
 * @param {event} event is the event fired to the contact of the contact-list in the editing-overlay
 * @param {number} index is the index of the task.
 * When a contact is clicked, it gets the class "chosen" to mark, that this contact is clicked.
 * On the other hand, when it already is marked as clicked it loses the class "chosen" to get unmarked again.
 * Then it checks each contact if it is chosen or not. The ids of these contacts are detected by their HTML-attribute "data-contactindex"
 * so that the contact-object in the @var allContactsObjects array at this index is pushed to the array @var newParticpantsOverlay which
 * is then loaded to the participants-array of the task.
 */
function selectContactOverlay(event, index) {
    newParticipantsOverlay = [];
    if(event.target.closest('.contact').classList.contains('chosen')) {
        event.target.closest('.contact').classList.remove('chosen');
    }else {
        event.target.closest('.contact').closest('.contact').classList.add('chosen');
    }
    document.querySelectorAll('.overlay-card .contact.chosen').forEach((elem)=>{
        newParticipantsOverlay.push(allContactsObjects[+elem.getAttribute('data-contactindex')]);
    });
    //allTaskObjects[index].participants = newParticipantsOverlay;
    reRenderChosenListBackOverlay(index);
}

/**
 * 
 * @param {number} index is the index of the task.
 * The @function reRenderChosenListBackOverlay rerenderes the chosen-list of the editing-overlay.
 */
function reRenderChosenListBackOverlay(index) {
    let list = "";
    if(!localStorage.UserId) {
        return `<span class='asterisk' style='font-size: 16px; text-align: center;'>Contact-List is not visible for guests.</span>`;
    }
    newParticipantsOverlay.forEach((elem, i)=>{
        list += /* HTML */ `<li><div class="flex flex-center circle" onclick="removeParticipantOverlay(${index}, ${i})" style="background-color: ${elem.color}"><p>${elem.sureName ? elem.sureName[0] : ""}${elem.lastName ? elem.lastName[0] : ""}</p><div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem.sureName ? elem.sureName : ""} ${elem.lastName ? elem.lastName : ""}<br>Click icon to remove</p></div></div></li>`;
    })
    document.querySelector('.overlay-card .chosen-list.back').innerHTML = list;
}

/**
 * 
 * @param {number} index is the index of the task.
 * @param {number} j is the index of the participant.
 * When the chosen participant is clicked, the @function removeParticipantOverlay is called.
 * It loads the participants-array of the task into the @var newParticipantsOverlay
 * Then the entry at place @param j is spliced and the @var newParticipantsOverlay array is
 * then loaded to the participants of the task.
 */
function removeParticipantOverlay(index, j) {
    newParticipantsOverlay = structuredClone(allTaskObjects[index].participants);
    newParticipantsOverlay.splice(j, 1);
    //allTaskObjects[index].participants = newParticipantsOverlay;
    actualizeContactListOverlay(index);
    reRenderChosenListBackOverlay(index);
}

/**
 * 
 * @param {index} index is the index of the task.
 * @function actualizeContactListOverlay checks again, which contacts are now chosen.
 */
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

/**
 * 
 * Shows the cross (for removing) and tic (for adding) elements for adding a new subtask to the task in the task-overlay.
 */
function showCrossTicOverlay() {
    document.querySelector('.overlay-card .subtask-input .add').classList.add('disNone');
    document.querySelector('.overlay-card .cross-tic').classList.remove('disNone');
    document.querySelector('.overlay-card .subtask-input').style.border = "1px solid blue";
}

/**
 * 
 * Hides the cross (for removing) and tic (for adding) elements for adding a subtask to the task in the task-overlay.
 */
function hideCrossTicOverlay() {
    document.querySelector('#choose-subtasks-overlay').value = "";
    document.querySelector('.overlay-card .subtask-input .add').classList.remove('disNone');
    document.querySelector('.overlay-card .cross-tic').classList.add('disNone');
    document.querySelector('.overlay-card .subtask-input').style.border = "1px solid black";
}

/**
 * 
 * @function clearSubtaskInputAdd deletes the value of the subtask-input in the editing-overlay.
 */
function clearSubtaskInputOverlay() {
    document.querySelector('#choose-subtasks-overlay').value = "";
    hideCrossTicOverlay();
}

/**
 * 
 * @param {number} index is the index of the task in @param {array} allTaskObjects
 * This function adds a new Subtask to the task
 */
function addSubtaskOverlay(index) {
    let subtaskList = structuredClone(allTaskObjects[index].subTasks);
    if(document.querySelector('#choose-subtasks-overlay').value != "") {
        if(!checkIfSubtaskExistsOverlay(document.querySelector('#choose-subtasks-overlay').value, index, -1)){
            document.querySelector('#choose-subtasks-overlay').focus();
            subtaskList = structuredClone(allTaskObjects[index].subTasks);
            subtaskList.push({
                subTaskDone: 0,
                subTaskTitle: document.querySelector('#choose-subtasks-overlay').value
            });
            reRenderSubtaskListOverlay(index, subtaskList);
            hideCrossTicOverlay();
        }
        document.querySelector('#choose-subtasks-overlay').value = "";

    }
}

/**
 * 
 * @param {number} index is the index of the task.
 * @function reRenderSubtaskListOverlay rerenders the the subtask-list in the editing-overlay.
 */
function reRenderSubtaskListOverlay(index, subtaskList) {
    let list = "";
    subtaskList.forEach((elem, i)=>{
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
    newSubtaskList = structuredClone(subtaskList);
}

/**
 * 
 * @param {number} index is the index of the task
 * @param {number} j is the index of the subtask
 * Both parameters are needed to get the correct input-id.
 * @function closeEditSubtask closes the subtask editing.
 */
function closeEditSubtask(index, j) {
    document.querySelector(`#edit-subtask-overlay-${index}${j}`).classList.add('disNone');
}

/**
 * 
 * @param {*} j is the subtasks index
 * This function shows the input-field of that particular subtask and hides its <p>-tag that contains its title
 */
function editSubtaskOverlay(index, j) {
    document.querySelector(`#edit-subtask-overlay-${index}${j}`).classList.remove('disNone');
    document.querySelector(`#edit-subtask-input-overlay-${index}${j}`).focus();
}

/**
 * 
 * @param {number} index is the index of the task in @param {array} allTaskObjects
 * @param {number} j is the index of the subtask
 * This function sets the new title of the subtask to the @var allTaskObjects and @var newSubtasksArrayOverlay
 */
function changeSubtaskOverlay(index, j) {
    let subtaskList = structuredClone(allTaskObjects[index].subTasks);
    subtaskList[j].subTaskTitle = document.querySelector(`#edit-subtask-input-overlay-${index}${j}`).value;
    if(!checkIfSubtaskExistsOverlay(document.querySelector(`#edit-subtask-input-overlay-${index}${j}`).value, index, j)) {
        reRenderSubtaskListOverlay(index, subtaskList);
    }else {
        alert('Subtask already exists');
    }
}

/**
 * 
 * @returns {boolean}
 * @function checkIfSubtaskExists controlls if the value of the subtask inputfield is the same as the title of an
 * already existing task. If so, @bool true is returned. Else @bool false is given back.
 */
function checkIfSubtaskExistsOverlay(subtaskInput, index, i) {
    if(document.querySelectorAll('.subtask-title-p-overlay').length > 0) {
        for(let k=0; k<document.querySelectorAll('.subtask-title-p-overlay').length; k++) {
            if(k === i) {
                if(document.querySelectorAll('.subtask-title-p-overlay').length === 1) { return false; }
                continue;
            }else {
                if(document.querySelectorAll('.subtask-title-p-overlay')[k].innerHTML === subtaskInput) {
                    alert('Subtask already exists');
                    document.querySelector(`#edit-subtask-input-overlay-${index}${i}`).focus();
                    return true;
                }else if(document.querySelectorAll('.subtask-title-p-overlay')[k].innerHTML != subtaskInput) {
                    if(k+1 === document.querySelectorAll('.subtask-title-p-overlay').length) { return false; }
                }
            }
        }
    }else {
        return false;
    }
}

/**
 * 
 * @param {number} index is the task of the index.
 * @param {number} j is the index of the subtask.
 * @function removeSubtaskOverlay loads the subtaks into the @var subtaskList array.
 * Then the subtask at index j gets spliced out of that array and then the array is loaded to
 * participants of the task.
 */
function removeSubtaskOverlay(index, j) {
    let subtaskList = structuredClone(allTaskObjects[index].subTasks);
    subtaskList.splice(j, 1);
    reRenderSubtaskListOverlay(index, subtaskList);
}

/**
 * 
 * @param {number} index is the index of the task.
 * The input- and button-values of the editing-overlay are stored into @var newTaskObject
 * The task is then replaced by that object.
 */
function actualizeTask(index) {
    if(!localStorage.UserId) {
        alert('Guests are not allowed to edit tasks');
        return;
    }
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
}

/**
 * 
 * @param {number} index is the index of the deleted task.
 * Actually the function does not splice the @var allTaskObjects at the given index, but instead
 * it just sets the tasks deleted-state to 1 (for true) and then the task with given index as data-taskindex gets
 * the class "completely-hidden" for being always hidden (so that it does not show up when the tasks are being searched).
 */
function deleteTask(index) {
    allTaskObjects[index].deleted = 1;
    if(!document.querySelector(`.task[data-taskindex="${index}"]`).classList.contains('completely-hidden')) {
        document.querySelector(`.task[data-taskindex="${index}"]`).classList.add('completely-hidden');
    }
    closeOverlay(index);
    showHideGreyTaskCards();
    collectNotDeletedTasks();
}

/**
 * 
 * @function setFocusOutFunctionSubtaskInputOverlay sets the functions for the @event focusout of the input-fields of the edit-task-overlay.
 */
function setFocusOutFunctionSubtaskInputOverlay() {
    document.querySelector('#choose-subtasks-overlay').addEventListener('focusout', ()=>{
        if(document.querySelector('#choose-subtasks-overlay').value === "") {
            hideCrossTicOverlay();
        }else {
            document.querySelector('.overlay-card .subtask-input').style.border = '1px solid #d1d1d1';
        }
    })
}