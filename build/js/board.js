let columnCardConts = document.querySelectorAll('.column-card-cont');
let userStories = document.querySelectorAll('.user-story');
let draggedElem = null;
let allStories = [];
const taskURL = 'https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks.json';

function loadCont() {
    shiftParticipants();
    checkForEmptyColumns();
    checkForFilledColumns();
    setStoryAttributes();
    getStories();
    postStories();
}

function shiftParticipants() {
    document.querySelectorAll('main .boardCont .board .board-column .column-card-cont .user-story').forEach((elem, index) => {
        elem.querySelectorAll(' .participants-and-urgency .participants .participant').forEach((el, i)=>{
            el.style.left = `${-7*i}px`;
        })
    })
}

let dragged = null;

const draggableObjs = document.querySelectorAll(".user-story");
for(source of draggableObjs) {
    source.addEventListener("dragstart", (event) => {
        dragged = event.target;
    });
}

const targets = document.querySelectorAll(".column-card-cont");
for(el of targets) {
    el.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    el.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      forEachTarget();
    });
}

function forEachTarget() {targets.forEach((elem)=>{
    if(elem.contains(event.target) || event.target.classList.contains('column-card-cont')) {
        dragged.parentNode.removeChild(dragged);
        event.target.parentNode.append(dragged);
        checkForEmptyColumns();
        checkForFilledColumns();
        setStoryAttributes();
        setStoryArray();
    }
  })
}

function checkForEmptyColumns() {
    if(document.querySelector('#toDo').querySelectorAll('.user-story').length === 0) {
        document.querySelector('.no-task-to-do').classList.remove('disNone');
    }
    if(document.querySelector('#inProgress').querySelectorAll('.user-story').length === 0) {
        document.querySelector('.no-task-in-progress').classList.remove('disNone');
    }
    if(document.querySelector('#awaitFeedback').querySelectorAll('.user-story').length === 0) {
        document.querySelector('.no-feedback-awaited').classList.remove('disNone');
    }
    if(document.querySelector('#done').querySelectorAll('.user-story').length === 0) {
        document.querySelector('.no-task-done').classList.remove('disNone');
    }
}


function checkForFilledColumns() {
    if(document.querySelector('#toDo').querySelectorAll('.user-story').length > 0) {
        document.querySelector('.no-task-to-do').classList.add('disNone');
    }
    if(document.querySelector('#inProgress').querySelectorAll('.user-story').length > 0) {
        document.querySelector('.no-task-in-progress').classList.add('disNone');
    }
    if(document.querySelector('#awaitFeedback').querySelectorAll('.user-story').length > 0) {
        document.querySelector('.no-feedback-awaited').classList.add('disNone');
    }
    if(document.querySelector('#done').querySelectorAll('.user-story').length > 0) {
        document.querySelector('.no-task-done').classList.add('disNone');
    }
}

function setStoryAttributes() {
    targets.forEach((elem)=>{
        elem.querySelectorAll('.user-story').forEach((el)=>{
            el.setAttribute('data-storyType', elem.id);
        })
    })
}

async function getStories() {
    let fetchedStories = await fetch(taskURL);
    fetchedStories = await fetchedStories.json();
    for(const [key, value] of Object.entries(fetchedStories)) {
        allStories.push(value);
    }
}

async function postStories() {
    if(allStories.length > 0) {
        allStories.forEach(async (elem)=>{
            let response = await fetch(taskURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(elem)
            }).then((val)=>{
                return val;
            }).catch((err)=>{
                throw err;
            })
        })
    }
}