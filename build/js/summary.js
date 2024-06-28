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

}

function getValues() {

}

