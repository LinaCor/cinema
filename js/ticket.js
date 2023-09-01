let ticketInfo = localStorage.getItem('seance');
let parseTicketInfo = JSON.parse(ticketInfo);

let filmHead = document.querySelector('.ticket__title');
filmHead.innerText = parseTicketInfo.filmName;
let rowPlace = document.querySelector('.ticket__chairs');
rowPlace.innerText = parseTicketInfo.places;
let hallFilm = document.querySelector('.ticket__hall');
hallFilm.innerText = parseTicketInfo.hallName.match(/[0-9]+$/);
let startFilm = document.querySelector('.ticket__start');
startFilm.innerText = parseTicketInfo.seanceTime;