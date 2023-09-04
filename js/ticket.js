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

function createQR() {
  let image = document.querySelector('.ticket__info-qr');
  let div = document.createElement('div');
  let QRinfo = `Электронный билет на фильм ${filmHead.textContent}, ряд/место: ${rowPlace.textContent} в зале ${hallFilm.textContent}, начало сеанса в ${startFilm.textContent}`;
  let QRcode1 = QRCreator(QRinfo, { image: 'SVG' });

  div.classList.add('ticket__info-qr');
  image.replaceWith(div);
  div.append(QRcode1.result);
}

document.addEventListener('DOMContentLoaded', createQR);
