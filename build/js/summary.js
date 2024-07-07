let todo = document.getElementById('todo');
let done = document.getElementById('done');
let urgent = document.getElementById('urgent');
let tileDate = document.getElementById('tileDate');
let taskBoard = document.getElementById('taskBoard');
let taskProgress = document.getElementById('taskProgress');
let feedback = document.getElementById('feedback');
let greetTime = document.getElementById('greetTime');
let greetName = document.getElementById('greetName');

function init() {
    getGreetingTime();
    getGreetingName();
    getValues();
}

function getGreetingTime() {
    let actualHours = new Date(Date.now()).getHours();
    if (actualHours >= 6 && actualHours <= 10) {
        greetTime.innerHTML = "Good morning,";
    } else if (actualHours >= 11 && actualHours <= 13) {
        greetTime.innerHTML = "Good day,";
    } else if (actualHours >= 14 && actualHours <= 18) {
        greetTime.innerHTML = "Good afternoon,";
    } else if (actualHours >= 19 && actualHours <= 21) {
        greetTime.innerHTML = "Good evening,";
    } else {
        greetTime.innerHTML = "Good night,";
    }
}

function getGreetingName() {
    let user = localStorage.getItem('User');
    greetName.innerHTML = user;
}

async function getValues() {
    let response = await fetch('https://join-249-default-rtdb.europe-west1.firebasedatabase.app/tasks.json');
    let data = await response.json();

    todo.innerHTML = getCount(data, 'toDo');
    done.innerHTML = getCount(data, 'done');
    urgent.innerHTML = getUrgentTask(data);
    taskProgress.innerHTML = getCount(data, 'inProgress');
    feedback.innerHTML = getCount(data, 'awaitFeedback');
    taskBoard.innerHTML = data.length;
    tileDate.innerHTML = getUrgentDate(data);

    console.log(data);
}

function getCount(data, title) {
    let count = 0
    if (data && data.length > 0) {
        data.forEach((task) => {
           if(task.taskType == title){
            count  += 1;
           }
        });
        return count;
    }
}

function getUrgentTask (data) {
    let count = 0
    if (data && data.length > 0) {
        data.forEach((task) => {
           if(task.urgency == 'high'){
            count  += 1;
           }
        });
        return count;
    }
}


function getUrgentDate (data) {
    let dateTasks = [];
    if (data && data.length > 0) {
        data.forEach((task) => {
           dateTasks.push(task.date);
        });
        return new Date(Math.min(...dateTasks)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}
