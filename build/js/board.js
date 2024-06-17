function shiftParticipants() {
    document.querySelectorAll('main .boardCont .board .board-column .column-card-cont .user-story').forEach((elem, index) => {
        elem.querySelectorAll(' .participants-and-urgency .participants .participant').forEach((el, i)=>{
            el.style.left = `${-7*i}px`;
        })
    })
}
shiftParticipants();