function sendRequest(method, url, body, func) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.responseType = 'json';

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        let response = xhr.response;
        func(response);
      } catch (error) {
        console.log('Ошибка загрузки');
        func(null);
      }
    }
  })

  xhr.addEventListener('error', () => {
    console.log('Ошибка загрузки');
    func(null);
  })

  xhr.send(body);
}

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