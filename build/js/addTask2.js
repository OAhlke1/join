/**
 * 
 * @param {number} i is the index of the subtask that needs to be added.
 * @function editSubtask shows the elements for editing the respective subtask.
 */
function editSubtask(i) {
    let editElem = document.querySelector(`#edit-subtask-${i}`);
    document.querySelector(`.subtask-title-p-${i}`).classList.add('disNone');
    document.querySelector(`#pen-bin-subtask-${i}`).classList.add('disNone');
    editElem.classList.remove('disNone');
    editElem.querySelector('input').focus();
}

/**
 * 
 * @param {number} i is the index of the subtask.
 * @function changeSubtask changes the title of the respective subtask.
 */
function changeSubtask(i) {
    allSubtasksArray[i].subTaskTitle = document.querySelector(`#edit-subtask-input-${i}`).value;
    renderSubtaskList();
    document.querySelector(`#edit-subtask-${i}`).classList.add('disNone');
}

/**
 * 
 * @param {number} i is the index of the subtask.
 * @function removeSubtask removes the respective subtask.
 */
function removeSubtask(i) {
    allSubtasksArray.splice(i, 1);
    renderSubtaskList();
}

/**
 * 
 * This function clears and resets all input-fields and variables belonging to the editing elements of the add-task-overlay.
 */
function clearForm(event) {
    event.preventDefault();
    document.querySelector('#title-input-add').value = "";
    document.querySelector('#task-descrip-add').value = "";
    document.querySelector('.contacts-inner input').value = "";
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
 *  @function fadeInTaskAdded adds the class 'added' to @var taskAddedElem to fade it in via CSS.
 */
function fadeInTaskAdded() {
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

/**
 * 
 * Here 
 */
document.querySelector('body').addEventListener('click', (event)=>{
    hideAllLists(event);
})

/**
 * 
 * @param {event} event the click-event fired to the body.
 * @returns 
 */
function hideAllLists(event) {
    let target = event.target;
    if(target.classList.contains('contacts-inner') || target.classList.contains('search-contacts') || target.classList.contains('contact') || target.classList.contains('categories-inner') || target.classList.contains('category-name')) {
        return;
    }else {
        document.querySelector('.contact-list').classList.add('disNone');
        document.querySelector('.categories-list').classList.add('disNone');
    }
}