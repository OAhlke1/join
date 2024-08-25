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

/**
 * 
 * @param {event} event of the event target.
 * Once the task is moved over another column, the previous column (the event target)
 * The grey background of that column is being removed once the dragged task is dragged away from it.
 */
function unhighlightColumn(event) {
    let unHighlighted = document.querySelector('.highlighted');
    unHighlighted.classList.remove('highlighted');
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
function shiftParticipantCirclesInTask() {
    document.querySelectorAll('main .boardCont .board .board-column .column-card-cont .task').forEach((elem) => {
        elem.querySelectorAll(' .participants-and-urgency .participants .participant').forEach((el, i)=>{
            el.style.left = `${-7*i}px`;
        })
    })
}

/**
 * 
 * @param {number} index is the tasks index in the @param allTaskObjects array.
 * This function renders the subtask-overlay and fills it with the data of the task in @param allTaskObjects at index @param index
 */
function renderTaskIntoOverlay(index) {
    document.querySelector('.overlay-card').setAttribute('data-taskindex', index); //if no task-index is given to a function, the data-taskindex can be checked for the tasks index.
    document.querySelector('.tasks-overlay .overlay-card .inner').innerHTML = /* HTML */ `
        <div class="top-bar flex">
            <div class="task-category flex-center" style="background-color: ${allTaskObjects[index].category === 'User Story' ? '#00338f' : '#1fd7c1'};">
                <p>${allTaskObjects[index].category}</p>
            </div>
            <div class="close-overlay" onclick="closeOverlay(${index})"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.99999 8.40005L2.09999 13.3C1.91665 13.4834 1.68332 13.575 1.39999 13.575C1.11665 13.575 0.883321 13.4834 0.699988 13.3C0.516654 13.1167 0.424988 12.8834 0.424988 12.6C0.424988 12.3167 0.516654 12.0834 0.699988 11.9L5.59999 7.00005L0.699988 2.10005C0.516654 1.91672 0.424988 1.68338 0.424988 1.40005C0.424988 1.11672 0.516654 0.883382 0.699988 0.700049C0.883321 0.516715 1.11665 0.425049 1.39999 0.425049C1.68332 0.425049 1.91665 0.516715 2.09999 0.700049L6.99999 5.60005L11.9 0.700049C12.0833 0.516715 12.3167 0.425049 12.6 0.425049C12.8833 0.425049 13.1167 0.516715 13.3 0.700049C13.4833 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4833 1.91672 13.3 2.10005L8.39999 7.00005L13.3 11.9C13.4833 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4833 13.1167 13.3 13.3C13.1167 13.4834 12.8833 13.575 12.6 13.575C12.3167 13.575 12.0833 13.4834 11.9 13.3L6.99999 8.40005Z" fill="#2A3647"/></svg></div></div>
            ${renderDropDownShiftTask(index)}
        <div class="flex flex-center" style="justify-content: flex-start; flex-direction: column; row-gap: 24px; width: 100%; overflow-y: scroll;">
            ${renderTaskTitleIntoOverlay(index)}
            ${renderTopTextsIntoOverlay(index)}
            ${renderParticipantsBlockIntoOverlay(index)}
            <div class="subtasks-block flex flex-column">
                ${getSubtasksOverlay(index)}
            </div>
        </div>`;
        document.querySelector('.overlay-card').innerHTML += `<div class="flex flex-center edit-delete">${renderEditDelete(index)}</div>`;
    document.querySelector('.tasks-overlay').classList.remove('disNone');
    setFocusOutFunctionSubtaskInputOverlay();
}

/**
 * 
 * @param {number} index is the tasks index in the @param allTaskObjects array.
 * @returns an HTML-string that includes the title and an input-field for editing the title which is hidden until the task has to be edited.
 */
function renderTaskTitleIntoOverlay(index) {
    return /* HTML */ `<div class="flex flex-column" style="width: calc(100% - 10px);">
        <h2 class="hide-for-editing">${allTaskObjects[index].taskTitle}</h2>
        <div class="flex flex-column show-for-editing disNone" style="justify-content: space-between; width: 100%;">
        <div class="flex flex-center cg12"><p class="add">Title</p></div>
            <input type="text" id="title-input-overlay" value="${allTaskObjects[index].taskTitle}">
        </div>
    </div>`;
}

/**
 * 
 * @param {number} index is the tasks index in the @param allTaskObjects array.
 * @returns an HTML-String containing the task-description, date and priority along their hidden input-fields and buttons for editing.
 */
function renderTopTextsIntoOverlay(index) {
    return /* HTML */ `<div class="top-texts flex-column">
        ${renderTaskDescriptionIntoOverlay(index)}
        <div class="due-date flex hide-for-editing"><p>Due date:</p><p>${document.querySelector('#date-input-overlay') ? restyleDateString(allTaskObjects[index].date) : restyleDateString(allTaskObjects[index].date)}</p></div>
        <div class="due-date flex flex-column show-for-editing disNone" style="row-gap: 16px;">
            <p>Due date</p>
            <input type="date" id="date-input-overlay" required="" min="${actualDate}" value="${allTaskObjects[index].date}">
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

/**
 * 
 * @param {number} index is the tasks index in the @param allTaskObjects array.
 * @returns an HTML-string that includes the task description and an textarea-field for editing the task description which is hidden until the task has to be edited.
 */
function renderTaskDescriptionIntoOverlay(index) {
    return /* HTML */ `<div class="flex flex-column" style="width: 100%;">
        <h3 class="hide-for-editing">${allTaskObjects[index].taskDescrip}</h3>
        <div class="flex flex-column show-for-editing disNone" style="justify-content: space-between; width: 100%;">
            <div class="flex flex-center cg12"><p class="add">Description</p></div>
            <input type="text" id="task-descrip-overlay" value="${allTaskObjects[index].taskDescrip}">
        </div>
    </div>`;
}

/**
 * 
 * @param {string} urgency of the task-object at with the index @param index 
 * @returns the respective urgency-svg depending wether the urgency is "low", "medium" or "high"
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
 * @param {number} index is the tasks index in the @param allTaskObjects array.
 * @returns an HTML-string containing the three urgency-buttons with 'low', 'medium' and 'high'.
 * These buttons also have an attribute data-resetUrgency with the urgency-level as string for retrieving the urgency-level of the clicked button.
 */
function renderUrgencyButtons(index) {
    return /* HTML */ `<div class="reset-urgency flex show-for-editing disNone">
        <div class="choose-prio-container">
            <div class="choose-prio-button flex flex-center prio-high-button ${allTaskObjects[index].urgency === "high" ? "prio-high-button-bg-color chosen-urgency" : ""}" onclick="chooseUrgencyOverlay(event)" data-resetUrgency="high">
                <span id="prio-high-overlay" class="flex flex-center">Urgent</span>
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"></path>
                    <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"></path>
                </svg>  
            </div>
            <div class="choose-prio-button flex flex-center prio-medium-button ${allTaskObjects[index].urgency === "medium" ? "prio-medium-button-bg-color chosen-urgency" : ""}" onclick="chooseUrgencyOverlay(event)" data-resetUrgency="medium">
                <span id="prio-medium-overlay" class="flex flex-center">Medium</span>
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
                <span id="prio-low-overlay" class="flex flex-center">Low</span>
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"></path>
                    <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"></path>
                </svg> 
            </div>
        </div>
    </div>`;
}

/**
 * 
 * @param {number} index is the tasks index in the @param allTaskObjects array.
 * If the index >= 0, the locally defined array @param yearMonthDay is given an array with the values of year month and day.
 * @returns either an HTML-string with the <p>-tag containing the day (yearMonthDay[2]), month (yearMonthDay[1]) and year (yearMonthDay[0]) seperated by slashes or
 * a <p>-tag containig a 0, when no Date is given to the task.
 * When the index is -1, no index is given to the function and the value of the date-input-field of the add-task-overlay is being returned.
 */
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

/**
 * 
 * @param {number} index is the tasks index in the @param allTaskObjects array.
 * @returns an HTML-string containing the participants of the task and the first hidden elements for adding/deleting new participants when the task is being
 * edited.
 */
function renderParticipantsBlockIntoOverlay(index) {
    return /* HTML */ `
    <div class="flex flex-column hide-for-editing">
        <p style="font-size: 20px;">Assigned to</p>
        <ul class="chosen-list front flex-column">${renderChosenListFrontOverlay(index)}</ul>
    </div>
    <div class="assigned-container flex flex-column show-for-editing disNone">
        <p style="font-size: 20px;">Assigned to</p>
        <div name="Select contacts to assign" class="select-container contacts" style="position: relative;">
            <div class="flex flex-center contacts-inner">
            <input class="search-contacts" placeholder="Select contacts to assign" onkeyup="searchForContactsOverlay(event)" onfocus="showContactListOverlay(event)" onfocusout="hideContactListOverlay(event)">
                <svg class="triangle" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.29998 4.3L0.699975 1.7C0.383309 1.38333 0.312475 1.02083 0.487475 0.6125C0.662475 0.204167 0.974975 0 1.42498 0H6.57498C7.02498 0 7.33747 0.204167 7.51248 0.6125C7.68748 1.02083 7.61664 1.38333 7.29997 1.7L4.69998 4.3C4.59998 4.4 4.49164 4.475 4.37498 4.525C4.25831 4.575 4.13331 4.6 3.99998 4.6C3.86664 4.6 3.74164 4.575 3.62498 4.525C3.50831 4.475 3.39998 4.4 3.29998 4.3Z" fill="#2A3647"/>
                </svg>
            </div>
            <div class="contact-list flex disNone">${localStorage.UserId ? renderContactListOverlay(index) : "<span class='asterisk' style='font-size: 16px; text-align: center;'>Contact-List is not visible for guests.</span>"}</div>
        </div>
        <ul class="chosen-list back flex flex-center">${renderChosenListBackOverlay(index)}</ul>
    </div>`;
}

/**
 * 
 * This function renders the list of newly chosen participants into the front of the task-overlay.
 */
function renderChosenListFrontOverlay(index) {
    let list = "";
    if(allTaskObjects[index].participants) {
        let elem = allTaskObjects[index].participants;
        for(let i=0; i<allTaskObjects[index].participants.length; i++) {
            list += /* HTML */ `<li class="flex flex-center"><div class="flex flex-center circle" style="background-color: ${elem[i].color}"><p>${elem[i].sureName ? elem[i].sureName[0] : ""}${elem[i].lastName ? elem[i].lastName[0] : ""}</p><div class="name-block${i} name-block disNone"><p style="text-align: center;">${elem[i].sureName ? elem[i].sureName : ""} ${elem[i].lastName ? elem[i].lastName : ""}<br>Click icon to remove</p></div></div><p>${elem[i].sureName ? elem[i].sureName : ""} ${elem[i].lastName ? elem[i].lastName : ""}</p></li>`;
        }
    }
    return list;
}

/**
 * 
 * @param {number} index is the index of the task in @param {array} allTaskObjects
 * @returns an HTML-string with all the Subtasks and their at the beginning invisible edeting-elements to the task-overlay.
 */
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
                    <input type="text" id="choose-subtasks-overlay" placeholder="Add new subtask" onfocus="showCrossTicOverlay()">
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

/**
 * 
 * @param {number} index is the index of the task in @param {array} allTaskObjects
 * This function renders the subtask-list of the task-overlay.
 */
function renderSubtaskListOverlay(index) {
    let list = "";
    newSubtaskList = structuredClone(allTaskObjects[index].subTasks);
    allTaskObjects[index].subTasks.forEach((elem, i)=>{
        list += /* HTML */ `<li id="subtask-li-${i}" class="flex flex-center" style="column-gap: 12px;" onmouseover="fadeInPenBin(${i})" onmouseleave="fadeOutPenBin(${i})">
            <p class="subtask-title-p-overlay subtask-title-p-overlay-${i}">${elem.subTaskTitle}</p>
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

/**
 * 
 * @param {index} index is the index of the task. 
 * @returns an HTML-string of each contact so that you get the clickable contact-object of
 * the contact-list in each the editing- and adding-overlay.
 */
function renderContactListOverlay(index) {
    //document.querySelector('.overlay-card .contact-list').innerHTML = '';
    let list = "";
    allContactsObjects.forEach((elem, i)=>{
        list += `<div class="flex flex-center contact ${preselectParticipantsinContactListOverlay(index, elem.contactId) ? 'chosen' : ''}" data-contactindex="${i}" onmousedown="selectContactOverlay(event, ${index})">
            <div class="flex flex-center contact-left"><div class="flex flex-center circle" style="background-color: ${elem.color}"><p>${elem.sureName ? elem.sureName[0] : ""}${elem.lastName ? elem.lastName[0] : ""}</p></div><p class="contact-name">${elem.sureName ? elem.sureName : ""} ${elem.lastName ? elem.lastName : ""} ${localStorage.UserId == elem.contactId ? '(You)' : ''}</p></div>
            <svg class="not-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/></svg>
            <svg class="is-chosen" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="white"/>
                <path d="M5 9L9 13L17 1.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="white"/>
            </svg>
        </div>`;
    })
    return list;
}

/**
 * 
 * @param {number} index is the index of the task
 * @param {string} id is the id of the respective contact
 * @returns @var {boolean}
 * When the contact-id of a participant in task of index @var index is the same as
 * the @param id, the participant is chosen for that task and the function returns true - else false.
 */
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

/**
 * 
 * @param {number} index is the index of the task in @param {array} allTaskObjects
 * This function renders editing and delete button at the bottom right of the task-overlay.
 * The @param index is given so that the @function deleteTask knows which task to be removed.
 * 
 */
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