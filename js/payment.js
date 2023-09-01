let seanceInfo = localStorage.getItem('seance');
let parseSeanceInfo = JSON.parse(seanceInfo);

let filmHead = document.querySelector('.ticket__title');
filmHead.innerText = parseSeanceInfo.filmName;
let hallFilm = document.querySelector('.ticket__hall');
hallFilm.innerText = parseSeanceInfo.hallName.match(/[0-9]+$/);
let startFilm = document.querySelector('.ticket__start');
startFilm.innerText = parseSeanceInfo.seanceTime;
let costTicket = document.querySelector('.ticket__cost');
let rowPlace = document.querySelector('.ticket__chairs');
let codeButton = document.querySelector('.acceptin-button');

function pasrseArrayPlace() {
  let arrayPlace = parseSeanceInfo.aboutPlaces;
  let arr = [];
  let finalCost = [];
  arrayPlace.forEach(item => {
    arr.push(`${item.row}/${item.place}`);
    finalCost.push(item.type);
  });

  rowPlace.innerText = arr.join(', ');

  let vipPlace = finalCost.filter((vip) => vip == 'vip');
  let standartPlace = finalCost.filter((stndrt) => stndrt == 'standart');
  costTicket.innerText = vipPlace.length * Number(parseSeanceInfo.hallPriceVip) + standartPlace.length * Number(parseSeanceInfo.hallPriceStandart);
}

pasrseArrayPlace();

let actualHallConfig = parseSeanceInfo.hallConfig.replace(/selected/g, 'taken');
parseSeanceInfo.hallConfig = actualHallConfig;
parseSeanceInfo.places = rowPlace.innerText;

codeButton.addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.setItem('seance', JSON.stringify(parseSeanceInfo));
  sendRequest('POST', 'https://jscp-diplom.netoserver.ru/', `event=sale_add&timestamp=${parseSeanceInfo.timeStampSeance}&hallId=${parseSeanceInfo.hallId}&seanceId=${parseSeanceInfo.seanceId}&hallConfiguration=${parseSeanceInfo.hallConfig}`);
})
