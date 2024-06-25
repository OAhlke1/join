let tasks = [];
let participants = [];
let name, sureName, lastName;
let selectedPrio = "";

function addTask(event) {
    event.preventDefault();
    tasks.push({
        title: document.getElementById("title-input").value,
        storyDescrip: document.getElementById("textarea-input").value,
        name: document.getElementById("selected-name").value,
        date: document.getElementById("date-input").value,
        urgency: selectedPrio,
        subtask: document.getElementById("choose-subtasks").value,
    });
    console.log(tasks);
}

function choosePrio(prio, buttonId) {
    document.getElementById("prio-urgent-button").classList.remove("prio-urgent-button-bg-color");
    document.getElementById("prio-medium-button").classList.remove("prio-medium-button-bg-color");
    document.getElementById("prio-low-button").classList.remove("prio-low-button-bg-color");

    document.getElementById(buttonId).classList.add(buttonId + "-bg-color");
    document.getElementById("prio-" + prio).classList.add("prio-" + prio + "-span-color");

    selectedPrio = prio;
}

function loadParticipants() {
    let nameParticipant = document.getElementById(`selected-name`).innerHTML.split("");
    console.log(nameParticipant);
    document.querySelectorAll("#select-name option").forEach((elem) => {
        elem.removeAttribute("selected");
    });
}
