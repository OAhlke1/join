let columnCardConts = document.querySelectorAll('.column-card-cont');

function shiftParticipants() {
    document.querySelectorAll('main .boardCont .board .board-column .column-card-cont .user-story').forEach((elem, index) => {
        elem.querySelectorAll(' .participants-and-urgency .participants .participant').forEach((el, i)=>{
            el.style.left = `${-7*i}px`;
        })
    })
    setEventListeners();
}
//shiftParticipants();

let appendC = function appendCard(event) {
    
    event.target.append()
}

function setEventListeners() {
    columnCardConts.forEach((elem)=>{
        elem.addEventListener('drop');
    })
}

function tiltCard(event) {
    event.stopPropagation();
    event.target.style.display = "none";
}

function tiltCardBack(event) {
    
}