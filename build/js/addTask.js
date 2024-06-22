function addTaskFunction(event) {
    event.preventDefault();
    console.log(event);
    document.getElementById("title-input").innerHTML;
    document.getElementById("textarea-input").innerHTML;
    document.getElementById("select-name").innerHTML;
    document.getElementById("date-input").innerHTML;
    document.querySelector(".clickedPrio");
    document.getElementById("title-input").innerHTML;
}

function clickUrgency(event = 0) {
    if(event === 0) {

    }
    event.stopPropagation();
    console.log(event.target);
    for (let i = 0; i < document.querySelectorAll(".choose-prio-button").length; i++) {
        document.querySelectorAll(".choose-prio-button")[i].classList.remove("clickedPrio");
    }
    event.target.classList.add("clickedPrio");
}
