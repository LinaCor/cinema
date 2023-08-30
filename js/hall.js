let seanceData = localStorage.getItem('seance');
let parseSeanceData = JSON.parse(seanceData);

let filmHead = document.querySelector('.buying__info-title');
filmHead.innerText = parseSeanceData.filmName;
let startFilm = document.querySelector('.buying__info-start');
startFilm.innerText = `Начало сеанса: ${parseSeanceData.seanceTime}`;
let hallFilm = document.querySelector('.buying__info-hall');
hallFilm.innerText = parseSeanceData.hallName;
let costStandartFilm = document.querySelector('.price-standart');
costStandartFilm.innerText = parseSeanceData.hallPriceStandart;
let costViptFilm = document.querySelector('.price-vip');
costViptFilm.innerText = parseSeanceData.hallPriceVip;

let wrapper = document.querySelector('.conf-step__wrapper');

sendRequest('POST', 'https://jscp-diplom.netoserver.ru/', `event=get_hallConfig&timestamp=${parseSeanceData.timeStampSeance}&hallId=${parseSeanceData.hallId}&seanceId=${parseSeanceData.seanceId}`, function (response) {
  console.log(response);

  //if (response) {
  //  parseSeanceData.hallConfig = response;
  //}

  wrapper.innerHTML = parseSeanceData.hallConfig;

})

